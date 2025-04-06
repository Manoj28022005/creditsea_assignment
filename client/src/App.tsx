import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/user/UserDashboard';
import VerifierDashboard from './components/verifier/VerifierDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import LoanApplicationForm from './components/user/LoanApplicationForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#006400',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/user"
            element={
              <PrivateRoute roles={['user']}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/apply-loan"
            element={
              <PrivateRoute roles={['user']}>
                <LoanApplicationForm />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/verifier"
            element={
              <PrivateRoute roles={['verifier']}>
                <VerifierDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
