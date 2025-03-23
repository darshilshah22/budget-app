"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const budget_controller_1 = require("../controllers/budget.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Validation middleware
const budgetValidation = [
    (0, express_validator_1.body)('category')
        .isMongoId()
        .withMessage('Invalid category ID'),
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    (0, express_validator_1.body)('period')
        .isIn(['daily', 'weekly', 'monthly', 'yearly'])
        .withMessage('Invalid period'),
    (0, express_validator_1.body)('startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    (0, express_validator_1.body)('endDate')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((endDate, { req }) => {
        if (new Date(endDate) <= new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
        }
        return true;
    })
];
const updateBudgetValidation = [
    (0, express_validator_1.body)('amount')
        .optional()
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    (0, express_validator_1.body)('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    (0, express_validator_1.body)('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((endDate, { req }) => {
        if (req.body.startDate && new Date(endDate) <= new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
        }
        return true;
    })
];
// Routes
router.use(auth_middleware_1.protect); // Protect all budget routes
router.route('/')
    .post(budgetValidation, budget_controller_1.createBudget)
    .get(budget_controller_1.getBudgets);
router.route('/:id')
    .get(budget_controller_1.getBudgetById)
    .put(updateBudgetValidation, budget_controller_1.updateBudget)
    .delete(budget_controller_1.deleteBudget);
exports.default = router;
