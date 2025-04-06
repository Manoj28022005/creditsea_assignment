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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importStar(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const initialUsers = [
    {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: User_1.UserRole.ADMIN
    },
    {
        fullName: 'Verifier User',
        email: 'verifier@example.com',
        password: 'verifier123',
        role: User_1.UserRole.VERIFIER
    },
    {
        fullName: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
        role: User_1.UserRole.USER
    }
];
function createInitialUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/credit-app');
            console.log('Connected to MongoDB');
            // Clear existing users
            yield User_1.default.deleteMany({});
            console.log('Cleared existing users');
            // Create new users
            for (const userData of initialUsers) {
                const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
                const user = new User_1.default(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                yield user.save();
                console.log(`Created ${userData.role} user: ${userData.email}`);
            }
            console.log('Initial users created successfully');
            process.exit(0);
        }
        catch (error) {
            console.error('Error creating initial users:', error);
            process.exit(1);
        }
    });
}
createInitialUsers();
