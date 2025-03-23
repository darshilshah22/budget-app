import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Budget from '../models/budget.model';
import Transaction from '../models/transaction.model';
import logger from '../utils/logger';
import { successResponse, errorResponse } from '../utils/response';

// Create budget
export const createBudget = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    const { category, amount, period, startDate, endDate } = req.body;

    // Check if budget already exists for this category and period
    const existingBudget = await Budget.findOne({
      userId: req.user._id,
      category,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) }
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this period' });
    }

    const budget = new Budget({
      userId: req.user._id,
      category,
      amount,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });

    await budget.save();
    res.status(201).json(successResponse('Budget created successfully', budget));
  } catch (error) {
    logger.error('Error creating budget:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Get all budgets
export const getBudgets = async (req: Request, res: Response) => {
  try {
    const { period, startDate, endDate } = req.query;
    const query: any = { 
      userId: req.user._id,
      isActive: true
    };

    if (period) {
      query.period = period;
    }
    if (startDate) {
      query.startDate = { ...query.startDate, $gte: new Date(startDate as string) };
    }
    if (endDate) {
      query.endDate = { ...query.endDate, $lte: new Date(endDate as string) };
    }

    const budgets = await Budget.find(query)
      .populate('category', 'name type icon color')
      .sort({ startDate: -1 });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: budget.userId,
              category: budget.category,
              date: { $gte: budget.startDate, $lte: budget.endDate },
              isActive: true
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        return {
          ...budget.toObject(),
          spent: spent[0]?.total || 0
        };
      })
    );

    res.json(successResponse('Budgets retrieved successfully', budgetsWithSpent));
  } catch (error) {
    logger.error('Error getting budgets:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Get budget by ID
export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    }).populate('category', 'name type icon color');

    if (!budget) {
      return res.status(404).json(errorResponse('Budget not found'));
    }

    // Calculate spent amount
    const spent = await Transaction.aggregate([
      {
        $match: {
          userId: budget.userId,
          category: budget.category,
          date: { $gte: budget.startDate, $lte: budget.endDate },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const budgetWithSpent = {
      ...budget.toObject(),
      spent: spent[0]?.total || 0
    };

    res.json(successResponse('Budget retrieved successfully', budgetWithSpent));
  } catch (error) {
    logger.error('Error getting budget:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Update budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    const { amount, startDate, endDate } = req.body;
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!budget) {
      return res.status(404).json(errorResponse('Budget not found'));
    }

    if (amount) budget.amount = amount;
    if (startDate) budget.startDate = new Date(startDate);
    if (endDate) budget.endDate = new Date(endDate);

    await budget.save();
    res.json(successResponse('Budget updated successfully', budget));
  } catch (error) {
    logger.error('Error updating budget:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Delete budget
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!budget) {
      return res.status(404).json(errorResponse('Budget not found'));
    }

    budget.isActive = false;
    await budget.save();
    
    logger.info(`Budget soft deleted: ${budget._id}`);
    res.json(successResponse('Budget deleted successfully'));
  } catch (error) {
    logger.error('Error deleting budget:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
}; 