import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Higher-order component that wraps pages requiring authentication
const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If authentication is done loading and user is not authenticated
      if (!loading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, loading, router]);

    // Show nothing while loading or redirecting
    if (loading || !isAuthenticated) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="minecraft-panel p-6 text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      );
    }

    // If authenticated, render the wrapped component with user and auth state
    return <WrappedComponent {...props} user={user} isAuthenticated={isAuthenticated} />;
  };

  // Copy getInitialProps from the wrapped component if it exists
  if (WrappedComponent.getInitialProps) {
    WithAuth.getInitialProps = WrappedComponent.getInitialProps;
  }

  return WithAuth;
};

export default withAuth;
