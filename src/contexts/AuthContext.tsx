// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { API } from '../config/api'; 
// import { useTheme } from './ThemeContext'; 

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin';
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (
//     name: string,
//     email: string,
//     password: string,
//     role?: 'user' | 'admin'
//   ) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   const { setTheme } = useTheme(); 

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');
//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));

//       setTheme('dark');
//     }
//   }, [setTheme]);

//   const login = async (email: string, password: string) => {
//     const response = await fetch(API.AUTH.LOGIN, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) throw new Error('Login failed');

//     const { token, user } = await response.json();
//     setToken(token);
//     setUser(user);

//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));

//     setTheme('dark');
//   };

//   const signup = async (
//     name: string,
//     email: string,
//     password: string,
//     role: 'user' | 'admin' = 'user'
//   ) => {
//     const response = await fetch(API.AUTH.SIGNUP, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password, role }),
//     });

//     if (!response.ok) throw new Error('Signup failed');

//     const { token, user } = await response.json();
//     setToken(token);
//     setUser(user);

//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));

//     setTheme('dark');
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');

//     setTheme('light');
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         login,
//         signup,
//         logout,
//         isAuthenticated: !!user && !!token,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

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

  // ✅ Initialize from localStorage on mount
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

  // ✅ LOGIN FUNCTION
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

      // ✅ Update state
      setToken(newToken);
      setUser(newUser);

      // ✅ Save to localStorage with proper error handling
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

  // ✅ SIGNUP FUNCTION
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
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      const { token: newToken, user: newUser } = data;

      // ✅ Update state
      setToken(newToken);
      setUser(newUser);

      // ✅ Save to localStorage with proper error handling
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

  // ✅ LOGOUT FUNCTION
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
