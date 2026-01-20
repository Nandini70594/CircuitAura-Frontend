import React, { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../config/api'; 
import { useTheme } from './ThemeContext'; 

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: 'user' | 'admin',
    adminKey?: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { setTheme } = useTheme();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    try {
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setTheme('dark');
      }
    } catch (error) {
      console.error('Failed to restore auth from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, [setTheme]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(API.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token: newToken, user: newUser } = data;

      setToken(newToken);
      setUser(newUser);

      try {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
      }

      setTheme('dark');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin' = 'user',
    adminKey: string = '' 
  ) => {
    try {
      const response = await fetch(API.AUTH.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, adminKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      const { token: newToken, user: newUser } = data;

      setToken(newToken);
      setUser(newUser);

      try {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
      }

      setTheme('dark');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
    
    setTheme('light');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
