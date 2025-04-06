# Credit Sea - Loan Management System
## Features

- User Registration and Authentication
- Loan Application Submission
- Loan Verification Process
- Admin Dashboard
- Real-time Application Status Tracking
- Secure Document Upload
- Multi-level Authorization System

## System Requirements

- Node.js (v16 or higher)
- MongoDB
- React (v18 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd credit-sea
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
Create `.env` file in the backend directory with:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5111
```

4. Start the application:
```bash
# Start backend server
cd backend
npm start

# Start frontend application (in a new terminal)
cd frontend
npm start
```

## Access Credentials

### Admin Account
- Email: admin@creditsea.com
- Password: admin123

### Verifier Account
- Email: verifier@creditsea.com
- Password: verifier123

### Test User Account
- Email: user@creditsea.com
- Password: user123

## User Roles and Permissions

### Admin
- View all loan applications
- Manage users and verifiers
- Access system analytics
- Final loan approval/rejection

### Verifier
- Review loan applications
- Request additional documents
- Provide verification status
- Add verification notes

### User
- Submit loan applications
- Track application status
- Upload required documents
- View loan history

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register

### Loans
- POST /api/loans - Create new loan application
- GET /api/loans - Get all loans (Admin/Verifier)
- GET /api/loans/:id - Get specific loan details
- PUT /api/loans/:id - Update loan status

### Users
- GET /api/users - Get all users (Admin only)
- PUT /api/users/:id - Update user details
- DELETE /api/users/:id - Delete user (Admin only)

## Security Features

- JWT Authentication
- Password Encryption
- Role-based Access Control
- Input Validation
- XSS Protection
- Rate Limiting
