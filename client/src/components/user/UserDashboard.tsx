import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { getUserLoans } from '../../services/api';

interface Loan {
  _id: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'verified' | 'approved' | 'rejected';
  createdAt: string;
}

const UserDashboard: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await getUserLoans();
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'verified':
        return '#00C853';
      case 'rejected':
        return '#FF0000';
      case 'approved':
        return '#0000FF';
      default:
        return '#000000';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Credit Balance Card */}
      <Card sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Box component="img" src="/money-icon.png" alt="Money" sx={{ width: 48, height: 48 }} />
            <Box>
              <Typography variant="caption" color="textSecondary">DEBIT</Typography>
              <Typography variant="h4" component="div">₹ 0.0</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Borrow Cash" />
          <Tab label="Transact" />
          <Tab label="Deposit Cash" />
        </Tabs>
      </Box>

      {/* Get A Loan Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/apply-loan')}
          sx={{ bgcolor: '#808080', '&:hover': { bgcolor: '#666666' } }}
        >
          Get A Loan
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for loans"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Loans Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Applied Loans
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan Officer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date Applied</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans
                .filter(loan => 
                  loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  loan.amount.toString().includes(searchTerm)
                )
                .map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src="/avatar-placeholder.png"
                          alt="Officer"
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                          }}
                        />
                        <Box>
                          <Typography>John Okoh</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Updates 1 day ago
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>₹{loan.amount.toLocaleString()}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {loan.purpose}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{formatDate(loan.createdAt)}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        6:30 PM
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          bgcolor: getStatusColor(loan.status) + '20',
                          color: getStatusColor(loan.status),
                          py: 0.5,
                          px: 2,
                          borderRadius: 1,
                          display: 'inline-block',
                          textTransform: 'uppercase',
                        }}
                      >
                        {loan.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default UserDashboard; 