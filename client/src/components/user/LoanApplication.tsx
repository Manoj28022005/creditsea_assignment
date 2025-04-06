import React from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const validationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  loanTenure: yup
    .number()
    .required('Loan tenure is required')
    .positive('Tenure must be positive'),
  reason: yup.string().required('Reason for loan is required'),
  employmentStatus: yup.string().required('Employment status is required'),
  employmentAddress: yup.string().required('Employment address is required'),
});

const LoanApplication = () => {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      amount: '',
      loanTenure: '',
      reason: '',
      employmentStatus: '',
      employmentAddress: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:5111/api/loans/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Loan application submitted successfully');
          formik.resetForm();
        } else {
          alert(data.error || 'Failed to submit loan application');
        }
      } catch (error) {
        alert('An error occurred while submitting the application');
      }
    },
  });

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Loan Amount',
        data: [650, 590, 800, 810, 560, 550],
        borderColor: '#006400',
        backgroundColor: 'rgba(0, 100, 0, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#006400', fontWeight: 600 }}>
          APPLY FOR A LOAN
        </Typography>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mt: 4, 
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="fullName"
                  name="fullName"
                  label="Full name as it appears on bank account"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#006400',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="amount"
                  name="amount"
                  label="How much do you need?"
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#006400',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="loanTenure"
                  name="loanTenure"
                  label="Loan tenure (in months)"
                  type="number"
                  value={formik.values.loanTenure}
                  onChange={formik.handleChange}
                  error={formik.touched.loanTenure && Boolean(formik.errors.loanTenure)}
                  helperText={formik.touched.loanTenure && formik.errors.loanTenure}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#006400',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="employmentStatus"
                  name="employmentStatus"
                  label="Employment status"
                  value={formik.values.employmentStatus}
                  onChange={formik.handleChange}
                  error={formik.touched.employmentStatus && Boolean(formik.errors.employmentStatus)}
                  helperText={formik.touched.employmentStatus && formik.errors.employmentStatus}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#006400',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="employmentAddress"
                  name="employmentAddress"
                  label="Employment address"
                  value={formik.values.employmentAddress}
                  onChange={formik.handleChange}
                  error={formik.touched.employmentAddress && Boolean(formik.errors.employmentAddress)}
                  helperText={formik.touched.employmentAddress && formik.errors.employmentAddress}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#006400',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="reason"
                  name="reason"
                  label="Reason for loan"
                  multiline
                  rows={4}
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  error={formik.touched.reason && Boolean(formik.errors.reason)}
                  helperText={formik.touched.reason && formik.errors.reason}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#006400',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#006400' }}>
                Chart
              </Typography>
              <Box sx={{ height: 300, p: 2, bgcolor: '#F8F9FA', borderRadius: 1 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                I have read the important information and agreed that by completing this application I will be bound by the terms and conditions.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureaus or other credit reporting agencies.
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: '#006400',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#004B00',
                },
                height: '48px',
                fontSize: '1rem',
                fontWeight: 500,
              }}
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoanApplication; 