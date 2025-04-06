import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5111/api';

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', {
        url: error.config.url,
        timeout: error.config.timeout,
        baseURL: error.config.baseURL
      });
      return Promise.reject(new Error('Request timeout. Please check if the server is running.'));
    }
    
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('Request error:', {
        message: error.message,
        code: error.code
      });
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (userData: any) =>
  api.post('/auth/register', userData);

export const getAdmins = () =>
  api.get('/auth/admins');

export const addAdmin = (adminData: any) =>
  api.post('/auth/add-admin', adminData);

export const deleteAdmin = (adminId: string) =>
  api.delete(`/auth/admins/${adminId}`);

// Loan APIs
export interface CreateLoanData {
  amount: number;
  purpose: string;
  employmentStatus: string;
  employmentAddress: string;
}

export const createLoan = async (loanData: CreateLoanData) => {
  try {
    console.log('Creating loan with data:', loanData);
    
    // Ensure all required fields are present
    if (!loanData.amount || !loanData.purpose || !loanData.employmentStatus || !loanData.employmentAddress) {
      throw new Error('Missing required fields');
    }

    // Ensure amount is a number
    const amount = Number(loanData.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    const response = await api.post('/loans', {
      amount,
      purpose: loanData.purpose,
      employmentStatus: loanData.employmentStatus,
      employmentAddress: loanData.employmentAddress
    });

    console.log('Loan created successfully:', response.data);
    return response;
  } catch (error: any) {
    console.error('Create loan error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
      name: error.name
    });

    if (error.response?.data?.missingFields) {
      throw new Error(`Missing required fields: ${error.response.data.missingFields.join(', ')}`);
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check if the server is running.');
    }

    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your internet connection and if the server is running.');
    }

    throw error;
  }
};

export const getUserLoans = () =>
  api.get('/loans');

export const getPendingLoans = () =>
  api.get('/loans/pending');

export const getVerifiedLoans = () =>
  api.get('/loans/verified');

export const verifyLoan = (loanId: string) =>
  api.put(`/loans/${loanId}/verify`);

export const approveLoan = (loanId: string) =>
  api.put(`/loans/${loanId}/approve`);

export const getLoanStatistics = () =>
  api.get('/loans/statistics');

export default api; 