import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import withAuth from '../../components/withAuth';

function EditProfile({ user, isAuthenticated }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    minecraftUsername: ''
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
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        minecraftUsername: user.minecraftUsername || ''
      });
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Get the updated user data from the response
      const updatedUser = await response.json();
      
      // Update the user data in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully! The changes will be reflected when you return to the dashboard.');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
      
      // Add a delay before redirecting to dashboard to show the success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update your profile. Please try again.');
      
      // Scroll to top to show error message
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Profile | Fusion Network Forums</title>
        <meta name="description" content="Edit your profile on Fusion Network Forums" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-minecraft text-minecraft-gold">Edit Profile</h1>
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
            <p className="text-center">Loading your profile data...</p>
          </div>
        ) : (
          <div className="minecraft-panel p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block mb-2 font-minecraft">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-minecraft-darkgray border border-minecraft-gray rounded text-white"
                  placeholder="Your username"
                  style={{ color: 'white' }}
                />
                <p className="text-sm text-gray-400 mt-1">
                  This is your display name on the forum
                </p>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-minecraft">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Minecraft Username
                </label>
                <input
                  type="text"
                  name="minecraftUsername"
                  value={formData.minecraftUsername}
                  onChange={handleChange}
                  className="w-full p-3 bg-minecraft-darkgray border border-minecraft-gray rounded text-white"
                  placeholder="Your Minecraft username"
                  style={{ color: 'white' }}
                />
                <p className="text-sm text-gray-400 mt-1">
                  This helps others recognize you on the server
                </p>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-minecraft">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-3 bg-minecraft-darkgray border border-minecraft-gray rounded min-h-[150px] text-white"
                  placeholder="Tell us about yourself..."
                  style={{ color: 'white' }}
                ></textarea>
                <p className="text-sm text-gray-400 mt-1">
                  This will be displayed on your public profile (max 500 characters)
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="minecraft-button"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default withAuth(EditProfile);
