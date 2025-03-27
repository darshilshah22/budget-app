"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUserCategories = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const express_validator_1 = require("express-validator");
const category_model_1 = __importDefault(require("../models/category.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const initializeData_1 = require("../utils/initializeData");
const response_1 = require("../utils/response");
// Create category
const createCategory = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json((0, response_1.errorResponse)('Validation error', errors.array()));
        }
        const { name, type, icon, color } = req.body;
        // Check if category already exists for this user
        const existingCategory = await category_model_1.default.findOne({
            userId: req.user?._id,
            name: name.toLowerCase()
        });
        if (existingCategory) {
            return res.status(400).json((0, response_1.errorResponse)('Category already exists'));
        }
        const category = new category_model_1.default({
            userId: req.user?._id,
            name: name.toLowerCase(),
            type,
            icon,
            color
        });
        await category.save();
        res.status(201).json((0, response_1.successResponse)('Category created successfully', category));
    }
    catch (error) {
        logger_1.default.error('Error creating category:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.createCategory = createCategory;
// Get all categories
const getCategories = async (req, res) => {
    try {
        const { type } = req.query;
        const query = {
            userId: req.user?._id,
            isActive: true
        };
        if (type) {
            query.type = type;
        }
        const categories = await category_model_1.default.find(query).sort({ name: 1 });
        res.json((0, response_1.successResponse)('Categories retrieved successfully', categories));
    }
    catch (error) {
        logger_1.default.error('Error getting categories:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.getCategories = getCategories;
// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await category_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user?._id,
            isActive: true
        });
        if (!category) {
            return res.status(404).json((0, response_1.errorResponse)('Category not found'));
        }
        res.json((0, response_1.successResponse)('Category retrieved successfully', category));
    }
    catch (error) {
        logger_1.default.error('Error getting category:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.getCategoryById = getCategoryById;
// Update category
const updateCategory = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json((0, response_1.errorResponse)('Validation error', errors.array()));
        }
        const { name, icon, color } = req.body;
        const category = await category_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user?._id,
            isActive: true
        });
        if (!category) {
            return res.status(404).json((0, response_1.errorResponse)('Category not found'));
        }
        if (name) {
            const existingCategory = await category_model_1.default.findOne({
                userId: req.user?._id,
                name: name.toLowerCase(),
                _id: { $ne: req.params.id }
            });
            if (existingCategory) {
                return res.status(400).json((0, response_1.errorResponse)('Category name already exists'));
            }
            category.name = name.toLowerCase();
        }
        if (icon)
            category.icon = icon;
        if (color)
            category.color = color;
        await category.save();
        res.json((0, response_1.successResponse)('Category updated successfully', category));
    }
    catch (error) {
        logger_1.default.error('Error updating category:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await category_model_1.default.findOne({
            _id: req.params.id,
            userId: req.user?._id,
            isDefault: false,
            isActive: true
        });
        if (!category) {
            return res.status(404).json((0, response_1.errorResponse)('Category not found or cannot be deleted'));
        }
        category.isActive = false;
        await category.save();
        logger_1.default.info(`Category soft deleted: ${category.name}`);
        res.json((0, response_1.successResponse)('Category deleted successfully'));
    }
    catch (error) {
        logger_1.default.error('Error deleting category:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.deleteCategory = deleteCategory;
const initializeUserCategories = async (req, res) => {
    try {
        const userId = req.user?._id;
        // Check if user already has categories
        const existingCategories = await category_model_1.default.find({ userId });
        if (existingCategories.length > 0) {
            return res.status(400).json((0, response_1.errorResponse)('Categories already initialized for this user'));
        }
        // Initialize categories
        await (0, initializeData_1.initializeCategories)(userId?.toString() || '');
        // Fetch the created categories
        const categories = await category_model_1.default.find({ userId });
        logger_1.default.info(`Categories initialized for user: ${userId}`);
        res.status(201).json((0, response_1.successResponse)('Categories initialized successfully', categories));
    }
    catch (error) {
        logger_1.default.error('Error initializing categories:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.initializeUserCategories = initializeUserCategories;
