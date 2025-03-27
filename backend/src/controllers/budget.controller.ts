import { Request, Response } from 'express';
import { Budget } from '../models/budget.model';
import Transaction from '../models/transaction.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { validationResult } from 'express-validator';

// Create budget
export const createBudget = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ApiError(400, 'Validation error', errors.array()));
    }

    // Check if a budget with the same category already exists
    const existingBudget = await Budget.findOne({
      user: req.user?._id,
      category: req.body.category,
      isActive: true
    });

    if (existingBudget) {
      return res.status(400).json(new ApiError(400, `A budget for category "${req.body.category}" already exists`));
    }

    const budget = await Budget.create({
      ...req.body,
      user: req.user?._id,
      isActive: true
    });

    res.status(201).json(new ApiResponse(201, 'Budget created successfully', budget));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
};

// Get all budgets
export const getBudgets = async (req: Request, res: Response) => {
  try {
    const budgets = await Budget.find({ user: req.user?._id })
      .sort({ createdAt: -1 });


    res.status(200).json(new ApiResponse(200, 'Budgets retrieved successfully', budgets));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
};

// Get budget by ID
export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!budget) {
      return res.status(404).json(new ApiError(404, 'Budget not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Budget retrieved successfully', budget));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
};

// Update budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json(new ApiError(404, 'Budget not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Budget updated successfully', budget));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
};

// Delete budget
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!budget) {
      return res.status(404).json(new ApiError(404, 'Budget not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Budget deleted successfully', budget));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
}; 