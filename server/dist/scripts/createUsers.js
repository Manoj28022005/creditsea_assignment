"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not defined in the environment variables');
            process.exit(1);
        }
        yield mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Create admin user
        const adminPassword = yield bcryptjs_1.default.hash('admin123', 10);
        const admin = new User_1.default({
            fullName: 'Admin User',
            email: 'admin@creditsea.com',
            password: adminPassword,
            role: 'admin'
        });
        // Create verifier user
        const verifierPassword = yield bcryptjs_1.default.hash('verifier123', 10);
        const verifier = new User_1.default({
            fullName: 'Verifier User',
            email: 'verifier@creditsea.com',
            password: verifierPassword,
            role: 'verifier'
        });
        // Save users
        yield admin.save();
        yield verifier.save();
        console.log('Users created successfully:');
        console.log('Admin:', {
            email: admin.email,
            role: admin.role
        });
        console.log('Verifier:', {
            email: verifier.email,
            role: verifier.role
        });
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating users:', error);
        process.exit(1);
    }
});
createUsers();
