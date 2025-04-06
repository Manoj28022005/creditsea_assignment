import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default PrivateRoute; 