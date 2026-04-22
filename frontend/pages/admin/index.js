import React, { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, faComments, faFolderOpen, faChartLine, 
  faCog, faShieldAlt, faExclamationTriangle, faUserShield,
  faBullhorn, faPlus, faEdit, faTrash, faSync, faTimes
} from '@fortawesome/free-solid-svg-icons'

// Admin dashboard layout component
import AdminLayout from '../../components/AdminLayout'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../context/AuthContext'

// Admin API utilities
import { 
  getAdminStats, 
  getRecentUsers, 
  getRecentPosts,
  getCategories,
  getThreads,
  deleteUser,
  deletePost,
  createAnnouncement
} from '../../utils/adminAPI'

function AdminDashboard() {
  // Auth and routing
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Helper function to check if user has admin privileges (admin, developer, owner)
  const isAdmin = () => {
    return user && ['admin', 'developer', 'owner'].includes(user.role);
  };
  
  // Helper function to check if user has moderator privileges
  const isModerator = () => {
    return user && ['moderator', 'admin', 'developer', 'owner'].includes(user.role);
  };
  
  // Client-side rendering state
  const [isClient, setIsClient] = useState(false);
  
  // Dashboard data states
  const [stats, setStats] = useState({
    users: { total: 0, new: 0 },
    posts: { total: 0, new: 0 },
    threads: { total: 0, new: 0 },
    categories: { total: 0 }
  });
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [recentThreads, setRecentThreads] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  // Default auto-refresh to false and interval to 60 seconds
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60); // seconds

  // Announcement form states
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [formError, setFormError] = useState('');
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check if user is authenticated and has admin privileges - only run once
  const authCheckedRef = useRef(false);
  
  useEffect(() => {
    // Only run this check once per component mount
    if (!loading && isClient && user && !authCheckedRef.current) {
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
      
      // For admin roles, we don't need to check specific permissions
      // Admin roles automatically have access to the admin panel
    } else if (!loading && isClient && !user && !authCheckedRef.current) {
      authCheckedRef.current = true;
      console.log('No user found, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router, isClient]);
  
  // State for error handling
  const [error, setError] = useState(null);
  
  // Define fetchDashboardData as a function that won't recreate on each render
  // We're using useRef instead of useCallback to avoid dependency issues
  const fetchDataRef = useRef(async () => {
    // Skip if already loading
    if (dataLoadingRef.current) {
      console.log('Already loading data, skipping fetch');
      return;
    }
    
    try {
      console.log('Starting data fetch');
      dataLoadingRef.current = true;
      setError(null);
      setDataLoading(true);
      
      // Make sure we have a token and user
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No auth token found');
        setError('Authentication token not found. Please log in again.');
        setDataLoading(false);
        dataLoadingRef.current = false;
        return;
      }
      
      // Fetch admin dashboard stats
      console.log('Fetching admin stats');
      const statsData = await getAdminStats();
      setStats(statsData);
      
      // Fetch recent users
      console.log('Fetching recent users');
      const usersData = await getRecentUsers(5);
      setUsers(usersData);
      
      // Fetch recent posts
      console.log('Fetching recent posts');
      const postsData = await getRecentPosts(5);
      setPosts(postsData);
      
      // Fetch categories
      console.log('Fetching categories');
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      // Fetch recent threads
      console.log('Fetching recent threads');
      const threadsData = await getThreads(1, 5);
      setRecentThreads(threadsData.threads || []);
      
      setLastRefresh(new Date());
      console.log('Data fetch completed successfully');
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      setError('Failed to load admin dashboard data. Please try again later.');
    } finally {
      setDataLoading(false);
      dataLoadingRef.current = false;
    }
  });
  
  // Create a ref to track loading state to prevent multiple simultaneous fetches
  const dataLoadingRef = useRef(false);
  
  // Function to trigger a data refresh
  const handleRefresh = () => {
    if (!dataLoadingRef.current) {
      console.log('Manual refresh triggered');
      fetchDataRef.current();
    } else {
      console.log('Refresh skipped - already loading data');
    }
  };
  
  // Fetch dashboard data effect - only runs once when component mounts
  const initialFetchRef = useRef(false);
  
  useEffect(() => {
    // Only fetch data when we have a user and we're on the client
    // And only do this once using the ref
    if (isClient && user && !loading && !initialFetchRef.current) {
      initialFetchRef.current = true;
      console.log('Initial data fetch');
      // Use a small timeout to ensure everything is ready
      setTimeout(() => {
        fetchDataRef.current();
      }, 500);
    }
  }, [isClient, user, loading]);
  
  // Auto-refresh effect with ref to prevent multiple intervals
  const autoRefreshRef = useRef(null);
  
  // Set up auto-refresh only when explicitly enabled
  useEffect(() => {
    // Clear any existing interval first
    if (autoRefreshRef.current) {
      console.log('Clearing existing auto-refresh interval');
      clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = null;
    }
    
    // Only set up auto-refresh if explicitly enabled by user
    // and we have a valid refresh interval (at least 10 seconds)
    if (autoRefresh && isClient && user && refreshInterval >= 10) {
      console.log(`Setting up auto-refresh every ${refreshInterval} seconds`);
      
      // Set new interval - using the ref version of the fetch function
      autoRefreshRef.current = setInterval(() => {
        if (!dataLoadingRef.current) {
          console.log('Auto-refreshing dashboard data');
          fetchDataRef.current();
        } else {
          console.log('Skipping auto-refresh - data already loading');
        }
      }, refreshInterval * 1000);
    }
    
    // Cleanup function
    return () => {
      if (autoRefreshRef.current) {
        console.log('Clearing auto-refresh interval');
        clearInterval(autoRefreshRef.current);
        autoRefreshRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, isClient, user]);
  
  // Event handlers
  const handleAnnouncementChange = (e) => {
    setAnnouncementData({
      ...announcementData,
      [e.target.name]: e.target.value
    });
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await createAnnouncement(announcementData);
      setShowAnnouncementForm(false);
      setAnnouncementData({ title: '', content: '', categoryId: '' });
      
      // Refresh data
      const statsData = await getAdminStats();
      setStats(statsData);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create announcement');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        
        // Refresh user list after deletion
        const updatedUsers = await getRecentUsers();
        setUsers(updatedUsers);
        
        // Refresh stats
        const updatedStats = await getAdminStats();
        setStats(updatedStats);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(postId);
        
        // Refresh post list after deletion
        const updatedPosts = await getRecentPosts(5);
        setPosts(updatedPosts);
        
        // Refresh stats
        const updatedStats = await getAdminStats();
        setStats(updatedStats);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleDeleteThread = async (threadId) => {
    if (window.confirm('Are you sure you want to delete this thread? This will delete all posts in this thread. This action cannot be undone.')) {
      try {
        await deleteThread(threadId);
        
        // Refresh thread list after deletion
        const threadsData = await getThreads(1, 5);
        setRecentThreads(threadsData.threads || []);
        
        // Refresh stats
        const updatedStats = await getAdminStats();
        setStats(updatedStats);
      } catch (error) {
        console.error('Error deleting thread:', error);
      }
    }
  };

  // Show loading state while checking auth or during server-side rendering
  if (loading || !isClient || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="minecraft-panel p-6">
          <p className="text-center">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout user={user} activePage="dashboard">
      <Head>
        <title>Admin Dashboard | Fusion Network</title>
      </Head>
      
      {/* Refresh controls */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-minecraft text-minecraft-gold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-minecraft-stone">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm flex items-center">
              <input 
                type="checkbox" 
                checked={autoRefresh} 
                onChange={() => setAutoRefresh(!autoRefresh)}
                className="mr-2"
              />
              Auto-refresh
            </label>
            {autoRefresh && (
              <select 
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="bg-minecraft-panel border border-minecraft-stone border-opacity-20 rounded px-2 py-1 text-sm"
              >
                <option value="10">10s</option>
                <option value="30">30s</option>
                <option value="60">1m</option>
                <option value="300">5m</option>
              </select>
            )}
          </div>
          <button 
            onClick={handleRefresh}
            className="flex items-center bg-minecraft-blue bg-opacity-10 hover:bg-opacity-20 px-3 py-1 rounded border border-minecraft-blue border-opacity-20 transition-colors"
            disabled={dataLoading}
          >
            <FontAwesomeIcon icon={faSync} className={`mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {error ? (
        <div className="minecraft-panel p-6 bg-minecraft-red bg-opacity-10 border border-minecraft-red border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-minecraft-red font-medium mb-2">Error Loading Dashboard</h3>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={handleRefresh}
              className="bg-minecraft-red bg-opacity-10 hover:bg-opacity-20 px-3 py-1 rounded border border-minecraft-red border-opacity-20 transition-colors"
            >
              <FontAwesomeIcon icon={faSync} className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      ) : dataLoading ? (
        <div className="minecraft-panel p-6">
          <p className="text-center">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* User Stats */}
            <div className="minecraft-panel">
              <div className="p-4 border-b border-minecraft-stone border-opacity-20">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="text-minecraft-blue mr-2" />
                  <h2 className="font-minecraft">Users</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold">{stats.users.total.toLocaleString()}</div>
                <div className="text-sm text-minecraft-stone">
                  <span className="text-minecraft-green">+{stats.users.new.toLocaleString()}</span> new this week
                </div>
                <div className="mt-2">
                  <Link href="/admin/users" className="text-xs text-minecraft-blue hover:underline">
                    View all users
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Posts Stats */}
            <div className="minecraft-panel">
              <div className="p-4 border-b border-minecraft-stone border-opacity-20">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faComments} className="text-minecraft-green mr-2" />
                  <h2 className="font-minecraft">Posts</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold">{stats.posts.total.toLocaleString()}</div>
                <div className="text-sm text-minecraft-stone">
                  <span className="text-minecraft-green">+{stats.posts.new.toLocaleString()}</span> new this week
                </div>
                <div className="mt-2">
                  <Link href="/admin/posts" className="text-xs text-minecraft-blue hover:underline">
                    Manage posts
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Threads Stats */}
            <div className="minecraft-panel">
              <div className="p-4 border-b border-minecraft-stone border-opacity-20">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faComments} className="text-minecraft-gold mr-2" />
                  <h2 className="font-minecraft">Threads</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold">{stats.threads.total.toLocaleString()}</div>
                <div className="text-sm text-minecraft-stone">
                  <span className="text-minecraft-green">+{stats.threads.new.toLocaleString()}</span> new this week
                </div>
                <div className="mt-2">
                  <Link href="/admin/threads" className="text-xs text-minecraft-blue hover:underline">
                    Manage threads
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Categories Stats */}
            <div className="minecraft-panel">
              <div className="p-4 border-b border-minecraft-stone border-opacity-20">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFolderOpen} className="text-minecraft-red mr-2" />
                  <h2 className="font-minecraft">Categories</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold">{stats.categories.total.toLocaleString()}</div>
                <div className="text-sm text-minecraft-stone">
                  {categories.length > 0 ? (
                    <span>{categories.length} active categories</span>
                  ) : (
                    <span>No categories found</span>
                  )}
                </div>
                <div className="mt-2">
                  <Link href="/admin/categories" className="text-xs text-minecraft-blue hover:underline">
                    Manage Categories
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Threads & Announcements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Recent Threads */}
            <div className="minecraft-panel">
              <div className="p-4 border-b border-minecraft-stone border-opacity-20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faComments} className="text-minecraft-gold mr-2" />
                    <h2 className="font-minecraft">Recent Threads</h2>
                  </div>
                  <Link href="/admin/threads" className="text-xs text-minecraft-blue hover:underline">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-4">
                {recentThreads && recentThreads.length > 0 ? (
                  <div className="space-y-4">
                    {recentThreads.map(thread => (
                      <div key={thread._id} className="border-b border-minecraft-stone border-opacity-20 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <Link href={`/forums/thread/${thread._id}`} className="font-medium hover:text-minecraft-blue">
                            {thread.title}
                            {thread.isAnnouncement && (
                              <span className="ml-2 text-xs bg-minecraft-gold bg-opacity-20 text-minecraft-gold px-2 py-0.5 rounded">
                                Announcement
                              </span>
                            )}
                          </Link>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-minecraft-stone">
                            By {thread.author ? thread.author.username : 'Unknown'}
                          </p>
                          <p className="text-xs text-minecraft-stone">
                            {isClient && thread.createdAt ? new Date(thread.createdAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-minecraft-stone">No threads found</p>
                )}
              </div>
            </div>
            
            {/* Announcements */}
            <div className="minecraft-panel">
              <div className="p-4 border-b border-minecraft-stone border-opacity-20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faBullhorn} className="text-minecraft-gold mr-2" />
                    <h2 className="font-minecraft">Announcements</h2>
                  </div>
                  <button 
                    onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                    className="text-xs bg-minecraft-green bg-opacity-10 hover:bg-opacity-20 px-2 py-1 rounded border border-minecraft-green border-opacity-20 transition-colors"
                  >
                    <FontAwesomeIcon icon={showAnnouncementForm ? faTimes : faPlus} className="mr-1" />
                    {showAnnouncementForm ? 'Cancel' : 'New'}
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {showAnnouncementForm && (
                  <div className="mb-6 bg-minecraft-stone bg-opacity-10 p-4 rounded">
                    <h3 className="font-minecraft text-lg mb-3">Create Announcement</h3>
                    
                    {formError && (
                      <div className="bg-minecraft-red bg-opacity-10 border border-minecraft-red border-opacity-20 p-3 rounded mb-4">
                        <p className="text-minecraft-red text-sm">{formError}</p>
                      </div>
                    )}
                    
                    <form onSubmit={handleAnnouncementSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={announcementData.title}
                          onChange={handleAnnouncementChange}
                          className="w-full minecraft-input"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <textarea
                          name="content"
                          value={announcementData.content}
                          onChange={handleAnnouncementChange}
                          className="w-full minecraft-input h-24"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          name="categoryId"
                          value={announcementData.categoryId}
                          onChange={handleAnnouncementChange}
                          className="w-full minecraft-input"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button type="submit" className="minecraft-button">
                        Create Announcement
                      </button>
                    </form>
                  </div>
                )}
                
                {/* Announcements List */}
                <div className="space-y-4">
                  {recentThreads && recentThreads.filter(thread => thread.isAnnouncement).length > 0 ? (
                    recentThreads.filter(thread => thread.isAnnouncement).map(announcement => (
                      <div key={announcement._id} className="border-b border-minecraft-stone border-opacity-20 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <Link href={`/forums/thread/${announcement._id}`} className="font-medium hover:text-minecraft-blue">
                            {announcement.title}
                          </Link>
                          <div className="flex space-x-2">
                            <Link href={`/admin/threads/edit/${announcement._id}`} className="text-xs text-minecraft-blue hover:underline">
                              <FontAwesomeIcon icon={faEdit} className="mr-1" />
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDeleteThread(announcement._id)}
                              className="text-xs text-minecraft-red hover:underline"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-minecraft-stone">
                            By {announcement.author ? announcement.author.username : 'Unknown'}
                          </p>
                          <p className="text-xs text-minecraft-stone">
                            {isClient && announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No announcements found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Recent Users */}
            <div className="minecraft-panel">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-minecraft text-minecraft-gold">
                    Recent Users
                  </h2>
                  <Link href="/admin/users" className="text-sm text-minecraft-blue hover:underline">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {users && users.length > 0 ? (
                    users.map(user => (
                      <div key={user._id} className="border-b border-minecraft-stone border-opacity-20 pb-3">
                        <div className="flex justify-between">
                          <Link href={`/admin/users/${user._id}`} className="font-medium hover:text-minecraft-blue">
                            {user.username}
                          </Link>
                          {isAdmin() && (
                            <button 
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-xs text-minecraft-red hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-minecraft-stone">
                            {user.email}
                          </p>
                          <p className="text-xs text-minecraft-stone">
                            {isClient && user.joinDate ? new Date(user.joinDate).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No users found</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recent Posts */}
            <div className="minecraft-panel">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-minecraft text-minecraft-gold">
                    Recent Posts
                  </h2>
                  <Link href="/admin/posts" className="text-sm text-minecraft-blue hover:underline">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {!isClient ? (
                    <p>Loading posts...</p>
                  ) : posts && posts.length > 0 ? (
                    posts.map(post => (
                      <div key={post._id} className="border-b border-minecraft-stone border-opacity-20 pb-3">
                        <div className="flex justify-between">
                          <Link href={`/forums/thread/${post.thread}`} className="font-medium hover:text-minecraft-blue">
                            {post.title || (post.content && post.content.substring(0, 50) + '...')}
                          </Link>
                          <button 
                            onClick={() => handleDeletePost(post._id)}
                            className="text-xs text-minecraft-red hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-minecraft-stone">
                            By {post.author ? post.author.username : 'Unknown'}
                          </p>
                          <p className="text-xs text-minecraft-stone">
                            {isClient && post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No posts found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="minecraft-panel">
            <div className="p-6">
              <h2 className="text-xl font-minecraft text-minecraft-gold mb-4">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isAdmin() && (
                  <Link href="/admin/users/create" className="bg-minecraft-blue bg-opacity-10 p-4 rounded border border-minecraft-blue border-opacity-20 hover:bg-opacity-20 transition-colors">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUserShield} className="text-minecraft-blue mr-2" />
                      <p className="font-medium">Create New User</p>
                    </div>
                    <p className="text-xs mt-1 text-minecraft-stone">Add a new user to the forum</p>
                  </Link>
                )}
                
                <Link href="/admin/categories" className="bg-minecraft-green bg-opacity-10 p-4 rounded border border-minecraft-green border-opacity-20 hover:bg-opacity-20 transition-colors">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faFolderOpen} className="text-minecraft-green mr-2" />
                    <p className="font-medium">Manage Categories</p>
                  </div>
                  <p className="text-xs mt-1 text-minecraft-stone">Create or edit forum categories</p>
                </Link>
                
                <Link href="/admin/users" className="bg-minecraft-gold bg-opacity-10 p-4 rounded border border-minecraft-gold border-opacity-20 hover:bg-opacity-20 transition-colors">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUsers} className="text-minecraft-gold mr-2" />
                    <p className="font-medium">Manage Users</p>
                  </div>
                  <p className="text-xs mt-1 text-minecraft-stone">View and manage all users</p>
                </Link>
              </div>
              
              {isClient && (
                <div className="mt-4 text-xs text-minecraft-stone">
                  Server Time: {new Date().toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default AdminDashboard;
