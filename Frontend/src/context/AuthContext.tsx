import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export interface UserSession {
  id?: string;
  name?: string;
  email: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isLoading: boolean;
  loginStudent: (email: string, pass: string) => Promise<void>;
  registerStudent: (name: string, email: string, pass: string) => Promise<void>;
  loginAdmin: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user_session');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user_session');
      }
    }
    setIsLoading(false);
  }, []);

  const loginStudent = async (email: string, pass: string) => {
    const res = await apiService.loginStudent({ email, password: pass });
    if (res.token) {
      const session: UserSession = { email, role: 'student' };
      setToken(res.token);
      setUser(session);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user_session', JSON.stringify(session));
    }
  };

  const registerStudent = async (name: string, email: string, pass: string) => {
    const res = await apiService.registerStudent({ name, email, password: pass });
    if (res.token) {
      const session: UserSession = { name, email, role: 'student' };
      setToken(res.token);
      setUser(session);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user_session', JSON.stringify(session));
    }
  };

  const loginAdmin = async (email: string, pass: string) => {
    const res = await apiService.loginAdmin({ email, password: pass });
    if (res.token) {
      const session: UserSession = { name: 'Admin', email, role: 'admin' };
      setToken(res.token);
      setUser(session);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user_session', JSON.stringify(session));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loginStudent,
        registerStudent,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
