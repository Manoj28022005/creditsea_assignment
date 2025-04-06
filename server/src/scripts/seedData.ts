import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Loan from '../models/Loan';

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

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Loan.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return User.create({
          ...user,
          password: hashedPassword
        });
      })
    );
    console.log('Created users');

    // Create loans
    const loans = await Promise.all(
      sampleLoans.map(async (loan, index) => {
        return Loan.create({
          ...loan,
          userId: createdUsers[index]._id,
          createdAt: new Date(2021, 5, 8), // June 8, 2021
          updatedAt: new Date(2021, 5, 8)
        });
      })
    );
    console.log('Created loans');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 