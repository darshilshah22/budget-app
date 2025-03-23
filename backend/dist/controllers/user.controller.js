"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
const generateToken = (userId) => {
    const secret = (process.env.JWT_SECRET || 'your_jwt_secret_key');
    const options = {
        expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    };
    return jsonwebtoken_1.default.sign({ userId }, secret, options);
};
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json((0, response_1.errorResponse)('Validation error', errors.array()));
        }
        const { email, password, firstName, lastName } = req.body;
        // Check if user exists
        let user = await user_model_1.default.findOne({ email });
        if (user) {
            return res.status(400).json((0, response_1.errorResponse)('User already exists, Use different email'));
        }
        // Create user
        user = new user_model_1.default({
            email,
            password,
            firstName,
            lastName
        });
        await user.save();
        if (!user._id) {
            throw new Error('User ID not generated');
        }
        // Generate token
        const token = generateToken(user._id.toString());
        logger_1.default.info(`New user registered: ${user.email}`);
        res.status(201).json((0, response_1.successResponse)('User registered successfully', {
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        }));
    }
    catch (error) {
        logger_1.default.error('Error in user registration:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json((0, response_1.errorResponse)('Validation error', errors.array()));
        }
        const { email, password } = req.body;
        // Check if user exists
        const user = await user_model_1.default.findOne({ email });
        if (!user || !user._id) {
            return res.status(400).json((0, response_1.errorResponse)('Invalid credentials'));
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json((0, response_1.errorResponse)('Invalid credentials'));
        }
        // Generate token
        const token = generateToken(user._id.toString());
        logger_1.default.info(`User logged in: ${user.email}`);
        res.json((0, response_1.successResponse)('Login successful', {
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        }));
    }
    catch (error) {
        logger_1.default.error('Error in user login:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json((0, response_1.errorResponse)('User not found'));
        }
        res.json((0, response_1.successResponse)('Profile retrieved successfully', user));
    }
    catch (error) {
        logger_1.default.error('Error getting user profile:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, currency, timezone } = req.body;
        const user = await user_model_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json((0, response_1.errorResponse)('User not found'));
        }
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (currency)
            user.currency = currency;
        if (timezone)
            user.timezone = timezone;
        await user.save();
        logger_1.default.info(`User profile updated: ${user.email}`);
        res.json((0, response_1.successResponse)('Profile updated successfully', user));
    }
    catch (error) {
        logger_1.default.error('Error updating user profile:', error);
        res.status(500).json((0, response_1.errorResponse)('Server error', error));
    }
};
exports.updateProfile = updateProfile;
