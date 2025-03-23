"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Validation middleware
const categoryValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Category name is required')
        .trim(),
    (0, express_validator_1.body)('type')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    (0, express_validator_1.body)('icon')
        .optional()
        .isString()
        .withMessage('Icon must be a string'),
    (0, express_validator_1.body)('color')
        .optional()
        .isString()
        .withMessage('Color must be a string')
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('Color must be a valid hex color code')
];
const updateCategoryValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .notEmpty()
        .withMessage('Category name cannot be empty')
        .trim(),
    (0, express_validator_1.body)('icon')
        .optional()
        .isString()
        .withMessage('Icon must be a string'),
    (0, express_validator_1.body)('color')
        .optional()
        .isString()
        .withMessage('Color must be a string')
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('Color must be a valid hex color code')
];
// Routes
router.use(auth_middleware_1.protect); // Protect all category routes
router.route('/')
    .post(categoryValidation, category_controller_1.createCategory)
    .get(category_controller_1.getCategories);
router.route('/:id')
    .get(category_controller_1.getCategoryById)
    .put(updateCategoryValidation, category_controller_1.updateCategory)
    .delete(category_controller_1.deleteCategory);
// Initialize categories for user
router.post('/initialize', auth_middleware_1.protect, category_controller_1.initializeUserCategories);
exports.default = router;
