"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId) => {
    const secret = (process.env.JWT_SECRET || 'your_jwt_secret_key');
    const options = {
        expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    };
    return jsonwebtoken_1.default.sign({ userId }, secret, options);
};
exports.generateToken = generateToken;
