import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Container,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import MoneyIcon from '@mui/icons-material/Money';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  getVerifiedLoans,
  approveLoan,
  getLoanStatistics,
  getAdmins,
  addAdmin,
  deleteAdmin,
} from '../../services/api';

interface Loan {
  _id: string;
  userId: {
    fullName: string;
    email: string;
  };
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
  verifiedAt: string;
}

interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalLoans: number;
  approvedLoans: number;
  totalAmount: number;
  activeUsers: number;
  borrowers: number;
  cashDisbursed: number;
  cashReceived: number;
  savings: number;
  repaidLoans: number;
  otherAccounts: number;
}

const AdminDashboard: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLoans: 0,
    approvedLoans: 0,
    totalAmount: 0,
    activeUsers: 200,
    borrowers: 100,
    cashDisbursed: 550000,
    cashReceived: 1000000,
    savings: 450000,
    repaidLoans: 30,
    otherAccounts: 10,
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const fetchLoans = async () => {
    try {
      const response = await getVerifiedLoans();
      setLoans(response.data);
    } catch (err) {
      setError('Failed to fetch verified loans');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getLoanStatistics();
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch statistics');
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await getAdmins();
      setAdmins(response.data);
    } catch (err) {
      setError('Failed to fetch admins');
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchStats();
    fetchAdmins();
  }, []);

  const handleApprove = async (loanId: string) => {
    try {
      await approveLoan(loanId);
      setSuccess('Loan approved successfully');
      fetchLoans();
      fetchStats();
    } catch (err) {
      setError('Failed to approve loan');
    }
  };

  const handleAddAdmin = async () => {
    try {
      await addAdmin(newAdmin);
      setSuccess('Admin added successfully');
      setOpenDialog(false);
      setNewAdmin({ fullName: '', email: '', password: '' });
      fetchAdmins();
    } catch (err) {
      setError('Failed to add admin');
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      await deleteAdmin(adminId);
      setSuccess('Admin deleted successfully');
      fetchAdmins();
    } catch (err) {
      setError('Failed to delete admin');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = 'primary' }: any) => (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ bgcolor: '#fff', boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Icon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" color="textSecondary">
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {typeof value === 'number' && title.includes('CASH') 
              ? `₹${value.toLocaleString()}`
              : value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard
          icon={PeopleIcon}
          title="ACTIVE USERS"
          value={stats.activeUsers}
        />
        <StatCard
          icon={PersonIcon}
          title="BORROWERS"
          value={stats.borrowers}
        />
        <StatCard
          icon={MoneyIcon}
          title="CASH DISBURSED"
          value={stats.cashDisbursed}
        />
        <StatCard
          icon={MoneyIcon}
          title="CASH RECEIVED"
          value={stats.cashReceived}
        />
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard
          icon={SavingsIcon}
          title="SAVINGS"
          value={stats.savings}
        />
        <StatCard
          icon={ReceiptIcon}
          title="REPAID LOANS"
          value={stats.repaidLoans}
        />
        <StatCard
          icon={AccountBalanceIcon}
          title="OTHER ACCOUNTS"
          value={stats.otherAccounts}
        />
        <StatCard
          icon={ReceiptIcon}
          title="LOANS"
          value={stats.totalLoans}
        />
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Recent Loans</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User details</TableCell>
                <TableCell>Customer name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2">{loan.userId.email}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Updated 1 day ago
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{loan.userId.fullName}</TableCell>
                  <TableCell>
                    {new Date(loan.createdAt).toLocaleDateString()}
                    <Typography variant="caption" display="block" color="textSecondary">
                      {new Date(loan.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleApprove(loan._id)}
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 2 }}
        >
          Add New Admin
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.fullName}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteAdmin(admin._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            value={newAdmin.fullName}
            onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAdmin} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 