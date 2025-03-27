"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudget = exports.updateBudget = exports.getBudgetById = exports.getBudgets = exports.createBudget = void 0;
const budget_model_1 = require("../models/budget.model");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const express_validator_1 = require("express-validator");
// Create budget
const createBudget = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(new ApiError_1.ApiError(400, 'Validation error', errors.array()));
        }
        // Check if a budget with the same category already exists
        const existingBudget = await budget_model_1.Budget.findOne({
            user: req.user?._id,
            category: req.body.category,
            isActive: true
        });
        if (existingBudget) {
            return res.status(400).json(new ApiError_1.ApiError(400, `A budget for category "${req.body.category}" already exists`));
        }
        const budget = await budget_model_1.Budget.create({
            ...req.body,
            user: req.user?._id,
            isActive: true
        });
        res.status(201).json(new ApiResponse_1.ApiResponse(201, 'Budget created successfully', budget));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, 'Internal server error'));
        }
    }
};
exports.createBudget = createBudget;
// Get all budgets
const getBudgets = async (req, res) => {
    try {
        const budgets = await budget_model_1.Budget.find({ user: req.user?._id })
            .sort({ createdAt: -1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Budgets retrieved successfully', budgets));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, 'Internal server error'));
        }
    }
};
exports.getBudgets = getBudgets;
// Get budget by ID
const getBudgetById = async (req, res) => {
    try {
        const budget = await budget_model_1.Budget.findOne({
            _id: req.params.id,
            user: req.user?._id
        });
        if (!budget) {
            return res.status(404).json(new ApiError_1.ApiError(404, 'Budget not found'));
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Budget retrieved successfully', budget));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, 'Internal server error'));
        }
    }
};
exports.getBudgetById = getBudgetById;
// Update budget
const updateBudget = async (req, res) => {
    try {
        const budget = await budget_model_1.Budget.findOneAndUpdate({ _id: req.params.id, user: req.user?._id }, { $set: req.body }, { new: true, runValidators: true });
        if (!budget) {
            return res.status(404).json(new ApiError_1.ApiError(404, 'Budget not found'));
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Budget updated successfully', budget));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, 'Internal server error'));
        }
    }
};
exports.updateBudget = updateBudget;
// Delete budget
const deleteBudget = async (req, res) => {
    try {
        const budget = await budget_model_1.Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.user?._id
        });
        if (!budget) {
            return res.status(404).json(new ApiError_1.ApiError(404, 'Budget not found'));
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Budget deleted successfully', budget));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, 'Internal server error'));
        }
    }
};
exports.deleteBudget = deleteBudget;
