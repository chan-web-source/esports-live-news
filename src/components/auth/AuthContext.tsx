import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService from '../../service/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status on mount and token changes
    const checkAuthStatus = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const token = authService.getAccessToken();
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUsername(payload.username);
          } catch (error) {
            console.error('Error parsing token:', error);
            setUsername(null);
          }
        }
      } else {
        setUsername(null);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await authService.login({ username, password });
      setIsAuthenticated(true);
      setUsername(username);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const success = await authService.register({ email, password });
      if (success) {
        // After successful registration, log the user in with the same credentials
        await login(email, password);
      }
      return success;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername(null);
  };

  const value = {
    isAuthenticated,
    username,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}