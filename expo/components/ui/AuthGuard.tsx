import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import LoadingScreen from './LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = requireAuth ? '/login' : '/dashboard'
}) => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      // If auth is required and user is not logged in, redirect to login
      if (requireAuth && !user) {
        navigate(redirectTo);
      }
      
      // If auth is not required and user is logged in, redirect to dashboard
      if (!requireAuth && user) {
        navigate(redirectTo);
      }
    }
  }, [user, loading, navigate, requireAuth, redirectTo]);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // If auth is required and user is logged in, or auth is not required and user is not logged in
  if ((requireAuth && user) || (!requireAuth && !user)) {
    return <>{children}</>;
  }
  
  // This should not be rendered as the useEffect should redirect
  return <LoadingScreen />;
};

export default AuthGuard;