import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const createUsers = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('MONGODB_URI is not defined in the environment variables');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      fullName: 'Admin User',
      email: 'admin@creditsea.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create verifier user
    const verifierPassword = await bcrypt.hash('verifier123', 10);
    const verifier = new User({
      fullName: 'Verifier User',
      email: 'verifier@creditsea.com',
      password: verifierPassword,
      role: 'verifier'
    });

    // Save users
    await admin.save();
    await verifier.save();

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
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createUsers(); 