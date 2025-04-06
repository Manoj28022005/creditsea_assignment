"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const loans_1 = __importDefault(require("./routes/loans"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.method !== 'GET') {
        console.log('Body:', req.body);
    }
    next();
});
// Root API route
app.get('/api', (req, res) => {
    res.json({
        message: 'Credit Sea API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            loans: '/api/loans',
            health: '/api/health'
        },
        status: 'operational',
        timestamp: new Date().toISOString()
    });
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    console.log('Health check requested at:', new Date().toISOString());
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongoStatus: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected',
        serverTime: new Date().toISOString()
    });
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/loans', loans_1.default);
// Handle 404 - Route not found
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        message: 'Route not found',
        path: req.url,
        method: req.method,
        availableEndpoints: {
            auth: '/api/auth',
            loans: '/api/loans',
            health: '/api/health'
        }
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/credit-sea';
console.log('Attempting to connect to MongoDB...');
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('MongoDB connection state:', mongoose_1.default.connection.readyState);
    const PORT = process.env.PORT || 5111;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`API root available at: http://localhost:${PORT}/api`);
        console.log(`Health check available at: http://localhost:${PORT}/api/health`);
        console.log('Server startup complete at:', new Date().toISOString());
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', {
        message: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack
    });
    process.exit(1);
});
// Add MongoDB connection event listeners
mongoose_1.default.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
mongoose_1.default.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});
exports.default = app;
