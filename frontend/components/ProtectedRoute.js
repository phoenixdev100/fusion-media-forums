import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

// Protected route component that checks authentication and redirects if needed
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if the authentication is still loading
    if (loading) return;

    // Function to handle authorization checks
    const checkAuthorization = async () => {
      try {
        // Check if user exists
        if (!user) {
          console.log('No user found, redirecting to login');
          await router.push('/login');
          return;
        }

        // Check if admin access is required
        if (adminOnly) {
          const isAdmin = ['admin', 'moderator', 'developer', 'owner'].includes(user.role);
          if (!isAdmin) {
            console.log('User is not admin, redirecting to dashboard');
            await router.push('/dashboard');
            return;
          }
        }

        // If we get here, the user is authorized
        setAuthorized(true);
      } catch (error) {
        console.error('Navigation error in ProtectedRoute:', error);
        // Default to unauthorized state if there's an error
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, [user, loading, adminOnly, router]);

  // Show loading state while checking auth
  if (loading || !authorized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="minecraft-panel p-6">
          <p className="text-center">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated and has proper permissions
  return <>{children}</>;
};

export default ProtectedRoute;
