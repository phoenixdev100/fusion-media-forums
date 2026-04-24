import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';

const CreateTestLog = ({ isAuthenticated, user }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    action: 'create',
    resourceType: 'thread',
    details: JSON.stringify({ message: 'Test log entry' }, null, 2)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Check if user is authenticated and has admin privileges
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=admin/create-test-log');
      return;
    }

    if (!['admin', 'developer', 'owner'].includes(user?.role)) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Parse details JSON
      let parsedDetails;
      try {
        parsedDetails = JSON.parse(formData.details);
      } catch (err) {
        throw new Error('Invalid JSON in details field');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/test/create-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: formData.action,
          resourceType: formData.resourceType,
          details: parsedDetails
        })
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create test log');
      }

      const data = await response.json();
      setSuccess('Test log created successfully!');
      console.log('Created log:', data.log);
      
      // Redirect to logs page after 2 seconds
      setTimeout(() => {
        router.push('/admin/logs');
      }, 2000);
    } catch (err) {
      console.error('Error creating test log:', err);
      setError(err.message || 'Failed to create test log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout isAuthenticated={isAuthenticated} user={user}>
      <Head>
        <title>Create Test Log | Fusion Network</title>
      </Head>
      
      <div className="minecraft-panel p-6">
        <h1 className="text-2xl font-minecraft mb-6">Create Test Log</h1>
        
        {error && (
          <div className="bg-minecraft-red bg-opacity-20 border border-minecraft-red rounded p-4 mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-minecraft-green bg-opacity-20 border border-minecraft-green rounded p-4 mb-4">
            <p>{success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Action</label>
            <select
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="minecraft-input w-full"
              required
            >
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Resource Type</label>
            <select
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
              className="minecraft-input w-full"
              required
            >
              <option value="thread">Thread</option>
              <option value="post">Post</option>
              <option value="user">User</option>
              <option value="category">Category</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Details (JSON)</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="minecraft-input w-full"
              rows="6"
              required
            ></textarea>
            <p className="text-sm text-minecraft-stone mt-1">
              Enter valid JSON object with details about the log entry
            </p>
          </div>
          
          <button
            type="submit"
            className="minecraft-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Test Log'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateTestLog;
