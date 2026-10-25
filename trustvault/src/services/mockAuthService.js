import { INITIAL_USERS } from '../data/mockData';

const USERS_STORAGE_KEY = 'trustvault_demo_users_v1';
const SESSION_STORAGE_KEY = 'trustvault_demo_session_v1';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading demo users from storage', e);
  }
  return [...INITIAL_USERS];
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving demo users', e);
  }
}

export const mockAuthService = {
  getUsers() {
    return loadUsers();
  },

  getUserById(id) {
    const users = loadUsers();
    return users.find(u => u.id === id) || null;
  },

  login(email, password) {
    const users = loadUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    // Role and status verification
    if (user.status === 'suspended') {
      return { success: false, error: 'Account has been suspended. Please contact platform security.' };
    }

    if (user.status === 'rejected') {
      return { 
        success: false, 
        error: 'Your owner registration was reviewed and rejected by the administrator.' 
      };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsers(users);

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      company: user.company,
      lastLogin: user.lastLogin
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  },

  signup({ name, email, password, role, company }) {
    if (role !== 'owner' && role !== 'viewer') {
      return { success: false, error: 'Invalid role selection. Only Owner or Viewer allowed.' };
    }

    const users = loadUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const initialStatus = role === 'owner' ? 'pending' : 'active';
    const newUser = {
      id: `usr_${role}_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role,
      status: initialStatus,
      company: company ? company.trim() : 'Independent User',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(newUser);
    saveUsers(users);

    return { 
      success: true, 
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        company: newUser.company
      },
      isPending: initialStatus === 'pending'
    };
  },

  updateUserStatus(userId, newStatus) {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return { success: false, error: 'User not found' };

    // Prevent altering demo admin role or status
    if (users[idx].role === 'admin' && newStatus !== 'active') {
      return { success: false, error: 'Primary admin status cannot be modified in demo mode.' };
    }

    users[idx].status = newStatus;
    saveUsers(users);

    // If current session is this user, update session as well
    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.id === userId) {
      currentSession.status = newStatus;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentSession));
    }

    return { success: true, user: users[idx] };
  },

  updateUserProfile(userId, { name, company }) {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return { success: false, error: 'User not found' };

    if (name) users[idx].name = name.trim();
    if (company !== undefined) users[idx].company = company.trim();
    saveUsers(users);

    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.id === userId) {
      if (name) currentSession.name = name.trim();
      if (company !== undefined) currentSession.company = company.trim();
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentSession));
    }

    return { success: true, user: users[idx] };
  },

  updateUserPassword(userId, currentPassword, newPassword) {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return { success: false, error: 'User not found' };

    if (users[idx].password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    users[idx].password = newPassword;
    saveUsers(users);

    return { success: true };
  },

  getCurrentSession() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading session', e);
    }
    return null;
  },

  logout() {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Error during logout', e);
    }
  },

  // Reset to initial demo state
  resetDemoData() {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return loadUsers();
  }
};
