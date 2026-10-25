import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';

export function RequireAuth({ allowedRoles = [] }) {
  const { currentUser, isAuthenticated, role, status, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Authenticating session..." />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Pending or rejected owner restriction
  if (role === 'owner') {
    if (status === 'pending' || status === 'rejected') {
      return <Navigate to="/auth/pending-approval" replace />;
    }
  }

  // Suspended account restriction
  if (status === 'suspended') {
    return <Navigate to="/access-denied" state={{ reason: 'Account has been suspended by administration.' }} replace />;
  }

  // Role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" state={{ reason: `Your current role '${role}' does not have permission to access this workspace.` }} replace />;
  }

  return <Outlet />;
}

export function RequirePendingOwner() {
  const { currentUser, isAuthenticated, role, status } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role === 'owner' && (status === 'pending' || status === 'rejected')) {
    return <Outlet />;
  }

  // If approved owner, go to dashboard
  if (role === 'owner' && status === 'active') {
    return <Navigate to="/owner/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
}

export function RequireUnauth() {
  const { isAuthenticated, role, status } = useAuth();

  if (isAuthenticated) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'owner') {
      if (status === 'pending' || status === 'rejected') {
        return <Navigate to="/auth/pending-approval" replace />;
      }
      return <Navigate to="/owner/dashboard" replace />;
    }
    if (role === 'viewer') return <Navigate to="/viewer/dashboard" replace />;
  }

  return <Outlet />;
}
