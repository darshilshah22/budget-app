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
// Validation middleware
const transactionValidation = [
    (0, express_validator_1.body)('type')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    (0, express_validator_1.body)('category')
        .isMongoId()
        .withMessage('Invalid category ID'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .trim(),
    (0, express_validator_1.body)('date')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];
// Routes
router.use(auth_middleware_1.protect); // Protect all transaction routes
router.route('/')
    .post(transactionValidation, transaction_controller_1.createTransaction)
    .get(transaction_controller_1.getTransactions);
router.route('/:id')
    .get(transaction_controller_1.getTransactionById)
    .put(transactionValidation, transaction_controller_1.updateTransaction)
    .delete(transaction_controller_1.deleteTransaction);
exports.default = router;
