import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSync, faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons'
import AdminLayout from '../../../components/AdminLayout'
import { useAuth } from '../../../context/AuthContext'
import { getThreads, deleteThread, toggleThreadAnnouncement } from '../../../utils/adminAPI'

export default function AdminThreads() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Client-side rendering state
  const [isClient, setIsClient] = useState(false);
  
  // Threads data state
  const [threads, setThreads] = useState([]);
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
  
  // Define fetchThreads function
  const fetchDataRef = useRef(async () => {
    // Skip if already loading
    if (dataLoadingRef.current) {
      console.log('Already loading data, skipping fetch');
      return;
    }
    
    try {
      console.log('Starting threads fetch');
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
      
      // Fetch threads with pagination and search
      console.log(`Fetching threads (page ${currentPage}, search: "${searchTerm}")`)
      const response = await getThreads(currentPage, 20, searchTerm);
      
      setThreads(response.threads || []);
      setTotalPages(response.pagination?.pages || 1);
      setLastRefresh(new Date());
      console.log('Threads fetch completed successfully');
    } catch (error) {
      console.error('Error fetching threads:', error);
      setError('Failed to load threads. Please try again later.');
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
  
  // Fetch threads when component mounts or search/page changes
  useEffect(() => {
    if (isClient && user && !loading) {
      fetchDataRef.current();
    }
  }, [isClient, user, loading, currentPage, searchTerm]);
  
  // Handle thread deletion
  const handleDeleteThread = async (threadId) => {
    if (window.confirm('Are you sure you want to delete this thread? This will also delete all posts in the thread. This action cannot be undone.')) {
      try {
        setDataLoading(true);
        const result = await deleteThread(threadId);
        
        if (result.success) {
          // Show success message
          setError(null);
          alert('Thread and all associated posts deleted successfully');
          
          // Remove the thread from the local state to update UI immediately
          setThreads(prevThreads => prevThreads.filter(thread => thread._id !== threadId));
          
          // Then refresh all data to ensure everything is in sync
          fetchDataRef.current();
        } else {
          console.error('Failed to delete thread:', result.message);
          setError(`Failed to delete thread: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting thread:', error);
        setError(`Failed to delete thread: ${error.message || 'Unknown error'}`);
      } finally {
        setDataLoading(false);
      }
    }
  };
  
  // Handle toggling announcement status
  const handleToggleAnnouncement = async (threadId, isAnnouncement) => {
    try {
      setDataLoading(true);
      const result = await toggleThreadAnnouncement(threadId, isAnnouncement);
      
      if (result.success) {
        // Show success message
        setError(null);
        alert(result.message || `Thread ${isAnnouncement ? 'removed from announcements' : 'marked as announcement'}`);
        
        // Update the thread in the local state to update UI immediately
        setThreads(prevThreads => prevThreads.map(thread => 
          thread._id === threadId 
            ? { ...thread, isAnnouncement: !isAnnouncement }
            : thread
        ));
        
        // Then refresh all data to ensure everything is in sync
        fetchDataRef.current();
      } else {
        console.error('Failed to update thread announcement status:', result.message);
        setError(`Failed to update thread: ${result.message}`);
      }
    } catch (error) {
      console.error('Error toggling announcement status:', error);
      setError(`Failed to update thread: ${error.message || 'Unknown error'}`);
    } finally {
      setDataLoading(false);
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
    <AdminLayout user={user} activePage="threads">
      <Head>
        <title>Manage Threads | Admin Dashboard | Fusion Network</title>
      </Head>
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-minecraft text-minecraft-gold">Manage Threads</h1>
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
                placeholder="Search threads by title or author..."
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
      
      {/* Threads list */}
      <div className="minecraft-panel">
        <div className="p-4 border-b border-minecraft-stone border-opacity-20">
          <h2 className="font-minecraft">Threads</h2>
        </div>
        
        {dataLoading ? (
          <div className="p-6 text-center">
            <p>Loading threads...</p>
          </div>
        ) : threads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-minecraft-stone bg-opacity-10">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Author</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {threads.map(thread => (
                  <tr key={thread._id} className="border-b border-minecraft-stone border-opacity-10 last:border-0">
                    <td className="p-3">
                      <Link href={`/forums/thread/${thread._id}`} className="text-minecraft-blue hover:underline">
                        {thread.title}
                      </Link>
                    </td>
                    <td className="p-3">
                      {thread.author ? thread.author.username : 'Unknown'}
                    </td>
                    <td className="p-3">
                      {thread.category ? thread.category.name : 'Unknown'}
                    </td>
                    <td className="p-3">
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {thread.isAnnouncement && (
                        <span className="bg-minecraft-gold bg-opacity-20 text-minecraft-gold px-2 py-0.5 rounded text-xs">
                          Announcement
                        </span>
                      )}
                      {thread.isPinned && (
                        <span className="bg-minecraft-blue bg-opacity-20 text-minecraft-blue px-2 py-0.5 rounded text-xs ml-1">
                          Pinned
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleAnnouncement(thread._id, thread.isAnnouncement)}
                          className={`${
                            thread.isAnnouncement 
                              ? 'text-minecraft-gold' 
                              : 'text-minecraft-stone'
                          } hover:underline flex items-center`}
                          title={thread.isAnnouncement ? "Remove announcement" : "Make announcement"}
                        >
                          <FontAwesomeIcon icon={thread.isAnnouncement ? faTimes : faThumbtack} className="mr-1" />
                          <span>{thread.isAnnouncement ? "Unannounce" : "Announce"}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteThread(thread._id)}
                          className="text-minecraft-red hover:underline flex items-center"
                          title="Delete thread"
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
            <p className="text-minecraft-stone">No threads found</p>
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
