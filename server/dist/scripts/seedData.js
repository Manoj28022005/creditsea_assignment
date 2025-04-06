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
const Loan_1 = __importDefault(require("../models/Loan"));
const MONGODB_URI = 'mongodb://localhost:27017/credit_app';
const sampleUsers = [
    {
        fullName: 'Tom Cruise',
        email: 'tom.cruise@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        fullName: 'Matt Damon',
        email: 'matt.damon@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        fullName: 'Robert Downey',
        email: 'robert.downey@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        fullName: 'Christian Bale',
        email: 'christian.bale@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        fullName: 'Henry Cavill',
        email: 'henry.cavill@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        fullName: 'Chris Evans',
        email: 'chris.evans@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        fullName: 'Sam Smith',
        email: 'sam.smith@example.com',
        password: 'password123',
        role: 'user'
    }
];
const sampleLoans = [
    {
        amount: 50000,
        purpose: 'Contact Email not Linked',
        employmentStatus: 'employed',
        employmentAddress: '123 Business St, City',
        status: 'pending'
    },
    {
        amount: 75000,
        purpose: 'Adding Images to Featured Posts',
        employmentStatus: 'self-employed',
        employmentAddress: '456 Startup Ave, Town',
        status: 'pending'
    },
    {
        amount: 100000,
        purpose: 'When will I be charged this month?',
        employmentStatus: 'employed',
        employmentAddress: '789 Corporate Rd, City',
        status: 'pending'
    },
    {
        amount: 60000,
        purpose: 'Payment not going through',
        employmentStatus: 'employed',
        employmentAddress: '321 Office Ln, City',
        status: 'verified'
    },
    {
        amount: 85000,
        purpose: 'Unable to add replies',
        employmentStatus: 'self-employed',
        employmentAddress: '654 Business Park, Town',
        status: 'verified'
    },
    {
        amount: 120000,
        purpose: 'Downtime since last week',
        employmentStatus: 'employed',
        employmentAddress: '987 Work St, City',
        status: 'verified'
    },
    {
        amount: 95000,
        purpose: 'Referral Bonus',
        employmentStatus: 'employed',
        employmentAddress: '147 Company Ave, City',
        status: 'pending'
    }
];
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
            // Clear existing data
            yield User_1.default.deleteMany({});
            yield Loan_1.default.deleteMany({});
            console.log('Cleared existing data');
            // Create users
            const createdUsers = yield Promise.all(sampleUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                const hashedPassword = yield bcryptjs_1.default.hash(user.password, 10);
                return User_1.default.create(Object.assign(Object.assign({}, user), { password: hashedPassword }));
            })));
            console.log('Created users');
            // Create loans
            const loans = yield Promise.all(sampleLoans.map((loan, index) => __awaiter(this, void 0, void 0, function* () {
                return Loan_1.default.create(Object.assign(Object.assign({}, loan), { userId: createdUsers[index]._id, createdAt: new Date(2021, 5, 8), updatedAt: new Date(2021, 5, 8) }));
            })));
            console.log('Created loans');
            console.log('Database seeded successfully!');
            process.exit(0);
        }
        catch (error) {
            console.error('Error seeding database:', error);
            process.exit(1);
        }
    });
}
seedDatabase();
