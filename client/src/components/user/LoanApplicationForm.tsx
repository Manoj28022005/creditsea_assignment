import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createLoan, CreateLoanData } from '../../services/api';

const LoanApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    amount: '',
    loanTenure: '',
    employmentStatus: '',
    reason: '',
    employmentAddress: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [creditInfoAccepted, setCreditInfoAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      navigate('/login');
      return;
    }
    try {
      const userData = JSON.parse(user);
      console.log('User data:', JSON.stringify(userData, null, 2));
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    console.log('Form Data:', JSON.stringify(formData, null, 2));

    if (!termsAccepted || !creditInfoAccepted) {
      setError('Please accept both terms and conditions');
      return;
    }

    if (!formData.fullName || !formData.amount || !formData.loanTenure || 
        !formData.employmentStatus || !formData.employmentAddress || !formData.reason) {
      setError('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid loan amount');
      return;
    }

    const tenure = parseInt(formData.loanTenure);
    if (isNaN(tenure) || tenure <= 0) {
      setError('Please enter a valid loan tenure');
      return;
    }

    if (isSubmitting) {
      console.log('Already submitting, please wait...');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const user = localStorage.getItem('user');
      if (!user) {
        setError('Please log in again');
        navigate('/login');
        return;
      }

      const userData = JSON.parse(user);
      console.log('Parsed user data:', JSON.stringify(userData, null, 2));

      if (!userData?._id) {
        setError('Invalid user data. Please log in again');
        navigate('/login');
        return;
      }

      const loanData: CreateLoanData = {
        amount,
        purpose: formData.reason,
        employmentStatus: formData.employmentStatus,
        employmentAddress: formData.employmentAddress,
      };
      
      console.log('Sending to API:', JSON.stringify(loanData, null, 2));

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again');
        navigate('/login');
        return;
      }

      console.log('Making API call to create loan...');
      const response = await createLoan(loanData);
      console.log('API Response received:', JSON.stringify(response?.data, null, 2));
      
      if (response?.data) {
        console.log('Loan created successfully:', response.data);
        alert('Loan application submitted successfully! Your application will be reviewed by our team.');
        navigate('/user');
      } else {
        throw new Error('No response data received from server');
      }
    } catch (err: any) {
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        request: err.request ? 'Request was made but no response received' : 'Request failed to send',
        stack: err.stack
      });
      
      let errorMessage = 'Failed to submit loan application. ';
      if (err.message.includes('timeout')) {
        errorMessage = 'Server is taking too long to respond. Please try again later.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
        navigate('/login');
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Invalid loan application data.';
      } else if (err.response) {
        errorMessage += err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage += 'Server is not responding. Please try again later.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    termsAccepted && 
    creditInfoAccepted && 
    formData.fullName &&
    formData.amount && 
    formData.loanTenure &&
    formData.employmentStatus && 
    formData.employmentAddress &&
    formData.reason;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: 'white' }}>
        <Typography variant="h4" align="center" gutterBottom>
          APPLY FOR A LOAN
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ mt: 4 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="fullName"
                label="Full name as it appears on bank account"
                value={formData.fullName}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Full name as it appears on bank account"
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="amount"
                label="How much do you need?"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="How much do you need?"
                inputProps={{ min: "1" }}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="loanTenure"
                label="Loan tenure (in months)"
                type="number"
                value={formData.loanTenure}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Loan tenure (in months)"
                inputProps={{ min: "1" }}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="employmentStatus"
                label="Employment status"
                value={formData.employmentStatus}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Employment status"
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="reason"
                label="Reason for loan"
                multiline
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Reason for loan"
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="employmentAddress"
                label="Employment address"
                value={formData.employmentAddress}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="Employment address"
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    color="primary"
                    disabled={isSubmitting}
                  />
                }
                label="I have read the important information and accept that by completing the application I will be bound by the terms"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={creditInfoAccepted}
                    onChange={(e) => setCreditInfoAccepted(e.target.checked)}
                    color="primary"
                    disabled={isSubmitting}
                  />
                }
                label="Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureaus or other credit reporting agencies."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={!isFormValid || isSubmitting}
                sx={{
                  bgcolor: '#006400',
                  '&:hover': { bgcolor: '#005000' },
                  '&:disabled': { bgcolor: '#cccccc' },
                  height: '48px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoanApplicationForm; 