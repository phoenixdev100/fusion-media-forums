import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments, faNewspaper, faCog, faServer, faCalendarAlt, faThumbsUp, faSync } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function Dashboard({ user, isAuthenticated }) {
  const router = useRouter();
  const [stats, setStats] = useState({
    posts: 0,
    threads: 0,
    replies: 0
  });
  const [activities, setActivities] = useState([]);
  const [serverStats, setServerStats] = useState({
    online: false,
    playerCount: 0,
    maxPlayers: 100,
    loading: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Create a reference to store the interval ID for cleanup
  const refreshIntervalRef = useRef(null);
  
  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError('');
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Fetch user stats and activities from our API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      // Add timestamp to URL as a query parameter for cache busting
      const timestamp = new Date().getTime();
      
      // Use axios instead of fetch for better error handling
      const response = await axios.get(`${API_URL}/users/dashboard-stats?_t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });

      // Update state with the response data
      if (response.data) {
        setStats(response.data.stats || {
          posts: 0,
          threads: 0,
          replies: 0
        });
        setActivities(response.data.activities || []);
      }

      // Fetch Minecraft server stats
      try {
        const serverResponse = await axios.get(`${API_URL}/server-status?_t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });
        
        if (serverResponse.data) {
          setServerStats({
            online: serverResponse.data.online,
            playerCount: serverResponse.data.players?.online || 0,
            maxPlayers: serverResponse.data.players?.max || 100,
            loading: false
          });
        } else {
          // Fallback to default values if server status API fails
          setServerStats({
            online: true,
            playerCount: 0,
            maxPlayers: 100,
            loading: false
          });
        }
      } catch (serverErr) {
        console.error('Error fetching server status:', serverErr);
        setServerStats({
          online: true,
          playerCount: 0,
          maxPlayers: 100,
          loading: false
        });
      }

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Dashboard data error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };
  
  // Create a stable reference to the fetchDashboardData function
  const fetchDashboardDataRef = useRef(fetchDashboardData);
  
  // Handle redirects and initial data fetch
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect admin to admin dashboard
    if (user && ['admin', 'moderator', 'developer', 'owner'].includes(user.role)) {
      router.push('/admin');
      return;
    }
    
    // Initial data fetch
    fetchDashboardDataRef.current();
    
    // Set up polling for real-time updates
    if (autoRefresh) {
      // Clear any existing interval first to prevent duplicates
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      // Refresh data every 15 seconds (reduced from 30 for more frequent updates)
      refreshIntervalRef.current = setInterval(() => {
        console.log('Auto-refreshing dashboard data...');
        fetchDashboardDataRef.current();
      }, 15000); // 15 seconds
    }
    
    // Cleanup function to clear interval when component unmounts
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, user, router, autoRefresh]);
  
  // Add event listeners for visibility changes to pause/resume polling when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page is visible again, refresh data immediately and restart polling
        console.log('Page visible, refreshing data...');
        fetchDashboardDataRef.current();
        
        if (autoRefresh && !refreshIntervalRef.current) {
          refreshIntervalRef.current = setInterval(() => {
            fetchDashboardDataRef.current();
          }, 15000);
        }
      } else {
        // Page is hidden, clear interval to save resources
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      }
    };
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoRefresh]);

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <>
      <Head>
        <title>Dashboard - Fusion Network</title>
        <meta name="description" content="User dashboard for Fusion Network" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-minecraft text-minecraft-gold">
            Welcome, {user.username}!
          </h1>
          <div className="flex items-center">
            <span className="text-sm text-minecraft-stone mr-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <button 
              onClick={() => {
                console.log('Manual refresh triggered');
                fetchDashboardDataRef.current();
              }} 
              disabled={loading}
              className="minecraft-button-sm flex items-center"
              title="Refresh dashboard data"
            >
              <FontAwesomeIcon icon={faSync} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* User Profile Card */}
          <div className="minecraft-panel">
            <div className="flex flex-col items-center p-4">
              <div className="w-20 h-20 bg-minecraft-darkgray rounded-md mb-4 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar.startsWith('/') || user.avatar.startsWith('http') ? user.avatar : `/${user.avatar}`} 
                    alt={`${user.username}'s avatar`}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/static/images/default-avatar.png";
                    }}
                  />
                ) : (
                  <img 
                    src="/static/images/default-avatar.png" 
                    alt="Default avatar"
                    className="w-full h-full object-cover rounded-md"
                  />
                )}
              </div>
              <h3 className="font-minecraft text-xl mb-1">{user.username}</h3>
              <p className="text-sm mb-2" style={{ color: user.roleColor || '#FFFFFF' }}>{user.role || 'player'}</p>
              <p className="text-sm mb-4">Joined: {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Unknown'}</p>
              <Link href="/profile/edit" className="minecraft-button-sm w-full text-center">
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="minecraft-panel">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon={faNewspaper} className="text-minecraft-blue mr-2" />
                <h3 className="font-minecraft">Your Posts</h3>
              </div>
              <p className="text-3xl font-bold">{stats.posts}</p>
              <Link href="/profile/posts" className="text-sm text-minecraft-blue hover:underline mt-2 inline-block">
                View all posts
              </Link>
            </div>
          </div>

          <div className="minecraft-panel">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon={faComments} className="text-minecraft-green mr-2" />
                <h3 className="font-minecraft">Your Threads</h3>
              </div>
              <p className="text-3xl font-bold">{stats.threads}</p>
              <Link href="/profile/threads" className="text-sm text-minecraft-blue hover:underline mt-2 inline-block">
                View all threads
              </Link>
            </div>
          </div>

          <div className="minecraft-panel">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon={faComments} className="text-minecraft-gold mr-2" />
                <h3 className="font-minecraft">Your Replies</h3>
              </div>
              <p className="text-3xl font-bold">{stats.replies}</p>
              <Link href="/profile/replies" className="text-sm text-minecraft-blue hover:underline mt-2 inline-block">
                View all replies
              </Link>
            </div>
          </div>
        </div>

        <div className="minecraft-panel mb-8">
          <div className="p-4">
            <h2 className="text-2xl font-minecraft text-minecraft-gold mb-4">Recent Activity</h2>
            {loading ? (
              <div className="text-center py-4">
                <p>Loading your activity...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-minecraft-red">
                <p>{error}</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-4">
                <p>You don't have any recent activity yet.</p>
                <p className="mt-2">
                  <Link href="/forums" className="text-minecraft-blue hover:underline">
                    Start participating in forums
                  </Link>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className={index < activities.length - 1 ? "border-b border-minecraft-darkgray pb-3" : ""}>
                    {activity.type === 'post' && (
                      <p className="mb-1">
                        You replied to <Link href={`/forums/thread/${activity.threadId}`} className="text-minecraft-blue hover:underline">
                          {activity.threadTitle}
                        </Link>
                      </p>
                    )}
                    {activity.type === 'thread' && (
                      <p className="mb-1">
                        You created a new thread <Link href={`/forums/thread/${activity.threadId}`} className="text-minecraft-blue hover:underline">
                          {activity.threadTitle}
                        </Link> in {activity.categoryName}
                      </p>
                    )}
                    <p className="text-sm text-minecraft-lightgray">
                      {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="minecraft-panel">
            <div className="p-4">
              <h2 className="text-2xl font-minecraft text-minecraft-gold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link href="/forums" className="block p-2 hover:bg-minecraft-darkgray rounded">
                  <FontAwesomeIcon icon={faComments} className="mr-2" /> Browse Forums
                </Link>
                <Link href="/profile" className="block p-2 hover:bg-minecraft-darkgray rounded">
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> View Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="minecraft-panel">
            <div className="p-4">
              <h2 className="text-2xl font-minecraft text-minecraft-gold mb-4">Server Status</h2>
              {serverStats.loading ? (
                <div className="text-center py-2">
                  <p>Checking server status...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full ${serverStats.online ? 'bg-minecraft-green' : 'bg-minecraft-red'} mr-2`}></div>
                    <p>Fusion Network is {serverStats.online ? 'online' : 'offline'}</p>
                  </div>
                  <p className="mb-2">Players online: {serverStats.playerCount}/{serverStats.maxPlayers}</p>
                  <p className="text-sm">Server IP: fusion-network.xyz</p>
                  <div className="mt-4">
                    <a 
                      href="minecraft://connect/fusion-network.xyz" 
                      className="minecraft-button-sm w-full text-center block"
                    >
                      <FontAwesomeIcon icon={faServer} className="mr-2" />
                      Join Server
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
