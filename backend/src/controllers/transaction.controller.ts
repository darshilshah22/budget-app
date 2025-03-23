import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Transaction from '../models/transaction.model';
import logger from '../utils/logger';
import { successResponse, errorResponse } from '../utils/response';

// Create transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    const { type, amount, category, description, date, tags } = req.body;

    const transaction = new Transaction({
      userId: req.user._id,
      type,
      amount,
      category,
      description,
      date: date || new Date(),
      tags
    });

    await transaction.save();
    res.status(201).json(successResponse('Transaction created successfully', transaction));
  } catch (error) {
    logger.error('Error creating transaction:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Get all transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type, category } = req.query;
    const query: any = { 
      userId: req.user._id,
      isActive: true
    };

    if (startDate) {
      query.date = { ...query.date, $gte: new Date(startDate as string) };
    }
    if (endDate) {
      query.date = { ...query.date, $lte: new Date(endDate as string) };
    }
    if (type) {
      query.type = type;
    }
    if (category) {
      query.category = category;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .populate('category', 'name type icon color');
    res.json(successResponse('Transactions retrieved successfully', transactions));
  } catch (error) {
    logger.error('Error getting transactions:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Get transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    }).populate('category', 'name type icon color');

    if (!transaction) {
      return res.status(404).json(errorResponse('Transaction not found'));
    }

    res.json(successResponse('Transaction retrieved successfully', transaction));
  } catch (error) {
    logger.error('Error getting transaction:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Update transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    const { type, amount, category, description, date, tags } = req.body;
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!transaction) {
      return res.status(404).json(errorResponse('Transaction not found'));
    }

    if (type) transaction.type = type;
    if (amount) transaction.amount = amount;
    if (category) transaction.category = category;
    if (description) transaction.description = description;
    if (date) transaction.date = date;
    if (tags) transaction.tags = tags;

    await transaction.save();
    res.json(successResponse('Transaction updated successfully', transaction));
  } catch (error) {
    logger.error('Error updating transaction:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Delete transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!transaction) {
      return res.status(404).json(errorResponse('Transaction not found'));
    }

    transaction.isActive = false;
    await transaction.save();
    
    logger.info(`Transaction soft deleted: ${transaction._id}`);
    res.json(successResponse('Transaction deleted successfully'));
  } catch (error) {
    logger.error('Error deleting transaction:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
}; 