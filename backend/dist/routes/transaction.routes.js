"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Validation middleware for create operation
const createTransactionValidation = [
    (0, express_validator_1.body)('type')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    (0, express_validator_1.body)('category')
        .notEmpty()
        .withMessage('Category is required')
        .isString()
        .withMessage('Category must be a string')
        .trim(),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .trim(),
    (0, express_validator_1.body)('date')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('paymentType')
        .isIn(['online', 'cash'])
        .withMessage('Payment type must be either online or cash')
];
// Validation middleware for update operation
const updateTransactionValidation = [
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    (0, express_validator_1.body)('amount')
        .optional()
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    (0, express_validator_1.body)('category')
        .optional()
        .isString()
        .withMessage('Category must be a string')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim(),
    (0, express_validator_1.body)('date')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('paymentType')
        .optional()
        .isIn(['online', 'cash'])
        .withMessage('Payment type must be either online or cash')
];
// Routes
router.use(auth_middleware_1.protect); // Protect all transaction routes
router.route('/')
    .post(createTransactionValidation, transaction_controller_1.createTransaction)
    .get(transaction_controller_1.getTransactions);
router.route('/:id')
    .get(transaction_controller_1.getTransactionById)
    .put(updateTransactionValidation, transaction_controller_1.updateTransaction)
    .delete(transaction_controller_1.deleteTransaction);
exports.default = router;
