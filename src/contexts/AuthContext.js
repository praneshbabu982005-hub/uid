import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'praneshbabutj.23it@kongu.edu',
        password: '123456',
        role: 'admin'
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      }
    ];
    setUsers(sampleUsers);
    
    const savedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (token) {
      // try to refresh from backend
      api.get('/me').then(({ data }) => {
        setCurrentUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
      }).catch(() => {});
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true, user: data.user };
    } catch (e) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true, user: data.user };
    } catch (e) {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role: 'user'
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get('/users');
      return data;
    } catch (e) {
      return users;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await api.put('/me', updates);
      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true, user: data.user };
    } catch (e) {
      // fallback: update local-only session
      const updated = { ...currentUser, ...updates };
      setCurrentUser(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
      return { success: true, user: updated };
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    getAllUsers: fetchAllUsers,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 