import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  // Initialize state with null values first
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize from localStorage only on client-side after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken) setToken(savedToken);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Set token in API headers
          api.defaults.headers.common['x-auth-token'] = savedToken;
          
          // console.log('Loaded user from localStorage:', {
          //   username: parsedUser.username,
          //   role: parsedUser.role,
          //   isAdmin: ['admin', 'moderator', 'developer', 'owner'].includes(parsedUser.role)
          // });
        }
      } catch (error) {
        console.error('Error loading auth state from localStorage:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    }
  }, []);

  // Login function
  const login = (userData, authToken) => {
    // console.log('Login called with:', { 
    //   username: userData.username,
    //   role: userData.role,
    //   isAdmin: ['admin', 'moderator', 'developer', 'owner'].includes(userData.role)
    // });
    
    // Store in localStorage first
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Then update state
    setUser(userData);
    setToken(authToken);
    
    // Set the token in the API headers
    api.defaults.headers.common['x-auth-token'] = authToken;
    
    // Redirect based on user role with a slight delay to ensure state is updated
    setTimeout(() => {
      try {
        if (['admin', 'moderator', 'developer', 'owner'].includes(userData.role)) {
          console.log('Redirecting to admin dashboard');
          router.push('/admin');
        } else {
          // console.log('Redirecting to user dashboard');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to dashboard if admin navigation fails
        router.push('/dashboard');
      }
    }, 100); // Small delay to ensure state is properly updated
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove the token from API headers
    delete api.defaults.headers.common['x-auth-token'];
    
    // Redirect to login
    router.push('/login');
  };

  // Computed properties for auth state
  const isAuthenticated = !!token && !!user;
  const userRole = user?.role || '';
  const isAdmin = !!user && ['admin', 'moderator', 'developer', 'owner'].includes(userRole);
  
  // Debug auth state
  useEffect(() => {
    // console.log('Auth State Updated:', { 
    //   isAuthenticated, 
    //   isAdmin, 
    //   userRole,
    //   user: user ? `${user.username} (${user.role})` : null,
    //   token: token ? 'Token exists' : null
    // });
  }, [user, token, isAuthenticated, isAdmin, userRole]);

  // Provide the auth context
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading,
      login, 
      logout, 
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
