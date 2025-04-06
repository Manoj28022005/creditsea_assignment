import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import User, { UserRole } from '../models/User';
import { auth } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      role: UserRole.USER
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '1d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '1d' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get all admins (admin only)
router.get('/admins', auth([UserRole.ADMIN]), async (req, res) => {
  try {
    const admins = await User.find({ role: UserRole.ADMIN });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

// Add new admin (admin only)
router.post('/add-admin', auth([UserRole.ADMIN]), async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new admin
    const admin = new User({
      fullName,
      email,
      password,
      role: UserRole.ADMIN
    });

    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin' });
  }
});

// Delete admin (admin only)
router.delete('/admins/:id', auth([UserRole.ADMIN]), async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin' });
  }
});

// Create admin and verifier users
router.post('/create-default-users', async (req: Request, res: Response) => {
  try {
    // Check if users already exist
    const adminExists = await User.findOne({ email: 'admin@creditsea.com' });
    const verifierExists = await User.findOne({ email: 'verifier@creditsea.com' });

    if (adminExists && verifierExists) {
      return res.json({ message: 'Default users already exist' });
    }

    // Create admin user
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        fullName: 'Admin User',
        email: 'admin@creditsea.com',
        password: adminPassword,
        role: UserRole.ADMIN
      });
      await admin.save();
      console.log('Admin user created');
    }

    // Create verifier user
    if (!verifierExists) {
      const verifierPassword = await bcrypt.hash('verifier123', 10);
      const verifier = new User({
        fullName: 'Verifier User',
        email: 'verifier@creditsea.com',
        password: verifierPassword,
        role: UserRole.VERIFIER
      });
      await verifier.save();
      console.log('Verifier user created');
    }

    res.json({ message: 'Default users created successfully' });
  } catch (error) {
    console.error('Error creating default users:', error);
    res.status(500).json({ message: 'Error creating default users' });
  }
});

export default router; 