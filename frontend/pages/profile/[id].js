import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCalendarAlt, faComments } from '@fortawesome/free-solid-svg-icons'
import UserRole from '../../components/UserRole'

export default function UserProfile({ isAuthenticated, user: currentUser }) {
  const router = useRouter()
  const { id } = router.query
  const [profileUser, setProfileUser] = useState(null)
  const [userThreads, setUserThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        // Fetch user profile data
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found')
          }
          throw new Error('Failed to fetch user profile')
        }
        
        const userData = await response.json()
        setProfileUser(userData)
        
        // Fetch user's threads
        const threadsResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/threads/user/${id}?limit=5`)
        if (threadsResponse.ok) {
          const threadsData = await threadsResponse.json()
          setUserThreads(threadsData)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError(err.message || 'Failed to load user profile')
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="minecraft-panel p-8 text-center">
          <p className="text-xl">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="minecraft-panel p-8 text-center">
          <p className="text-xl text-minecraft-red">{error || 'User not found'}</p>
          <Link href="/forums" className="minecraft-button mt-4 inline-block">
            Return to Forums
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{profileUser.username}'s Profile - Fusion Network</title>
        <meta name="description" content={`${profileUser.username}'s profile on Fusion Network Forums`} />
      </Head>
      
      <div className="minecraft-panel mb-6">
        <h1 className="text-2xl font-minecraft text-minecraft-gold mb-6">
          User Profile
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* User Info */}
          <div className="md:w-1/3">
            <div className="minecraft-panel p-6 text-center">
              <div className="relative h-24 w-24 mx-auto mb-4">
                {profileUser.avatar ? (
                  <img 
                    src={profileUser.avatar.startsWith('/') || profileUser.avatar.startsWith('http') 
                      ? profileUser.avatar 
                      : `/${profileUser.avatar}`
                    } 
                    alt={`${profileUser.username}'s avatar`}
                    className="rounded-full object-cover minecraft-panel w-full h-full"
                  />
                ) : (
                  <img 
                    src="/static/images/default-avatar.png" 
                    alt="Default avatar"
                    className="rounded-full object-cover minecraft-panel w-full h-full"
                  />
                )}
              </div>
              
              <h2 className="text-xl font-minecraft mb-2">{profileUser.username}</h2>
              
              <div className="flex justify-center mb-4">
                <UserRole role={profileUser.role || 'player'} roleColor={profileUser.roleColor} />
              </div>
              
              <div className="text-sm text-minecraft-stone">
                <div className="flex items-center justify-center mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Joined: {new Date(profileUser.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faComments} className="mr-2" />
                  Posts: {profileUser.postCount || 0}
                </div>
              </div>
            </div>
          </div>
          
          {/* User Bio and Recent Activity */}
          <div className="md:w-2/3">
            <div className="minecraft-panel p-6 mb-6">
              <h3 className="text-lg font-minecraft mb-3 text-minecraft-green">About</h3>
              <p className="whitespace-pre-wrap">
                {profileUser.bio || 'This user has not added a bio yet.'}
              </p>
            </div>
            
            <div className="minecraft-panel p-6">
              <h3 className="text-lg font-minecraft mb-3 text-minecraft-green">Recent Threads</h3>
              
              {userThreads.length > 0 ? (
                <div className="space-y-4">
                  {userThreads.map(thread => (
                    <div key={thread._id} className="border-b border-minecraft-stone pb-3 last:border-0">
                      <Link 
                        href={`/forums/thread/${thread._id}`}
                        className="text-minecraft-blue hover:text-minecraft-green transition"
                      >
                        {thread.title}
                      </Link>
                      <div className="text-sm text-minecraft-stone mt-1">
                        Posted in: {thread.category?.name || 'Unknown Category'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-minecraft-stone">This user hasn't created any threads yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
