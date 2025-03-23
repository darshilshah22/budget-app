"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudget = exports.updateBudget = exports.getBudgetById = exports.getBudgets = exports.createBudget = void 0;
const express_validator_1 = require("express-validator");
const budget_model_1 = __importDefault(require("../models/budget.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
// Create budget
const createBudget = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json((0, response_1.errorResponse)('Validation error', errors.array()));
        }
        const { category, amount, period, startDate, endDate } = req.body;
        // Check if budget already exists for this category and period
        const existingBudget = await budget_model_1.default.findOne({
            userId: req.user._id,
            category,
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
        });
        if (existingBudget) {
            return res.status(400).json({ message: 'Budget already exists for this period' });
        }
        const budget = new budget_model_1.default({
            userId: req.user._id,
            category,
            amount,
            period,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });
        await budget.save();
        res.status(201).json((0, response_1.successResponse)('Budget created successfully', budget));
    }
    catch (error) {
        logger_1.default.error('Error creating budget:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.createBudget = createBudget;
// Get all budgets
const getBudgets = async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;
        const query = {
            userId: req.user._id,
            isActive: true
        };
        if (period) {
            query.period = period;
        }
        if (startDate) {
            query.startDate = { ...query.startDate, $gte: new Date(startDate) };
        }
        if (endDate) {
            query.endDate = { ...query.endDate, $lte: new Date(endDate) };
        }
        const budgets = await budget_model_1.default.find(query)
            .populate('category', 'name type icon color')
            .sort({ startDate: -1 });
        // Calculate spent amount for each budget
        const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
            const spent = await transaction_model_1.default.aggregate([
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
        }));
        res.json((0, response_1.successResponse)('Budgets retrieved successfully', budgetsWithSpent));
    }
    catch (error) {
        logger_1.default.error('Error getting budgets:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.getBudgets = getBudgets;
// Get budget by ID
const getBudgetById = async (req, res) => {
    try {
        const budget = await budget_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
            isActive: true
        }).populate('category', 'name type icon color');
        if (!budget) {
            return res.status(404).json((0, response_1.errorResponse)('Budget not found'));
        }
        // Calculate spent amount
        const spent = await transaction_model_1.default.aggregate([
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
        res.json((0, response_1.successResponse)('Budget retrieved successfully', budgetWithSpent));
    }
    catch (error) {
        logger_1.default.error('Error getting budget:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.getBudgetById = getBudgetById;
// Update budget
const updateBudget = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json((0, response_1.errorResponse)('Validation error', errors.array()));
        }
        const { amount, startDate, endDate } = req.body;
        const budget = await budget_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
            isActive: true
        });
        if (!budget) {
            return res.status(404).json((0, response_1.errorResponse)('Budget not found'));
        }
        if (amount)
            budget.amount = amount;
        if (startDate)
            budget.startDate = new Date(startDate);
        if (endDate)
            budget.endDate = new Date(endDate);
        await budget.save();
        res.json((0, response_1.successResponse)('Budget updated successfully', budget));
    }
    catch (error) {
        logger_1.default.error('Error updating budget:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.updateBudget = updateBudget;
// Delete budget
const deleteBudget = async (req, res) => {
    try {
        const budget = await budget_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
            isActive: true
        });
        if (!budget) {
            return res.status(404).json((0, response_1.errorResponse)('Budget not found'));
        }
        budget.isActive = false;
        await budget.save();
        logger_1.default.info(`Budget soft deleted: ${budget._id}`);
        res.json((0, response_1.successResponse)('Budget deleted successfully'));
    }
    catch (error) {
        logger_1.default.error('Error deleting budget:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.deleteBudget = deleteBudget;
