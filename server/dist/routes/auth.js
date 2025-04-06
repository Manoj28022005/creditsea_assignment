"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importStar(require("../models/User"));
const auth_1 = require("../middleware/auth");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Register a new user
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = new User_1.default({
            fullName,
            email,
            password,
            role: User_1.UserRole.USER
        });
        yield user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '1d' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
}));
// Login user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '1d' });
        res.json({ user, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
}));
// Get all admins (admin only)
router.get('/admins', (0, auth_1.auth)([User_1.UserRole.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield User_1.default.find({ role: User_1.UserRole.ADMIN });
        res.json(admins);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching admins' });
    }
}));
// Add new admin (admin only)
router.post('/add-admin', (0, auth_1.auth)([User_1.UserRole.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new admin
        const admin = new User_1.default({
            fullName,
            email,
            password,
            role: User_1.UserRole.ADMIN
        });
        yield admin.save();
        res.status(201).json(admin);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating admin' });
    }
}));
// Delete admin (admin only)
router.delete('/admins/:id', (0, auth_1.auth)([User_1.UserRole.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield User_1.default.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ message: 'Admin deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting admin' });
    }
}));
// Create admin and verifier users
router.post('/create-default-users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if users already exist
        const adminExists = yield User_1.default.findOne({ email: 'admin@creditsea.com' });
        const verifierExists = yield User_1.default.findOne({ email: 'verifier@creditsea.com' });
        if (adminExists && verifierExists) {
            return res.json({ message: 'Default users already exist' });
        }
        // Create admin user
        if (!adminExists) {
            const adminPassword = yield bcryptjs_1.default.hash('admin123', 10);
            const admin = new User_1.default({
                fullName: 'Admin User',
                email: 'admin@creditsea.com',
                password: adminPassword,
                role: User_1.UserRole.ADMIN
            });
            yield admin.save();
            console.log('Admin user created');
        }
        // Create verifier user
        if (!verifierExists) {
            const verifierPassword = yield bcryptjs_1.default.hash('verifier123', 10);
            const verifier = new User_1.default({
                fullName: 'Verifier User',
                email: 'verifier@creditsea.com',
                password: verifierPassword,
                role: User_1.UserRole.VERIFIER
            });
            yield verifier.save();
            console.log('Verifier user created');
        }
        res.json({ message: 'Default users created successfully' });
    }
    catch (error) {
        console.error('Error creating default users:', error);
        res.status(500).json({ message: 'Error creating default users' });
    }
}));
exports.default = router;
