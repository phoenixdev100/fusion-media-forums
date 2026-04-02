import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faPlus, faSort, faSpinner } from '@fortawesome/free-solid-svg-icons'


export default function Forums({ isAuthenticated, user }) {
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [forumStats, setForumStats] = useState({
    totalThreads: 0,
    totalPosts: 0,
    totalUsers: 0
  })
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        // Use the full URL with http://localhost:5000 to ensure proper connection
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/forums`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          let errorMessage = 'Failed to fetch forum categories'
          try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } catch (e) {
            // If response is not JSON, use text instead
            const errorText = await response.text()
            console.error('Failed to fetch forum categories:', errorText)
          }
          throw new Error(errorMessage)
        }
        
        const data = await response.json()
        // console.log('Forum categories loaded:', data.length)
        // console.log('Categories data:', JSON.stringify(data, null, 2))
        setCategories(data)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching forum categories:', err)
        setError('Could not load forum categories. Please ensure the backend server is running.')
        setIsLoading(false)
      }
    }
    
    const fetchForumStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/forum-stats`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          // console.log('Forum stats loaded:', data)
          setForumStats({
            totalThreads: data.totalThreads || 0,
            totalPosts: data.totalPosts || 0,
            totalUsers: data.totalUsers || 0
          })
        } else {
          let errorText = 'Unknown error'
          try {
            errorText = await response.text()
          } catch (e) {}
          console.error('Failed to fetch forum stats:', errorText)
        }
      } catch (err) {
        console.error('Error fetching forum stats:', err)
      }
    }
    
    fetchCategories()
    fetchForumStats()
    
    // Refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchCategories()
      fetchForumStats()
    }, 60000)
    
    return () => clearInterval(intervalId)
  }, [])
  
  // Filter and organize categories
  let filteredCategories = [];
  
  // First, find the Announcements category
  const announcementsCategory = categories.find(category => 
    category.name.toLowerCase() === 'announcements' &&
    (category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Add Announcements category first if it exists and matches search
  if (announcementsCategory) {
    filteredCategories.push(announcementsCategory);
  }
  
  // Add game mode categories (Lifesteal, PvP, and Duels) if they match search
  categories.forEach(category => {
    const name = category.name.toLowerCase();
    const matchesSearch = (
      name.includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Add game modes in order
    if (matchesSearch && ['lifesteal', 'pvp', 'duels'].includes(name)) {
      // Skip if already added (should never happen, but just to be safe)
      if (!filteredCategories.some(c => c._id === category._id)) {
        filteredCategories.push(category);
      }
    }
  });
  
  // Add remaining categories that match search and aren't excluded
  categories.forEach(category => {
    const name = category.name.toLowerCase();
    const matchesSearch = (
      name.includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const isExcluded = [
      'survival mode', 
      'creative plots', 
      'minigames',
      'announcements', // Already handled
      'lifesteal',     // Already handled
      'pvp',           // Already handled
      'duels'          // Already handled
    ].includes(name);
    
    if (matchesSearch && !isExcluded) {
      // Skip if already added (should never happen, but just to be safe)
      if (!filteredCategories.some(c => c._id === category._id)) {
        filteredCategories.push(category);
      }
    }
  });
  
  return (
    <>
      <Head>
        <title>Forums - Fusion Network</title>
        <meta name="description" content="Browse and participate in discussions on the Fusion Network forums" />
      </Head>
      
      <div className="mb-8">
        <h1 className="text-3xl font-minecraft text-minecraft-gold mb-4">
          Forums
        </h1>
        <p className="text-lg mb-6">
          Join the conversation with fellow Fusion Network players
        </p>
        
        {/* Search and controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search forums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="minecraft-input w-full"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="minecraft-input pr-12 appearance-none w-full"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="active">Most Active</option>
              </select>
              <FontAwesomeIcon 
                icon={faSort} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-minecraft-stone pointer-events-none"
              />
            </div>
            
            {isAuthenticated ? (
              <Link href="/forums/new-thread" className="minecraft-button whitespace-nowrap">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                New Thread
              </Link>
            ) : (
              <Link href="/login?redirect=/forums" className="minecraft-button whitespace-nowrap bg-minecraft-blue">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Login to Post
              </Link>
            )}
          </div>
        </div>
        
        {/* Forum Categories */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="minecraft-panel flex justify-center items-center py-12">
              <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-minecraft-blue mr-3" />
              <span className="text-lg">Loading forum categories...</span>
            </div>
          ) : error ? (
            <div className="minecraft-panel text-center py-8">
              <p className="text-minecraft-red text-xl mb-2">{error}</p>
              <p>Please try again later</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <div key={category._id} className="minecraft-panel">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{category.icon}</div>
                  <div className="flex-1">
                    <Link 
                      href={`/forums/category/${category._id}`} 
                      className="font-minecraft text-xl text-minecraft-green hover:text-minecraft-blue transition"
                    >
                      {category.name}
                    </Link>
                    <p className="text-sm mb-2">{category.description}</p>
                    
                    {/* Subforums */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="mt-2 mb-3">
                        <span className="text-sm text-minecraft-stone">Subforums: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {category.subcategories.map(subforum => (
                            <Link 
                              key={subforum._id} 
                              href={`/forums/category/${subforum._id}`}
                              className="text-sm bg-minecraft-black px-2 py-1 rounded text-minecraft-blue hover:text-minecraft-green transition"
                            >
                              {subforum.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm hidden md:block">
                    <div className="mb-1">
                      <span className="text-minecraft-gold">{category.threadCount || 0}</span> Threads
                    </div>
                    <div>
                      <span className="text-minecraft-gold">{category.postCount || 0}</span> Posts
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="minecraft-panel text-center py-8">
              <p className="text-xl mb-2">No forums found matching "{searchQuery}"</p>
              <p>Try a different search term or browse all categories</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Forum Statistics */}
      <div className="minecraft-panel">
        <h2 className="font-minecraft text-xl text-minecraft-gold mb-4">Forum Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-minecraft text-minecraft-green">{forumStats.totalThreads.toLocaleString()}</p>
            <p className="text-sm text-minecraft-stone">Total Threads</p>
          </div>
          <div>
            <p className="text-2xl font-minecraft text-minecraft-green">{forumStats.totalPosts.toLocaleString()}</p>
            <p className="text-sm text-minecraft-stone">Total Posts</p>
          </div>
          <div>
            <p className="text-2xl font-minecraft text-minecraft-green">{forumStats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-minecraft-stone">Registered Members</p>
          </div>
        </div>
        <p className="text-xs text-center mt-4 text-minecraft-stone">Real-time data - automatically refreshes every minute</p>
      </div>
    </>
  )
}
