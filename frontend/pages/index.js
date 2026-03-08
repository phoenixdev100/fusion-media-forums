import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faServer, faUsers, faInfoCircle, faClock } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const [recentThreads, setRecentThreads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverStatus, setServerStatus] = useState({
    online: false,
    players: { online: 0, max: 0 },
    version: 'Unknown'
  })
  const [serverStatusLoading, setServerStatusLoading] = useState(true)
  
  useEffect(() => {
    const fetchRecentThreads = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/threads/recent`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent threads')
        }
        
        const data = await response.json()
        setRecentThreads(data)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching recent threads:', err)
        setError('Could not load recent activity')
        setIsLoading(false)
      }
    }
    
    const fetchServerStatus = async () => {
      try {
        setServerStatusLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/server-info`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch server status')
        }
        
        const data = await response.json()
        setServerStatus(data)
        setServerStatusLoading(false)
      } catch (err) {
        console.error('Error fetching server status:', err)
        setServerStatus({
          online: false,
          players: { online: 0, max: 0 },
          version: 'Unknown',
          error: 'Could not connect to server'
        })
        setServerStatusLoading(false)
      }
    }
    
    fetchRecentThreads()
    fetchServerStatus()
    
    // Refresh data every 30 seconds
    const threadsIntervalId = setInterval(() => {
      fetchRecentThreads()
    }, 30000)
    
    // Refresh server status every 60 seconds
    const serverStatusIntervalId = setInterval(() => {
      fetchServerStatus()
    }, 60000)
    
    return () => {
      clearInterval(threadsIntervalId)
      clearInterval(serverStatusIntervalId)
    }
  }, [])
  return (
    <>
      <Head>
        <title>Fusion Network - Minecraft Community</title>
        <meta name="description" content="Official forum for the Fusion Network Minecraft server" />
        <link rel="icon" href="/static/images/fusion-logo.png" />
      </Head>

      {/* Hero Section */}
      <section className="relative mb-12">
        <div className="minecraft-panel py-16 text-center">
          <h1 className="text-4xl font-minecraft text-minecraft-gold mb-4">
            Welcome to Fusion Network
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our thriving Minecraft community. Discuss, share, and connect with fellow players!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/forums" className="minecraft-button text-lg">
              Browse Forums
            </Link>
            <Link href="/server-info" className="minecraft-button text-lg">
              Server Information
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/forums" className="minecraft-panel text-center block hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <FontAwesomeIcon icon={faComments} className="text-minecraft-green text-4xl mb-4" />
            <h2 className="font-minecraft text-xl mb-2">Active Forums</h2>
            <p>Join discussions on various topics with our friendly community</p>
          </Link>
          
          <Link href="/server-info" className="minecraft-panel text-center block hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <FontAwesomeIcon icon={faServer} className="text-minecraft-blue text-4xl mb-4" />
            <h2 className="font-minecraft text-xl mb-2">Server Updates</h2>
            <p>Stay informed about the latest features and events on our server</p>
          </Link>
          
          <Link href="/forums#community" className="minecraft-panel text-center block hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <FontAwesomeIcon icon={faUsers} className="text-minecraft-gold text-4xl mb-4" />
            <h2 className="font-minecraft text-xl mb-2">Community</h2>
            <p>Connect with players and make new friends in our growing community</p>
          </Link>
          
          <Link href="/staff" className="minecraft-panel text-center block hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <FontAwesomeIcon icon={faInfoCircle} className="text-minecraft-red text-4xl mb-4" />
            <h2 className="font-minecraft text-xl mb-2">Our Team</h2>
            <p>Get help from our dedicated staff team and community members</p>
          </Link>
        </div>
      </section>

      {/* Server Info Section */}
      <section className="mb-12">
        <div className="minecraft-panel overflow-hidden border-2 border-minecraft-gold">
          <div className="bg-minecraft-black bg-opacity-70 p-6">
            <h2 className="font-minecraft text-3xl text-minecraft-gold mb-6 text-center">
              Join Our Minecraft Server
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left side content */}
              <div className="md:w-1/2">
                <div className="bg-minecraft-black bg-opacity-50 p-6 rounded-lg border border-minecraft-stone mb-6">
                  <p className="mb-4 text-lg">
                    Fusion Network is a community-focused Minecraft server with various game modes and features for all players.
                  </p>
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    <li className="text-minecraft-green">Survival Mode with Land Claims</li>
                    <li className="text-minecraft-blue">Creative Plots for Building</li>
                    <li className="text-minecraft-gold">Minigames and Events</li>
                    <li className="text-minecraft-red">Active Staff and Community</li>
                  </ul>
                </div>
                
                <div className="bg-minecraft-black p-5 rounded-lg border-2 border-minecraft-green mb-6 flex flex-col items-center">
                  <h3 className="font-minecraft text-minecraft-green mb-3 text-xl">Server Address:</h3>
                  <div className="bg-black bg-opacity-70 px-4 py-3 rounded w-full text-center">
                    <p className="font-minecraft text-xl select-all text-white">fusion-network.xyz</p>
                  </div>
                  <p className="text-xs mt-2 text-minecraft-stone">Click to copy</p>
                </div>
                
                <div className="flex justify-center">
                  <Link href="/server-info" className="minecraft-button inline-block text-lg px-8 py-3 transition-transform hover:scale-105">
                    <span className="mr-2">⛏️</span> Learn More
                  </Link>
                </div>
              </div>
              
              {/* Right side image */}
              <div className="md:w-1/2 flex justify-center items-center p-4">
                <div className="relative w-full max-w-md aspect-square transform hover:scale-105 transition-transform duration-300" style={{ height: '300px' }}>
                  <div className="absolute inset-0 bg-purple-600 bg-opacity-20 rounded-full animate-pulse -z-10"></div>
                  <Image 
                    src="/static/images/fusion-logo.png"
                    alt="Fusion Network Server"
                    fill
                    className="object-contain pixelated drop-shadow-lg"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Online players */}
            <div className="mt-6 flex justify-center">
              <div className="bg-minecraft-black bg-opacity-40 px-6 py-3 rounded-full">
                {serverStatusLoading ? (
                  <p className="text-minecraft-yellow">
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="font-minecraft">Checking server status...</span>
                  </p>
                ) : serverStatus.online ? (
                  <p className="text-minecraft-green">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="font-minecraft">Currently Online: {serverStatus.players.online} Players</span>
                  </p>
                ) : (
                  <p className="text-minecraft-red">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span className="font-minecraft">Server currently offline</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="font-minecraft text-2xl text-minecraft-gold mb-6">
          Recent Forum Activity
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="minecraft-loading">
              <span className="block w-8 h-8 bg-minecraft-green animate-pulse"></span>
              <span className="mt-4">Loading recent activity...</span>
            </div>
          </div>
        ) : error ? (
          <div className="minecraft-panel text-center py-8">
            <p className="text-minecraft-red">{error}</p>
            <p className="mt-2">Please try again later</p>
          </div>
        ) : recentThreads.length === 0 ? (
          <div className="minecraft-panel text-center py-8">
            <p>No forum activity yet. Be the first to create a thread!</p>
            <div className="mt-4">
              <Link href="/forums" className="minecraft-button inline-block">
                Start a Discussion
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentThreads.map((thread) => (
              <div key={thread._id} className="minecraft-panel">
                <div className="forum-post-header">
                  <Link href={`/forums/${thread.category._id}/threads/${thread._id}`} className="forum-post-title hover:text-minecraft-gold transition-colors">
                    {thread.title}
                  </Link>
                  <span className="text-sm flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" />
                    {new Date(thread.lastPostDate).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="forum-post-content">
                  <p>{thread.content ? (thread.content.length > 150 ? `${thread.content.substring(0, 150)}...` : thread.content) : 'No content available'}</p>
                </div>
                <div className="forum-post-footer">
                  <span>Posted by: {
                    thread.author ? (
                      <Link href={`/profile/${thread.author._id}`} className="text-minecraft-blue hover:underline">{thread.author.username}</Link>
                    ) : (
                      <span className="text-minecraft-stone">Deleted User</span>
                    )
                  }</span>
                  <span>Category: <Link href={`/forums/${thread.category._id}`} className="hover:underline">{thread.category.name}</Link></span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link href="/forums" className="minecraft-button">
            View All Forums
          </Link>
          {!isLoading && !error && recentThreads.length > 0 && (
            <p className="text-sm mt-4 text-gray-400">
              <FontAwesomeIcon icon={faClock} className="mr-1" /> Live data - automatically refreshes every 30 seconds
            </p>
          )}
        </div>
      </section>
    </>
  )
}
