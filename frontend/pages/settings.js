import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import withAuth from '../components/withAuth';

function AccountSettings({ user, isAuthenticated }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // Initialize form with user data if available
    setFormData(prevState => ({
      ...prevState,
      email: user.email || ''
    }));
    setLoading(false);
  }, [isAuthenticated, user]);
  
  // This effect runs only once to set up initial state
  useEffect(() => {
    // Clear any previous errors
    setError('');
    setSuccess('');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate password inputs
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      setSuccess('Password updated successfully!');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.message || 'Failed to update your password. Please check your current password and try again.');
      
      // Scroll to top to show error message
      window.scrollTo(0, 0);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update email');
      }

      setSuccess('Email updated successfully!');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error updating email:', err);
      setError(err.message || 'Failed to update your email. Please try again.');
      
      // Scroll to top to show error message
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Head>
        <title>Account Settings | Fusion Network Forums</title>
        <meta name="description" content="Manage your account settings on Fusion Network Forums" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-minecraft text-minecraft-gold">Account Settings</h1>
          <Link href="/dashboard" className="minecraft-button-sm">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-white p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900 border border-green-700 text-white p-4 mb-6 rounded">
            {success}
          </div>
        )}

        {loading ? (
          <div className="minecraft-panel p-6">
            <p className="text-center">Loading your account data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="minecraft-panel p-6">
              <h2 className="text-xl font-minecraft text-minecraft-gold mb-4">
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full p-3 bg-minecraft-darkgray border border-minecraft-gray rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full p-3 bg-minecraft-darkgray border border-minecraft-gray rounded"
                    required
                    minLength="8"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 bg-minecraft-darkgray border border-minecraft-gray rounded"
                    required
                    minLength="8"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="minecraft-button"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            <div className="minecraft-panel p-6">
              <h2 className="text-xl font-minecraft text-minecraft-gold mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Update Email
              </h2>
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-6">
                  <label className="block mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-minecraft-darkgray border border-minecraft-gray rounded"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    This email is used for account recovery and notifications
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="minecraft-button"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Update Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default withAuth(AccountSettings);
