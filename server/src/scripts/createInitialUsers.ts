import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const initialUsers = [
  {
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN
  },
  {
    fullName: 'Verifier User',
    email: 'verifier@example.com',
    password: 'verifier123',
    role: UserRole.VERIFIER
  },
  {
    fullName: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: UserRole.USER
  }
];

async function createInitialUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/credit-app');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    for (const userData of initialUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`Created ${userData.role} user: ${userData.email}`);
    }

    console.log('Initial users created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating initial users:', error);
    process.exit(1);
  }
}

createInitialUsers(); 