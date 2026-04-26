import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, faFilter, faSort, 
  faEdit, faBan, faTrash, faEye, faCheckCircle, 
  faTimesCircle, faChevronLeft, faChevronRight,
  faSync
} from '@fortawesome/free-solid-svg-icons';

// Admin dashboard layout component
import AdminLayout from '../../../components/AdminLayout';
import UserRole from '../../../components/UserRole';
import { useAuth } from '../../../context/AuthContext';
import { getUsers, getUserById, banUser, unbanUser, deleteUser } from '../../../utils/adminAPI';

export default function AdminUsers() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Helper function to check if user has admin privileges
  const isAdmin = () => {
    return user && ['admin', 'developer', 'owner'].includes(user.role);
  };
  
  // Helper function to check if user has moderator privileges
  const isModerator = () => {
    return user && ['moderator', 'admin', 'developer', 'owner'].includes(user.role);
  };
  
  // State for users data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const usersPerPage = 10;
  
  // Refs for tracking state
  const dataLoadingRef = useRef(false);
  const authCheckedRef = useRef(false);
  
  // Set isClient to true when component mounts on client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check if user is authenticated and has admin privileges - only run once
  useEffect(() => {
    if (!authLoading && isClient && user && !authCheckedRef.current) {
      authCheckedRef.current = true;
      
      const adminRoles = ['admin', 'moderator', 'developer', 'owner'];
      const isAdmin = adminRoles.includes(user?.role);
      
      console.log('Admin check:', { 
        user: user?.username, 
        role: user?.role, 
        isAdmin
      });
      
      // Make sure the user has the required role
      if (!isAdmin) {
        console.log('User is not admin, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }
    } else if (!authLoading && isClient && !user && !authCheckedRef.current) {
      authCheckedRef.current = true;
      console.log('No user found, redirecting to login');
      router.push('/login');
    }
  }, [user, authLoading, router, isClient]);

  // Define fetchUsers function using useRef to avoid dependency issues
  const fetchDataRef = useRef(async () => {
    // Skip if already loading
    if (dataLoadingRef.current) {
      console.log('Already loading data, skipping fetch');
      return;
    }
    
    try {
      console.log('Starting users fetch');
      dataLoadingRef.current = true;
      setError(null);
      setLoading(true);
      
      // Make sure we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No auth token found');
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        dataLoadingRef.current = false;
        return;
      }
      
      // Ensure token is set in API headers
      const api = await import('../../../utils/api').then(module => module.default);
      api.defaults.headers.common['x-auth-token'] = token;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch all users from the API - no pagination to ensure we get ALL users
      console.log('Fetching users from API');
      const usersData = await getUsers(1, 1000); // Get up to 1000 users to ensure we get everyone
      
      if (!usersData || usersData.length === 0) {
        console.log('No users found or empty response');
        setError('No users found. The database may be empty or there might be a connection issue.');
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
        dataLoadingRef.current = false;
        return;
      }
      
      console.log(`Received ${usersData.length} users from API`);
      
      // Map the API response to match our expected format
      const formattedUsers = usersData.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email || 'No email provided',
        role: user.role || 'player',
        roleColor: user.roleColor || '#AAAAAA',
        joinDate: user.createdAt || new Date().toISOString(),
        isActive: user.isActive !== false, // Default to true if not specified
        isBanned: user.isBanned || false,
        banReason: user.banReason || '',
        banExpiry: user.banExpiry || null,
        lastActive: user.lastActive || user.updatedAt || user.createdAt || new Date().toISOString(),
        postCount: user.postCount || 0
      }));
      
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
      setTotalPages(Math.ceil(formattedUsers.length / usersPerPage));
      setLastRefresh(new Date());
      console.log(`Processed ${formattedUsers.length} users successfully`);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Failed to load users: ${error.message || 'Unknown error'}. Please try again later.`);
      // Set empty arrays to prevent rendering issues
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
      dataLoadingRef.current = false;
    }
  });
  
  // Function to trigger a data refresh
  const handleRefresh = () => {
    if (!dataLoadingRef.current) {
      console.log('Manual refresh triggered');
      fetchDataRef.current();
    } else {
      console.log('Refresh skipped - already loading data');
    }
  };
  
  // Fetch users when component mounts
  useEffect(() => {
    if (isClient && user && !authLoading) {
      fetchDataRef.current();
    }
  }, [isClient, user, authLoading]);

  // Apply filters and sorting whenever users, searchTerm, roleFilter, or sortBy changes
  useEffect(() => {
    if (!users.length) return;
    
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      if (roleFilter === 'banned') {
        result = result.filter(user => user.isBanned);
      } else if (roleFilter === 'inactive') {
        result = result.filter(user => !user.isActive);
      } else {
        result = result.filter(user => user.role === roleFilter);
      }
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'username':
        result.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case 'role':
        result.sort((a, b) => a.role.localeCompare(b.role));
        break;
      case 'posts':
        result.sort((a, b) => b.postCount - a.postCount);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
        break;
      case 'last-active':
        result.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
        break;
      default:
        break;
    }
    
    setFilteredUsers(result);
    setTotalPages(Math.ceil(result.length / usersPerPage));
    
    // Reset to first page when filters change
    if (currentPage > 1 && result.length <= usersPerPage) {
      setCurrentPage(1);
    }
  }, [users, searchTerm, roleFilter, sortBy]);

  // Get current page users
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  };

  // Handle user actions
  const handleEditUser = async (userId) => {
    try {
      // Instead of navigating to a separate page, we'll handle editing directly
      const userData = await getUserById(userId);
      if (userData) {
        // For now, just show the user data in an alert
        alert(`User ${userData.username} can be edited directly from the admin dashboard. This feature will be implemented soon.`);
      }
    } catch (error) {
      console.error('Error getting user details:', error);
      setError('Failed to get user details. Please try again.');
    }
  };
  
  const handleViewUser = (userId) => {
    // Open the user profile in a new tab
    window.open(`/profile/${userId}`, '_blank');
  };
  
  const handleBanUser = async (userId) => {
    const userToBan = users.find(u => u.id === userId);
    
    if (!userToBan) {
      setError('User not found. Please refresh the page and try again.');
      return;
    }
    
    if (userToBan.isBanned) {
      // Unban user
      if (window.confirm(`Are you sure you want to unban ${userToBan.username}?`)) {
        try {
          setLoading(true);
          const result = await unbanUser(userId);
          
          if (result.success) {
            // Show success message
            alert(`User ${userToBan.username} has been unbanned successfully.`);
            // Refresh data after unbanning
            fetchDataRef.current();
          } else {
            setError(result.message || 'Failed to unban user. Please try again.');
          }
        } catch (error) {
          console.error('Error unbanning user:', error);
          setError('Failed to unban user. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    } else {
      // Ban user
      const reason = window.prompt(`Enter reason for banning ${userToBan.username}:`);
      if (reason) {
        try {
          setLoading(true);
          // Ask for ban duration
          const durationStr = window.prompt(`Enter ban duration in days (default: 30):`, '30');
          const duration = parseInt(durationStr) || 30;
          
          const result = await banUser(userId, { reason, duration });
          
          if (result.success) {
            // Show success message
            alert(`User ${userToBan.username} has been banned successfully for ${duration} days.`);
            // Refresh data after banning
            fetchDataRef.current();
          } else {
            setError(result.message || 'Failed to ban user. Please try again.');
          }
        } catch (error) {
          console.error('Error banning user:', error);
          setError('Failed to ban user. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }
  };
  
  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    
    if (!userToDelete) {
      setError('User not found. Please refresh the page and try again.');
      return;
    }
    
    // Prevent users from deleting their own account
    if (userId === user.id) {
      setError('You cannot delete your own account.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to permanently delete ${userToDelete.username}? This action cannot be undone.`)) {
      try {
        setLoading(true);
        const result = await deleteUser(userId);
        
        if (result.success) {
          // Show success message
          alert(`User ${userToDelete.username} has been deleted successfully.`);
          // Refresh data after deletion
          fetchDataRef.current();
        } else {
          setError(result.message || 'Failed to delete user. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Show loading state while checking auth or during server-side rendering
  if (authLoading || !isClient || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="minecraft-panel p-6">
          <p className="text-center">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout user={user} activePage="users">
      <Head>
        <title>Manage Users | Admin Dashboard | Fusion Network</title>
      </Head>
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-minecraft text-minecraft-gold">Manage Users</h1>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-minecraft-stone">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <button 
            onClick={handleRefresh} 
            className="bg-minecraft-blue bg-opacity-20 hover:bg-opacity-30 text-minecraft-blue px-3 py-1 rounded flex items-center text-sm transition-colors"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSync} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          {/* Only show Create User button for admin and above */}
          {(user?.role === 'admin' || user?.role === 'developer' || user?.role === 'owner') && (
            <Link href="/admin/users/create" className="minecraft-button flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Create User
            </Link>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="minecraft-panel mb-6 bg-minecraft-red bg-opacity-10 border border-minecraft-red border-opacity-20">
          <div className="p-4">
            <p className="text-minecraft-red">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-sm text-minecraft-blue hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="minecraft-panel mb-6">
        <div className="p-4 border-b border-minecraft-stone border-opacity-20">
          <h2 className="font-minecraft flex items-center">
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Filters
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-minecraft mb-1">Search Users</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by username or email"
                  className="w-full minecraft-input"
                />
              </div>
            </div>
            
            {/* Role filter */}
            <div>
              <label className="block text-sm font-minecraft mb-1">Filter by Role</label>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 minecraft-input appearance-none"
                >
                  <option value="all">All Roles</option>
                  <option value="owner">Owner</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="helper">Helper</option>
                  <option value="media">Media</option>
                  <option value="player">Player</option>
                  <option value="banned">Banned</option>
                  <option value="inactive">Inactive</option>
                </select>
                <FontAwesomeIcon 
                  icon={faFilter} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-minecraft-stone opacity-70" 
                />
              </div>
            </div>
            
            {/* Sort by */}
            <div>
              <label className="block text-sm font-minecraft mb-1">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 minecraft-input appearance-none"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="username">Username (A-Z)</option>
                  <option value="role">Role</option>
                  <option value="posts">Most Posts</option>
                  <option value="last-active">Last Active</option>
                </select>
                <FontAwesomeIcon 
                  icon={faSort} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-minecraft-stone opacity-70" 
                />
              </div>
            </div>
          </div>
        </div>      
      </div>
      {/* Users table */}
      {loading ? (
        <div className="minecraft-panel p-6 text-center">
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className="minecraft-panel mb-4 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-minecraft-stone bg-opacity-10">
                <tr>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Join Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageUsers().map(user => (
                  <tr key={user.id} className="border-b border-minecraft-stone border-opacity-10 last:border-0">
                    <td className="p-3">
                      {user.username}
                    </td>
                    <td className="p-3">
                      <UserRole role={user.role} roleColor={user.roleColor} />
                    </td>
                    <td className="p-3">
                      {user.email}
                    </td>
                    <td className="p-3">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {user.isBanned ? (
                        <span className="flex items-center text-minecraft-red">
                          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                          Banned
                        </span>
                      ) : user.isActive ? (
                        <span className="flex items-center text-minecraft-green">
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-minecraft-stone">
                          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        {/* View Profile - available to all roles */}
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-minecraft-blue hover:text-minecraft-blue-light"
                          title="View Profile"
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        
                        {/* Edit User - only visible to admins, developers, and owners */}
                        {isAdmin() && (
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="text-minecraft-green hover:text-minecraft-green-light"
                            title="Edit User"
                            disabled={loading}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        )}
                        
                        {/* Ban/Unban User - for moderator and above */}
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className={`${user.isBanned ? 'text-minecraft-gold hover:text-minecraft-gold-light' : 'text-minecraft-red hover:text-minecraft-red-light'}`}
                          title={user.isBanned ? 'Unban User' : 'Ban User'}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                        
                        {/* Delete User - only for admin, developer, and owner */}
                        {isAdmin() && user.id !== user?._id && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-minecraft-red hover:text-minecraft-red-light"
                            title="Delete User"
                            disabled={loading}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-3 text-center text-minecraft-stone">
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-minecraft-stone">
                Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`minecraft-button-small ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`minecraft-button-small ${currentPage === pageNum ? 'bg-minecraft-gold text-black' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`minecraft-button-small ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
