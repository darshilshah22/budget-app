"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./utils/logger"));
// Import routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// Import middleware
const error_middleware_1 = require("./middleware/error.middleware");
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') // limit each IP
});
app.use(limiter);
// Routes
app.use('/api/users', user_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/budgets', budget_routes_1.default);
app.use('/api/categories', category_routes_1.default);
// Error handling
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/budget-app';
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    logger_1.default.info('Connected to MongoDB');
})
    .catch((err) => {
    logger_1.default.error('MongoDB connection error:', err);
    process.exit(1);
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger_1.default.info(`Server is running on port ${PORT}`);
});
