import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  if (!pb.authStore.isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;