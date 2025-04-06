import express from 'express';
import { Types } from 'mongoose';
import Loan, { LoanStatus } from '../models/Loan';
import { auth } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Create a new loan application
router.post('/', auth(), async (req, res) => {
  try {
    if (!req.user?.userId) {
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
    const loan = new Loan({
      userId: req.user.userId,
      amount: numericAmount,
      purpose,
      employmentStatus,
      employmentAddress,
      status: LoanStatus.PENDING
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    console.error('Error creating loan application:', error);
    res.status(500).json({ message: 'Error creating loan application' });
  }
});

// Get all loans (for admin and verifier)
router.get('/', auth([UserRole.ADMIN, UserRole.VERIFIER]), async (req, res) => {
  try {
    const loans = await Loan.find().populate('userId', 'fullName email');
    res.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ message: 'Error fetching loans' });
  }
});

// Get user's loans
router.get('/my-loans', auth(), async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const loans = await Loan.find({ userId: req.user.userId });
    res.json(loans);
  } catch (error) {
    console.error('Error fetching user loans:', error);
    res.status(500).json({ message: 'Error fetching user loans' });
  }
});

// Get all pending loans (for verifier)
router.get('/pending', auth([UserRole.VERIFIER]), async (req, res) => {
  try {
    const loans = await Loan.find({ status: LoanStatus.PENDING })
      .populate('userId', 'fullName email');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans' });
  }
});

// Get all verified loans (for admin)
router.get('/verified', auth([UserRole.ADMIN]), async (req, res) => {
  try {
    const loans = await Loan.find({ status: LoanStatus.VERIFIED })
      .populate('userId', 'fullName email');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans' });
  }
});

// Verify a loan (for verifier)
router.put('/:id/verify', auth([UserRole.VERIFIER]), async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.status !== LoanStatus.PENDING) {
      return res.status(400).json({ message: 'Only pending loans can be verified' });
    }

    loan.status = LoanStatus.VERIFIED;
    loan.verifiedBy = new Types.ObjectId(req.user.userId);
    loan.verifiedAt = new Date();
    await loan.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Error verifying loan' });
  }
});

// Approve a loan (for admin)
router.put('/:id/approve', auth([UserRole.ADMIN]), async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.status !== LoanStatus.VERIFIED) {
      return res.status(400).json({ message: 'Only verified loans can be approved' });
    }

    loan.status = LoanStatus.APPROVED;
    loan.approvedBy = new Types.ObjectId(req.user.userId);
    loan.approvedAt = new Date();
    await loan.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Error approving loan' });
  }
});

// Get loan statistics
router.get('/statistics', auth(), async (req, res) => {
  try {
    const [
      totalLoans,
      approvedLoans,
      pendingLoans,
      verifiedLoans,
      totalAmount,
      disbursedAmount,
      receivedAmount
    ] = await Promise.all([
      Loan.countDocuments(),
      Loan.countDocuments({ status: LoanStatus.APPROVED }),
      Loan.countDocuments({ status: LoanStatus.PENDING }),
      Loan.countDocuments({ status: LoanStatus.VERIFIED }),
      Loan.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Loan.aggregate([
        { $match: { status: LoanStatus.APPROVED } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Loan.aggregate([
        { $match: { status: LoanStatus.APPROVED } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      totalLoans,
      approvedLoans,
      pendingLoans,
      verifiedLoans,
      totalAmount: totalAmount[0]?.total || 0,
      disbursedAmount: disbursedAmount[0]?.total || 0,
      receivedAmount: receivedAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

export default router; 