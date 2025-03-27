"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const jwt_1 = require("../utils/jwt");
const logger_1 = __importDefault(require("../utils/logger"));
// Register user
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(new ApiError_1.ApiError(400, "Validation error", errors.array()));
        }
        const { firstName, lastName, email, password } = req.body;
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json(new ApiError_1.ApiError(400, "User already exists"));
        }
        // Create new user
        const user = await user_model_1.default.create({
            firstName,
            lastName,
            email,
            password,
        });
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString());
        logger_1.default.info(`New user registered: ${user.email}`);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, "User registered successfully", {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token,
        }));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, "Internal server error"));
        }
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(new ApiError_1.ApiError(400, "Validation error", errors.array()));
        }
        const { email, password } = req.body;
        // Find user
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json(new ApiError_1.ApiError(401, "Invalid credentials"));
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(new ApiError_1.ApiError(401, "Invalid credentials"));
        }
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString());
        logger_1.default.info(`User logged in: ${user.email}`);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, "Login successful", {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token,
        }));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, "Internal server error"));
        }
    }
};
exports.login = login;
// Get user profile
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError_1.ApiError(401, "Not authenticated"));
        }
        const user = await user_model_1.default.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json(new ApiError_1.ApiError(404, "User not found"));
        }
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, "Profile retrieved successfully", user));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, "Internal server error"));
        }
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError_1.ApiError(401, "Not authenticated"));
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(new ApiError_1.ApiError(400, "Validation error", errors.array()));
        }
        const { firstName, lastName, email, currency, timezone } = req.body;
        const user = await user_model_1.default.findByIdAndUpdate(req.user._id, { firstName, lastName, email, currency, timezone }, { new: true, runValidators: true }).select("-password");
        if (!user) {
            return res.status(404).json(new ApiError_1.ApiError(404, "User not found"));
        }
        logger_1.default.info(`User profile updated: ${user.email}`);
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, "Profile updated successfully", user));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, "Internal server error"));
        }
    }
};
exports.updateProfile = updateProfile;
// Update password
const updatePassword = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json(new ApiError_1.ApiError(401, "Not authenticated"));
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(new ApiError_1.ApiError(400, "Validation error", errors.array()));
        }
        const { currentPassword, newPassword } = req.body;
        const user = await user_model_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json(new ApiError_1.ApiError(404, "User not found"));
        }
        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res
                .status(401)
                .json(new ApiError_1.ApiError(401, "Current password is incorrect"));
        }
        // Update password
        user.password = newPassword;
        await user.save();
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, "Password updated successfully", null));
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json(new ApiError_1.ApiError(400, error.message));
        }
        else {
            res.status(500).json(new ApiError_1.ApiError(500, "Internal server error"));
        }
    }
};
exports.updatePassword = updatePassword;
