"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.createTransaction = void 0;
const express_validator_1 = require("express-validator");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
// Create transaction
const createTransaction = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json((0, response_1.errorResponse)('Validation error', errors.array()));
        }
        const { type, amount, category, description, date, tags } = req.body;
        const transaction = new transaction_model_1.default({
            userId: req.user._id,
            type,
            amount,
            category,
            description,
            date: date || new Date(),
            tags
        });
        await transaction.save();
        res.status(201).json((0, response_1.successResponse)('Transaction created successfully', transaction));
    }
    catch (error) {
        logger_1.default.error('Error creating transaction:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.createTransaction = createTransaction;
// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, type, category } = req.query;
        const query = {
            userId: req.user._id,
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
        const transactions = await transaction_model_1.default.find(query)
            .sort({ date: -1 })
            .populate('category', 'name type icon color');
        res.json((0, response_1.successResponse)('Transactions retrieved successfully', transactions));
    }
    catch (error) {
        logger_1.default.error('Error getting transactions:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.getTransactions = getTransactions;
// Get transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await transaction_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
            isActive: true
        }).populate('category', 'name type icon color');
        if (!transaction) {
            return res.status(404).json((0, response_1.errorResponse)('Transaction not found'));
        }
        res.json((0, response_1.successResponse)('Transaction retrieved successfully', transaction));
    }
    catch (error) {
        logger_1.default.error('Error getting transaction:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.getTransactionById = getTransactionById;
// Update transaction
const updateTransaction = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json((0, response_1.errorResponse)('Validation error', errors.array()));
        }
        const { type, amount, category, description, date, tags } = req.body;
        const transaction = await transaction_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
            isActive: true
        });
        if (!transaction) {
            return res.status(404).json((0, response_1.errorResponse)('Transaction not found'));
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
        if (tags)
            transaction.tags = tags;
        await transaction.save();
        res.json((0, response_1.successResponse)('Transaction updated successfully', transaction));
    }
    catch (error) {
        logger_1.default.error('Error updating transaction:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.updateTransaction = updateTransaction;
// Delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await transaction_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
            isActive: true
        });
        if (!transaction) {
            return res.status(404).json((0, response_1.errorResponse)('Transaction not found'));
        }
        transaction.isActive = false;
        await transaction.save();
        logger_1.default.info(`Transaction soft deleted: ${transaction._id}`);
        res.json((0, response_1.successResponse)('Transaction deleted successfully'));
    }
    catch (error) {
        logger_1.default.error('Error deleting transaction:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.deleteTransaction = deleteTransaction;
