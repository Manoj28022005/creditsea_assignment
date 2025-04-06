"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var LoanStatus;
(function (LoanStatus) {
    LoanStatus["PENDING"] = "pending";
    LoanStatus["VERIFIED"] = "verified";
    LoanStatus["APPROVED"] = "approved";
    LoanStatus["REJECTED"] = "rejected";
})(LoanStatus = exports.LoanStatus || (exports.LoanStatus = {}));
const loanSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1000, 'Amount must be at least 1000'],
        max: [1000000, 'Amount cannot exceed 1000000']
    },
    purpose: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Purpose must be at least 3 characters long']
    },
    employmentStatus: {
        type: String,
        required: true,
        trim: true,
        enum: ['employed', 'self-employed', 'unemployed', 'student', 'retired']
    },
    employmentAddress: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'Employment address must be at least 5 characters long']
    },
    status: {
        type: String,
        enum: Object.values(LoanStatus),
        default: LoanStatus.PENDING
    },
    verifiedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true
    },
    verifiedAt: {
        type: Date
    },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true
    },
    approvedAt: {
        type: Date
    }
}, {
    timestamps: true
});
// Add index for faster queries
loanSchema.index({ userId: 1, status: 1 });
const Loan = mongoose_1.default.model('Loan', loanSchema);
exports.default = Loan;
