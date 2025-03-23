import express from 'express';
import { body } from 'express-validator';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transaction.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const transactionValidation = [
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// Routes
router.use(protect); // Protect all transaction routes

router.route('/')
  .post(transactionValidation, createTransaction)
  .get(getTransactions);

router.route('/:id')
  .get(getTransactionById)
  .put(transactionValidation, updateTransaction)
  .delete(deleteTransaction);

export default router; 