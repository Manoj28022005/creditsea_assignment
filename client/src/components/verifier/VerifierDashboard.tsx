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
  Alert,
  Container,
  IconButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoneyIcon from '@mui/icons-material/Money';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { getPendingLoans, verifyLoan, getLoanStatistics } from '../../services/api';

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

const VerifierDashboard: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLoans: 50,
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

  const fetchLoans = async () => {
    try {
      const response = await getPendingLoans();
      setLoans(response.data);
    } catch (err) {
      setError('Failed to fetch pending loans');
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

  useEffect(() => {
    fetchLoans();
    fetchStats();
  }, []);

  const handleVerify = async (loanId: string) => {
    try {
      await verifyLoan(loanId);
      setSuccess('Loan verified successfully');
      fetchLoans();
      fetchStats();
    } catch (err) {
      setError('Failed to verify loan');
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Dashboard • Loans</Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard
            icon={ReceiptIcon}
            title="LOANS"
            value={stats.totalLoans}
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
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard
            icon={SavingsIcon}
            title="SAVINGS"
            value={stats.savings}
          />
          <StatCard
            icon={PersonIcon}
            title="REPAID LOANS"
            value={stats.repaidLoans}
          />
          <StatCard
            icon={MoneyIcon}
            title="CASH RECEIVED"
            value={stats.cashReceived}
          />
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Applied Loans</Typography>
          <Box>
            <Button size="small">Sort</Button>
            <Button size="small">Filter</Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Recent Activity</TableCell>
                <TableCell>Customer name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        component="img"
                        src="/avatar-placeholder.png"
                        alt="User"
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          mr: 2
                        }}
                      />
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
                      size="small"
                      sx={{
                        bgcolor: loan.status === 'verified' ? '#4CAF50' : '#FFA726',
                        color: 'white',
                        '&:hover': {
                          bgcolor: loan.status === 'verified' ? '#43A047' : '#FB8C00'
                        }
                      }}
                      onClick={() => handleVerify(loan._id)}
                    >
                      {loan.status === 'verified' ? 'Verified' : 'Pending'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Rows per page: 7
          </Typography>
          <Typography variant="body2" color="textSecondary">
            1-7 of 1260
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default VerifierDashboard; 