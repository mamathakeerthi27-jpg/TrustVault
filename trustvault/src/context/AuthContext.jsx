import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockAuthService';
import { mockAuditService } from '../services/mockAuditService';
import { apiLogin, apiMe, apiLogout, apiSignup } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

 
useEffect(() => {
  let mounted = true;

  apiMe()
    .then((res) => {
      if (mounted) {
        const user = res.authenticated ? res.user : null;

        // A pending owner must not get an authenticated frontend session.
        if (user?.role === 'owner' && user?.status === 'pending') {
          setCurrentUser(null);
        } else {
          setCurrentUser(user);
        }
      }
    })
    .catch((error) => {
      console.error('Session check failed:', error);
      if (mounted) {
        setCurrentUser(null);
      }
    });

  return () => {
    mounted = false;
  };
}, []);


  const login = async (email, password) => {
  setLoading(true);

  try {
    const res = await apiLogin(email, password);

    if (res.success) {
      setCurrentUser(res.user);

      mockAuditService.logEvent({
        actor: `${res.user.name} (${res.user.role})`,
        actorId: res.user.id,
        action: 'AUTH_LOGIN',
        target: 'Platform Session',
        result: 'SUCCESS',
        severity: 'INFO',
        details: 'User authenticated through the Flask backend.'
      });
    }

    return res;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Login failed'
    };
  } finally {
    setLoading(false);
  }
};

  
const signup = async ({ name, email, password, role, company }) => {
  setLoading(true);

  try {
    const res = await apiSignup({
      name,
      email,
      password,
      role,
      company,
    });

    if (res.success) {
      mockAuditService.logEvent({
        actor: `${name} (Self-Registered)`,
        actorId: res.user.id,
        action: role === 'owner' ? 'OWNER_REGISTRATION' : 'VIEWER_REGISTRATION',
        target: `Account status: ${res.user.status}`,
        result: res.isPending ? 'PENDING' : 'SUCCESS',
        severity: res.isPending ? 'WARNING' : 'INFO',
        details: res.isPending
          ? 'New owner account registered. Requires administrative verification.'
          : 'Viewer registration completed with standard authorized read permissions.',
      });

      if (role === 'viewer') {
        setCurrentUser(res.user);
      }
    }

    return res;
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Signup failed',
    };
  } finally {
    setLoading(false);
  }
};


 
const logout = async () => {
  try {
    await apiLogout();

    if (currentUser) {
      mockAuditService.logEvent({
        actor: `${currentUser.name} (${currentUser.role})`,
        actorId: currentUser.id,
        action: 'AUTH_LOGOUT',
        target: 'Platform Session',
        result: 'SUCCESS',
        severity: 'INFO',
        details: 'User logged out through the Flask backend.'
      });
    }

    setCurrentUser(null);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

  const quickSwitchUser = (email) => {
    const users = mockAuthService.getUsers();
    const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      const sessionUser = {
        id: target.id,
        name: target.name,
        email: target.email,
        role: target.role,
        status: target.status,
        company: target.company,
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('trustvault_demo_session_v1', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      mockAuditService.logEvent({
        actor: 'Demo Environment Switcher',
        actorId: sessionUser.id,
        action: 'DEMO_SWITCH',
        target: `Active Profile -> ${sessionUser.name} (${sessionUser.role})`,
        result: 'SUCCESS',
        severity: 'INFO',
        details: 'Fast role-switching applied for local testing.'
      });
      return true;
    }
    return false;
  };

  const updateUserStatus = (userId, newStatus) => {
    const res = mockAuthService.updateUserStatus(userId, newStatus);
    if (res.success) {
      const targetUser = res.user;
      const isApproval = newStatus === 'active';
      const isRejection = newStatus === 'rejected';

      mockAuditService.logEvent({
        actor: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Administrator',
        actorId: currentUser ? currentUser.id : 'admin',
        action: isApproval ? 'OWNER_APPROVAL' : isRejection ? 'OWNER_REJECTION' : 'ACCOUNT_STATUS_CHANGE',
        target: `${targetUser.name} (${targetUser.email})`,
        result: 'SUCCESS',
        severity: isRejection ? 'WARNING' : 'INFO',
        details: `Account state transitioned to '${newStatus}'.`
      });

      // If modifying currently logged in user
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...currentUser, status: newStatus });
      }
    }
    return res;
  };

  const updateProfile = ({ name, company }) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    const res = mockAuthService.updateUserProfile(currentUser.id, { name, company });
    if (res.success) {
      setCurrentUser(prev => ({ ...prev, name: res.user.name, company: res.user.company }));
      mockAuditService.logEvent({
        actor: `${currentUser.name} (${currentUser.role})`,
        actorId: currentUser.id,
        action: 'PROFILE_UPDATE',
        target: 'Account Profile',
        result: 'SUCCESS',
        severity: 'INFO',
        details: 'User updated profile attributes.'
      });
    }
    return res;
  };

  const updatePassword = (currentPassword, newPassword) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    const res = mockAuthService.updateUserPassword(currentUser.id, currentPassword, newPassword);
    if (res.success) {
      mockAuditService.logEvent({
        actor: `${currentUser.name} (${currentUser.role})`,
        actorId: currentUser.id,
        action: 'PASSWORD_CHANGE',
        target: 'Security Credentials',
        result: 'SUCCESS',
        severity: 'INFO',
        details: 'User password updated successfully.'
      });
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        status: currentUser?.status || null,
        loading,
        login,
        signup,
        logout,
        quickSwitchUser,
        updateUserStatus,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
