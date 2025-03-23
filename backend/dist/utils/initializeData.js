"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCategories = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const logger_1 = __importDefault(require("./logger"));
const defaultCategories = {
    expense: [
        { name: 'food', icon: '🍽️', color: '#FF5733' },
        { name: 'transportation', icon: '🚗', color: '#33FF57' },
        { name: 'housing', icon: '🏠', color: '#3357FF' },
        { name: 'utilities', icon: '💡', color: '#FF33F6' },
        { name: 'healthcare', icon: '🏥', color: '#33FFF6' },
        { name: 'entertainment', icon: '🎮', color: '#F6FF33' },
        { name: 'shopping', icon: '🛍️', color: '#FF3333' },
        { name: 'education', icon: '📚', color: '#33FF33' },
        { name: 'personal care', icon: '💅', color: '#3333FF' },
        { name: 'other', icon: '📦', color: '#CCCCCC' }
    ],
    income: [
        { name: 'salary', icon: '💰', color: '#33FF57' },
        { name: 'freelance', icon: '💻', color: '#3357FF' },
        { name: 'investments', icon: '📈', color: '#FF5733' },
        { name: 'gifts', icon: '🎁', color: '#FF33F6' },
        { name: 'other', icon: '📦', color: '#CCCCCC' }
    ]
};
const initializeCategories = async (userId) => {
    try {
        // Check if user already has default categories
        const existingCategories = await category_model_1.default.find({ userId, isDefault: true });
        if (existingCategories.length > 0) {
            return;
        }
        // Create expense categories
        const expenseCategories = defaultCategories.expense.map(cat => ({
            userId,
            name: cat.name,
            type: 'expense',
            icon: cat.icon,
            color: cat.color,
            isDefault: true
        }));
        // Create income categories
        const incomeCategories = defaultCategories.income.map(cat => ({
            userId,
            name: cat.name,
            type: 'income',
            icon: cat.icon,
            color: cat.color,
            isDefault: true
        }));
        await category_model_1.default.insertMany([...expenseCategories, ...incomeCategories]);
        logger_1.default.info(`Default categories created for user ${userId}`);
    }
    catch (error) {
        logger_1.default.error('Error creating default categories:', error);
        throw error;
    }
};
exports.initializeCategories = initializeCategories;
