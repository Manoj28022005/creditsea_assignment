import mongoose, { Types } from 'mongoose';

export enum LoanStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface ILoan extends mongoose.Document {
  userId: string;
  amount: number;
  purpose: string;
  employmentStatus: string;
  employmentAddress: string;
  status: LoanStatus;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const loanSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  verifiedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
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

const Loan = mongoose.model<ILoan>('Loan', loanSchema);

export default Loan; 