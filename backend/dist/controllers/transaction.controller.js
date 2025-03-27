"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.createTransaction = void 0;
const express_validator_1 = require("express-validator");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const budget_model_1 = require("../models/budget.model");
// Create transaction
const createTransaction = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(new ApiError_1.ApiError(400, 'Validation error', errors.array()));
        }
        const { type, amount, category, description, date, paymentType } = req.body;
        const transaction = new transaction_model_1.default({
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
            const budget = await budget_model_1.Budget.findOne({
                user: req.user?._id,
                category: transaction.category,
                isActive: true,
                startDate: { $lte: transaction.date },
                endDate: { $gte: transaction.date }
            });
            if (budget) {
                // Calculate new spent amount
                const spent = await transaction_model_1.default.aggregate([
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
                await budget_model_1.Budget.findByIdAndUpdate(budget._id, {
                    $set: {
                        spent: totalSpent,
                        remaining: remaining
                    }
                });
            }
        }
        res.status(201).json(new ApiResponse_1.ApiResponse(201, 'Transaction created successfully', transaction));
    }
    catch (error) {
        logger_1.default.error('Error creating transaction:', error);
        res.status(500).json(new ApiError_1.ApiError(500, 'Server error', error));
    }
};
exports.createTransaction = createTransaction;
// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, type, category, paymentType } = req.query;
        const query = {
            userId: req.user?._id,
            isActive: true
        };
        if (startDate) {
            query.date = { ...query.date, $gte: new Date(startDate) };
        }
        if (endDate) {
            query.date = { ...query.date, $lte: new Date(endDate) };
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
        const transactions = await transaction_model_1.default.find(query)
            .sort({ date: -1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Transactions retrieved successfully', transactions));
    }
    catch (error) {
        logger_1.default.error('Error getting transactions:', error);
        res.status(500).json(new ApiError_1.ApiError(500, 'Server error', error));
    }
};
exports.getTransactions = getTransactions;
// Get transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await transaction_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user?._id,
            isActive: true
        });
        if (!transaction) {
            return res.status(404).json(new ApiError_1.ApiError(404, 'Transaction not found'));
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Transaction retrieved successfully', transaction));
    }
    catch (error) {
        logger_1.default.error('Error getting transaction:', error);
        res.status(500).json(new ApiError_1.ApiError(500, 'Server error', error));
    }
};
exports.getTransactionById = getTransactionById;
// Update transaction
const updateTransaction = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(new ApiError_1.ApiError(400, 'Validation error', errors.array()));
        }
        const { type, amount, category, description, date, paymentType } = req.body;
        const transaction = await transaction_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user?._id,
            isActive: true
        });
        if (!transaction) {
            return res.status(404).json(new ApiError_1.ApiError(404, 'Transaction not found'));
        }
        if (type)
            transaction.type = type;
        if (amount)
            transaction.amount = amount;
        if (category)
            transaction.category = category;
        if (description)
            transaction.description = description;
        if (date)
            transaction.date = date;
        if (paymentType)
            transaction.paymentType = paymentType;
        await transaction.save();
        // If it's an expense transaction, update the corresponding budget
        if (transaction.type === 'expense') {
            // Find the matching budget for this transaction
            const budget = await budget_model_1.Budget.findOne({
                user: req.user?._id,
                category: transaction.category,
                isActive: true,
                startDate: { $lte: transaction.date },
                endDate: { $gte: transaction.date }
            });
            if (budget) {
                // Calculate new spent amount
                const spent = await transaction_model_1.default.aggregate([
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
                await budget_model_1.Budget.findByIdAndUpdate(budget._id, {
                    $set: {
                        spent: totalSpent,
                        remaining: remaining
                    }
                });
            }
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Transaction updated successfully', transaction));
    }
    catch (error) {
        logger_1.default.error('Error updating transaction:', error);
        res.status(500).json(new ApiError_1.ApiError(500, 'Server error', error));
    }
};
exports.updateTransaction = updateTransaction;
// Delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await transaction_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user?._id,
            isActive: true
        });
        if (!transaction) {
            return res.status(404).json(new ApiError_1.ApiError(404, 'Transaction not found'));
        }
        transaction.isActive = false;
        await transaction.save();
        logger_1.default.info(`Transaction soft deleted: ${transaction._id}`);
        // If it's an expense transaction, update the corresponding budget
        if (transaction.type === 'expense') {
            // Find the matching budget for this transaction
            const budget = await budget_model_1.Budget.findOne({
                user: req.user?._id,
                category: transaction.category,
                isActive: true,
                startDate: { $lte: transaction.date },
                endDate: { $gte: transaction.date }
            });
            if (budget) {
                // Calculate new spent amount
                const spent = await transaction_model_1.default.aggregate([
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
                await budget_model_1.Budget.findByIdAndUpdate(budget._id, {
                    $set: {
                        spent: totalSpent,
                        remaining: remaining
                    }
                });
            }
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Transaction deleted successfully', transaction));
    }
    catch (error) {
        logger_1.default.error('Error deleting transaction:', error);
        res.status(500).json(new ApiError_1.ApiError(500, 'Server error', error));
    }
};
exports.deleteTransaction = deleteTransaction;
