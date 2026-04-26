import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSync } from '@fortawesome/free-solid-svg-icons'
import AdminLayout from '../../../components/AdminLayout'
import { useAuth } from '../../../context/AuthContext'
import { getAdminPosts, deletePost } from '../../../utils/adminAPI'

export default function AdminPosts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Client-side rendering state
  const [isClient, setIsClient] = useState(false);
  
  // Posts data state
  const [posts, setPosts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Refs for tracking state
  const dataLoadingRef = useRef(false);
  const authCheckedRef = useRef(false);
  
  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check if user is authenticated and has admin privileges - only run once
  useEffect(() => {
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
    } else if (!loading && isClient && !user && !authCheckedRef.current) {
      authCheckedRef.current = true;
      console.log('No user found, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router, isClient]);
  
  // Define fetchPosts function
  const fetchDataRef = useRef(async () => {
    // Skip if already loading
    if (dataLoadingRef.current) {
      console.log('Already loading data, skipping fetch');
      return;
    }
    
    try {
      console.log('Starting posts fetch');
      dataLoadingRef.current = true;
      setError(null);
      setDataLoading(true);
      
      // Make sure we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No auth token found');
        setError('Authentication token not found. Please log in again.');
        setDataLoading(false);
        dataLoadingRef.current = false;
        return;
      }
      
      // Fetch posts with pagination and search
      console.log(`Fetching posts (page ${currentPage}, search: "${searchTerm}")`)
      const response = await getAdminPosts(currentPage, 20, searchTerm);
      
      if (response && response.data) {
        console.log(`Received ${response.data.length} posts from API`);
        setPosts(response.data);
        setTotalPages(response.pagination?.pages || 1);
        setLastRefresh(new Date());
        console.log('Posts fetch completed successfully');
      } else {
        console.error('Invalid response format from API:', response);
        setError('Received invalid data format from server');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setDataLoading(false);
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
  
  // Fetch posts when component mounts or search/page changes
  useEffect(() => {
    if (isClient && user && !loading) {
      fetchDataRef.current();
    }
  }, [isClient, user, loading, currentPage, searchTerm]);
  
  // Handle post deletion
  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        setDataLoading(true);
        const result = await deletePost(postId);
        
        if (result.success) {
          // Show success message
          setError(null);
          alert('Post deleted successfully');
          
          // Remove the post from the local state to update UI immediately
          setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
          
          // Then refresh all data to ensure everything is in sync
          fetchDataRef.current();
        } else {
          console.error('Failed to delete post:', result.message);
          setError(`Failed to delete post: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        setError(`Failed to delete post: ${error.message || 'Unknown error'}`);
      } finally {
        setDataLoading(false);
      }
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchDataRef.current();
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
    <AdminLayout user={user} activePage="posts">
      <Head>
        <title>Manage Posts | Admin Dashboard | Fusion Network</title>
      </Head>
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-minecraft text-minecraft-gold">Manage Posts</h1>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-minecraft-stone">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <button 
            onClick={handleRefresh} 
            className="bg-minecraft-blue bg-opacity-20 hover:bg-opacity-30 text-minecraft-blue px-3 py-1 rounded flex items-center text-sm transition-colors"
            disabled={dataLoading}
          >
            <FontAwesomeIcon icon={faSync} className={`mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
            {dataLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="minecraft-panel mb-6">
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts by content or author..."
                className="w-full minecraft-input"
              />
            </div>
            <button 
              type="submit" 
              className="ml-2 minecraft-button"
            >
              Search
            </button>
          </form>
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
      
      {/* Posts list */}
      <div className="minecraft-panel">
        <div className="p-4 border-b border-minecraft-stone border-opacity-20">
          <h2 className="font-minecraft">Posts</h2>
        </div>
        
        {dataLoading ? (
          <div className="p-6 text-center">
            <p>Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-minecraft-stone bg-opacity-10">
                <tr>
                  <th className="p-3 text-left">Content</th>
                  <th className="p-3 text-left">Author</th>
                  <th className="p-3 text-left">Thread</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id} className="border-b border-minecraft-stone border-opacity-10 last:border-0">
                    <td className="p-3">
                      <div className="max-w-xs truncate">
                        {post.content}
                      </div>
                    </td>
                    <td className="p-3">
                      {post.author ? post.author.username : 'Unknown'}
                    </td>
                    <td className="p-3">
                      {post.thread ? (
                        <Link href={`/forums/thread/${post.thread._id}`} className="text-minecraft-blue hover:underline">
                          {post.thread.title}
                        </Link>
                      ) : 'Unknown'}
                    </td>
                    <td className="p-3">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-minecraft-red hover:text-minecraft-red-light flex items-center"
                          title="Delete post"
                          disabled={dataLoading}
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-minecraft-stone">No posts found</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-minecraft-stone border-opacity-20 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 
                    ? 'bg-minecraft-stone bg-opacity-10 text-minecraft-stone cursor-not-allowed' 
                    : 'bg-minecraft-blue bg-opacity-20 text-minecraft-blue hover:bg-opacity-30'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center px-3">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages 
                    ? 'bg-minecraft-stone bg-opacity-10 text-minecraft-stone cursor-not-allowed' 
                    : 'bg-minecraft-blue bg-opacity-20 text-minecraft-blue hover:bg-opacity-30'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
