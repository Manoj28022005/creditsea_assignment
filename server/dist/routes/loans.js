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
const mongoose_1 = require("mongoose");
const Loan_1 = __importStar(require("../models/Loan"));
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Create a new loan application
router.post('/', (0, auth_1.auth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { amount, purpose, employmentStatus, employmentAddress } = req.body;
        // Validate required fields
        if (!amount || !purpose || !employmentStatus || !employmentAddress) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['amount', 'purpose', 'employmentStatus', 'employmentAddress'],
                received: { amount, purpose, employmentStatus, employmentAddress }
            });
        }
        // Validate amount is a positive number
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }
        // Create new loan application
        const loan = new Loan_1.default({
            userId: req.user.userId,
            amount: numericAmount,
            purpose,
            employmentStatus,
            employmentAddress,
            status: Loan_1.LoanStatus.PENDING
        });
        yield loan.save();
        res.status(201).json(loan);
    }
    catch (error) {
        console.error('Error creating loan application:', error);
        res.status(500).json({ message: 'Error creating loan application' });
    }
}));
// Get all loans (for admin and verifier)
router.get('/', (0, auth_1.auth)([User_1.UserRole.ADMIN, User_1.UserRole.VERIFIER]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loans = yield Loan_1.default.find().populate('userId', 'fullName email');
        res.json(loans);
    }
    catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({ message: 'Error fetching loans' });
    }
}));
// Get user's loans
router.get('/my-loans', (0, auth_1.auth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const loans = yield Loan_1.default.find({ userId: req.user.userId });
        res.json(loans);
    }
    catch (error) {
        console.error('Error fetching user loans:', error);
        res.status(500).json({ message: 'Error fetching user loans' });
    }
}));
// Get all pending loans (for verifier)
router.get('/pending', (0, auth_1.auth)([User_1.UserRole.VERIFIER]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loans = yield Loan_1.default.find({ status: Loan_1.LoanStatus.PENDING })
            .populate('userId', 'fullName email');
        res.json(loans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching loans' });
    }
}));
// Get all verified loans (for admin)
router.get('/verified', (0, auth_1.auth)([User_1.UserRole.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loans = yield Loan_1.default.find({ status: Loan_1.LoanStatus.VERIFIED })
            .populate('userId', 'fullName email');
        res.json(loans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching loans' });
    }
}));
// Verify a loan (for verifier)
router.put('/:id/verify', (0, auth_1.auth)([User_1.UserRole.VERIFIER]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.userId)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const loan = yield Loan_1.default.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        if (loan.status !== Loan_1.LoanStatus.PENDING) {
            return res.status(400).json({ message: 'Only pending loans can be verified' });
        }
        loan.status = Loan_1.LoanStatus.VERIFIED;
        loan.verifiedBy = new mongoose_1.Types.ObjectId(req.user.userId);
        loan.verifiedAt = new Date();
        yield loan.save();
        res.json(loan);
    }
    catch (error) {
        res.status(500).json({ message: 'Error verifying loan' });
    }
}));
// Approve a loan (for admin)
router.put('/:id/approve', (0, auth_1.auth)([User_1.UserRole.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        if (!((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const loan = yield Loan_1.default.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        if (loan.status !== Loan_1.LoanStatus.VERIFIED) {
            return res.status(400).json({ message: 'Only verified loans can be approved' });
        }
        loan.status = Loan_1.LoanStatus.APPROVED;
        loan.approvedBy = new mongoose_1.Types.ObjectId(req.user.userId);
        loan.approvedAt = new Date();
        yield loan.save();
        res.json(loan);
    }
    catch (error) {
        res.status(500).json({ message: 'Error approving loan' });
    }
}));
// Get loan statistics
router.get('/statistics', (0, auth_1.auth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    try {
        const [totalLoans, approvedLoans, pendingLoans, verifiedLoans, totalAmount, disbursedAmount, receivedAmount] = yield Promise.all([
            Loan_1.default.countDocuments(),
            Loan_1.default.countDocuments({ status: Loan_1.LoanStatus.APPROVED }),
            Loan_1.default.countDocuments({ status: Loan_1.LoanStatus.PENDING }),
            Loan_1.default.countDocuments({ status: Loan_1.LoanStatus.VERIFIED }),
            Loan_1.default.aggregate([
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Loan_1.default.aggregate([
                { $match: { status: Loan_1.LoanStatus.APPROVED } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Loan_1.default.aggregate([
                { $match: { status: Loan_1.LoanStatus.APPROVED } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);
        res.json({
            totalLoans,
            approvedLoans,
            pendingLoans,
            verifiedLoans,
            totalAmount: ((_e = totalAmount[0]) === null || _e === void 0 ? void 0 : _e.total) || 0,
            disbursedAmount: ((_f = disbursedAmount[0]) === null || _f === void 0 ? void 0 : _f.total) || 0,
            receivedAmount: ((_g = receivedAmount[0]) === null || _g === void 0 ? void 0 : _g.total) || 0
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching statistics' });
    }
}));
exports.default = router;
