import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Transaction from '../models/transaction.model';
import logger from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { Budget } from '../models/budget.model';

// Create transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ApiError(400, 'Validation error', errors.array()));
    }

    const { type, amount, category, description, date, paymentType } = req.body;

    const transaction = new Transaction({
      userId: req.user?._id,
      type,
      amount,
      category,
      description,
      date: date || new Date(),
      paymentType
    });

    await transaction.save();

    // If it's an expense transaction, update the corresponding budget
    if (transaction.type === 'expense') {
      // Find the matching budget for this transaction
      const budget = await Budget.findOne({
        user: req.user?._id,
        category: transaction.category,
        isActive: true,
        startDate: { $lte: transaction.date },
        endDate: { $gte: transaction.date }
      });

      if (budget) {
        // Calculate new spent amount
        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: req.user?._id,
              category: transaction.category,
              date: { $gte: budget.startDate, $lte: budget.endDate },
              type: 'expense'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const totalSpent = spent[0]?.total || 0;
        const remaining = budget.amount - totalSpent;

        console.log(totalSpent, remaining);
        // Update budget with new spent and remaining amounts
        await Budget.findByIdAndUpdate(budget._id, {
          $set: { 
            spent: totalSpent,
            remaining: remaining
          }
        });
      }
    }

    res.status(201).json(new ApiResponse(201, 'Transaction created successfully', transaction));
  } catch (error) {
    logger.error('Error creating transaction:', error);
    res.status(500).json(new ApiError(500, 'Server error', error));
  }
};

// Get all transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type, category, paymentType } = req.query;
    const query: any = { 
      userId: req.user?._id,
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
    if (paymentType) {
      query.paymentType = paymentType;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 });
    res.status(200).json(new ApiResponse(200, 'Transactions retrieved successfully', transactions));
  } catch (error) {
    logger.error('Error getting transactions:', error);
    res.status(500).json(new ApiError(500, 'Server error', error));
  }
};

// Get transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user?._id,
      isActive: true
    });

    if (!transaction) {
      return res.status(404).json(new ApiError(404, 'Transaction not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Transaction retrieved successfully', transaction));
  } catch (error) {
    logger.error('Error getting transaction:', error);
    res.status(500).json(new ApiError(500, 'Server error', error));
  }
};

// Update transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ApiError(400, 'Validation error', errors.array()));
    }

    const { type, amount, category, description, date, paymentType } = req.body;
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user?._id,
      isActive: true
    });

    if (!transaction) {
      return res.status(404).json(new ApiError(404, 'Transaction not found'));
    }

    if (type) transaction.type = type;
    if (amount) transaction.amount = amount;
    if (category) transaction.category = category;
    if (description) transaction.description = description;
    if (date) transaction.date = date;
    if (paymentType) transaction.paymentType = paymentType;

    await transaction.save();

    // If it's an expense transaction, update the corresponding budget
    if (transaction.type === 'expense') {
      // Find the matching budget for this transaction
      const budget = await Budget.findOne({
        user: req.user?._id,
        category: transaction.category,
        isActive: true,
        startDate: { $lte: transaction.date },
        endDate: { $gte: transaction.date }
      });

      if (budget) {
        // Calculate new spent amount
        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: req.user?._id,
              category: transaction.category,
              date: { $gte: budget.startDate, $lte: budget.endDate },
              type: 'expense'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const totalSpent = spent[0]?.total || 0;
        const remaining = budget.amount - totalSpent;

        // Update budget with new spent and remaining amounts
        await Budget.findByIdAndUpdate(budget._id, {
          $set: { 
            spent: totalSpent,
            remaining: remaining
          }
        });
      }
    }

    res.status(200).json(new ApiResponse(200, 'Transaction updated successfully', transaction));
  } catch (error) {
    logger.error('Error updating transaction:', error);
    res.status(500).json(new ApiError(500, 'Server error', error));
  }
};

// Delete transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user?._id,
      isActive: true
    });

    if (!transaction) {
      return res.status(404).json(new ApiError(404, 'Transaction not found'));
    }

    transaction.isActive = false;
    await transaction.save();
    
    logger.info(`Transaction soft deleted: ${transaction._id}`);

    // If it's an expense transaction, update the corresponding budget
    if (transaction.type === 'expense') {
      // Find the matching budget for this transaction
      const budget = await Budget.findOne({
        user: req.user?._id,
        category: transaction.category,
        isActive: true,
        startDate: { $lte: transaction.date },
        endDate: { $gte: transaction.date }
      });

      if (budget) {
        // Calculate new spent amount
        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: req.user?._id,
              category: transaction.category,
              date: { $gte: budget.startDate, $lte: budget.endDate },
              type: 'expense'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const totalSpent = spent[0]?.total || 0;
        const remaining = budget.amount - totalSpent;

        // Update budget with new spent and remaining amounts
        await Budget.findByIdAndUpdate(budget._id, {
          $set: { 
            spent: totalSpent,
            remaining: remaining
          }
        });
      }
    }

    res.status(200).json(new ApiResponse(200, 'Transaction deleted successfully', transaction));
  } catch (error) {
    logger.error('Error deleting transaction:', error);
    res.status(500).json(new ApiError(500, 'Server error', error));
  }
}; 