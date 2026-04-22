import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';
import { formatDistanceToNow } from 'date-fns';

const AdminLogs = ({ isAuthenticated, user }) => {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({
    action: '',
    resourceType: '',
    userId: ''
  });

  // Check if user is authenticated and has admin privileges
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=admin/logs');
      return;
    }

    if (!['admin', 'developer', 'owner'].includes(user?.role)) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Simple fetch with timestamp to prevent caching
        const timestamp = Date.now();
        
        console.log('Fetching logs...');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/logs?_t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.message || 'Failed to fetch logs');
        }

        const data = await response.json();
        console.log('Logs data received:', data);
        
        if (data.success) {
          setLogs(data.logs || []);
          setTotalPages(data.pagination?.pages || 1);
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch logs');
        }
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(err.message || 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && ['admin', 'developer', 'owner'].includes(user?.role)) {
      fetchLogs();
    }
  }, [isAuthenticated, user]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get action color
  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'text-minecraft-green';
      case 'update':
        return 'text-minecraft-blue';
      case 'delete':
        return 'text-minecraft-red';
      default:
        return 'text-minecraft-stone';
    }
  };

  // Get resource type icon
  const getResourceTypeIcon = (resourceType) => {
    switch (resourceType) {
      case 'thread':
        return '📝';
      case 'post':
        return '💬';
      case 'user':
        return '👤';
      case 'category':
        return '📁';
      default:
        return '❓';
    }
  };

  // Format log details
  const formatLogDetails = (log) => {
    const { action, resourceType, details } = log;
    
    // Handle system logs
    if (details?.type === 'system_log') {
      return details.message || 'System log entry';
    }
    
    // Handle user-related logs
    if (resourceType === 'user') {
      if (action === 'create') {
        if (details?.action === 'user_registration') {
          return `User registered: ${details?.username || 'Unknown'} (${details?.email || 'No email'})`;
        } else if (details?.action === 'admin_user_creation') {
          return `Admin ${details?.createdBy || 'Unknown'} created user: ${details?.username || 'Unknown'} with role: ${details?.role || 'Unknown'}`;
        }
        return `Created user: ${details?.username || 'Unknown'} with role: ${details?.role || 'Unknown'}`;
      }
      
      if (action === 'update') {
        return `Updated user: ${details?.username || 'Unknown'} (Role: ${details?.role || 'Unknown'})${details?.passwordChanged ? ' - Password changed' : ''}`;
      }
      
      if (action === 'delete') {
        return `Deleted user: ${details?.username || 'Unknown'} (${details?.email || 'No email'}) by ${details?.deletedBy || 'Unknown'}`;
      }
      
      if (action === 'login') {
        return `User login: ${details?.username || 'Unknown'} (Role: ${details?.role || 'Unknown'})`;
      }
    }
    
    // Handle thread-related logs
    if (resourceType === 'thread') {
      if (action === 'delete') {
        return `Deleted thread: "${details?.title || 'Unknown'}" from category ${details?.category || 'Unknown'}`;
      }
      
      if (action === 'create') {
        return `Created thread: "${details?.title || 'New thread'}" in category ${details?.category || 'Unknown'}`;
      }
      
      if (action === 'update') {
        return `Updated thread: "${details?.title || 'Unknown'}" in category ${details?.category || 'Unknown'}`;
      }
    }
    
    // Handle post-related logs
    if (resourceType === 'post') {
      if (action === 'delete') {
        return `Deleted post: "${details?.content || 'Unknown content'}"`;
      }
      
      if (action === 'update') {
        return `Updated post content from "${details?.originalContent || 'Unknown'}" to "${details?.newContent || 'Unknown'}"`;
      }
      
      if (action === 'create') {
        return `Created post: "${details?.content?.substring(0, 50) || 'New post'}${details?.content?.length > 50 ? '...' : ''}"`;
      }
    }
    
    // Handle category-related logs
    if (resourceType === 'category') {
      if (action === 'create') {
        return `Created category: ${details?.name || 'Unknown'}`;
      }
      if (action === 'update') {
        return `Updated category: ${details?.name || 'Unknown'}`;
      }
      if (action === 'delete') {
        return `Deleted category: ${details?.name || 'Unknown'}`;
      }
    }
    
    // Fallback for any other types - format JSON nicely
    try {
      if (typeof details === 'object' && details !== null) {
        // Format the JSON with indentation for better readability
        const formattedDetails = Object.entries(details)
          .filter(([key]) => key !== 'timestamp') // Exclude timestamp as it's shown separately
          .map(([key, value]) => {
            // Format the key-value pair
            let displayValue = value;
            if (typeof value === 'object' && value !== null) {
              displayValue = JSON.stringify(value);
            }
            return `${key}: ${displayValue}`;
          })
          .join('\n');
        
        return formattedDetails || JSON.stringify(details);
      }
      return JSON.stringify(details);
    } catch (e) {
      return 'Log details unavailable';
    }
  };

  return (
    <AdminLayout isAuthenticated={isAuthenticated} user={user}>
      <Head>
        <title>Admin Logs | Fusion Network</title>
      </Head>
      
      <div className="minecraft-panel p-6">
        <h1 className="text-2xl font-minecraft mb-6">System Logs</h1>
        
        {/* Filters */}
        <div className="bg-minecraft-stone bg-opacity-10 p-4 rounded-lg mb-6 border border-minecraft-stone border-opacity-20">
          <h2 className="font-minecraft text-lg mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-minecraft">Action</label>
              <select
                name="action"
                value={filter.action}
                onChange={handleFilterChange}
                className="minecraft-input w-full bg-minecraft-stone bg-opacity-5 border border-minecraft-stone border-opacity-30 rounded px-3 py-2"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-minecraft">Resource Type</label>
              <select
                name="resourceType"
                value={filter.resourceType}
                onChange={handleFilterChange}
                className="minecraft-input w-full bg-minecraft-stone bg-opacity-5 border border-minecraft-stone border-opacity-30 rounded px-3 py-2"
              >
                <option value="">All Types</option>
                <option value="thread">Thread</option>
                <option value="post">Post</option>
                <option value="user">User</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={() => {
                  setFilter({ action: '', resourceType: '', userId: '' });
                  setCurrentPage(1);
                }}
                className="minecraft-button-secondary px-4 py-2 h-10"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Logs Table */}
        {loading ? (
          <div className="text-center py-8">
            <p>Loading logs...</p>
          </div>
        ) : error ? (
          <div className="bg-minecraft-red bg-opacity-20 border border-minecraft-red rounded p-4 mb-4">
            <p>{error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <p>No logs found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-minecraft-stone bg-opacity-5 rounded-lg border border-minecraft-stone border-opacity-20">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-minecraft-stone bg-opacity-20 border-b-2 border-minecraft-stone border-opacity-30">
                    <th className="p-3 text-left font-minecraft text-sm">Time</th>
                    <th className="p-3 text-left font-minecraft text-sm">User</th>
                    <th className="p-3 text-left font-minecraft text-sm">Action</th>
                    <th className="p-3 text-left font-minecraft text-sm">Resource</th>
                    <th className="p-3 text-left font-minecraft text-sm">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr 
                      key={log._id} 
                      className={`border-b border-minecraft-stone border-opacity-10 hover:bg-minecraft-stone hover:bg-opacity-10 transition-colors ${index % 2 === 0 ? 'bg-minecraft-stone bg-opacity-5' : ''}`}
                    >
                      <td className="p-3 text-sm whitespace-nowrap">
                        <span className="text-minecraft-stone">
                          {formatDistanceToNow(new Date(log.details?.timestamp || log.timestamp))} ago
                        </span>
                      </td>
                      <td className="p-3">
                        {log.user ? (
                          <span className="font-minecraft">{log.user.username}</span>
                        ) : (
                          <span className="text-minecraft-stone italic">Unknown User</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`font-minecraft uppercase px-2 py-1 rounded ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="flex items-center">
                          <span className="text-xl mr-2">{getResourceTypeIcon(log.resourceType)}</span>
                          <span className="capitalize">{log.resourceType}</span>
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="tooltip relative group cursor-help">
                          <div className="line-clamp-2 break-words">
                            {formatLogDetails(log)}
                          </div>
                          <div className="tooltip-content invisible group-hover:visible absolute left-0 bottom-full mb-2 p-3 bg-minecraft-stone bg-opacity-90 text-white rounded shadow-lg z-10 w-80 text-xs">
                            <pre className="whitespace-pre-wrap break-words">{formatLogDetails(log)}</pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 bg-minecraft-stone bg-opacity-10 p-4 rounded-lg border border-minecraft-stone border-opacity-20">
                <div className="flex flex-wrap gap-2 justify-center">
                  {/* First page button */}
                  {currentPage > 2 && (
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-1 rounded bg-minecraft-stone bg-opacity-20 hover:bg-opacity-30 font-minecraft"
                    >
                      &laquo; First
                    </button>
                  )}
                  
                  {/* Previous page button */}
                  {currentPage > 1 && (
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-3 py-1 rounded bg-minecraft-stone bg-opacity-20 hover:bg-opacity-30 font-minecraft"
                    >
                      &lsaquo; Prev
                    </button>
                  )}
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    // Show only 5 pages around current page
                    .filter(page => (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ))
                    .map((page, index, array) => {
                      // Add ellipsis
                      const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                      const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span className="px-3 py-1">...</span>
                          )}
                          
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded font-minecraft ${
                              currentPage === page
                                ? 'bg-minecraft-blue text-white'
                                : 'bg-minecraft-stone bg-opacity-20 hover:bg-opacity-30'
                            }`}
                          >
                            {page}
                          </button>
                          
                          {showEllipsisAfter && (
                            <span className="px-3 py-1">...</span>
                          )}
                        </React.Fragment>
                      );
                    })
                  }
                  
                  {/* Next page button */}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-3 py-1 rounded bg-minecraft-stone bg-opacity-20 hover:bg-opacity-30 font-minecraft"
                    >
                      Next &rsaquo;
                    </button>
                  )}
                  
                  {/* Last page button */}
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-1 rounded bg-minecraft-stone bg-opacity-20 hover:bg-opacity-30 font-minecraft"
                    >
                      Last &raquo;
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLogs;
