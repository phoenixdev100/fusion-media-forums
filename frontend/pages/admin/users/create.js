import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUserPlus, faExclamationTriangle, faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

// Admin dashboard layout component
import AdminLayout from '../../../components/AdminLayout'
import { useAuth } from '../../../context/AuthContext'
import { createUser } from '../../../utils/adminAPI'

export default function CreateUser() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    minecraftUsername: '',
    role: 'player',
    bio: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const authCheckedRef = useRef(false)

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if user is authenticated and has admin privileges
  useEffect(() => {
    if (!authLoading && isClient && user && !authCheckedRef.current) {
      authCheckedRef.current = true
      
      const adminRoles = ['admin', 'moderator', 'developer', 'owner']
      const isAdmin = adminRoles.includes(user?.role)
      
      console.log('Admin check:', { 
        user: user?.username, 
        role: user?.role, 
        isAdmin
      })
      
      // Make sure the user has the required role
      if (!isAdmin) {
        console.log('User is not admin, redirecting to dashboard')
        router.push('/dashboard')
        return
      }
    } else if (!authLoading && isClient && !user && !authCheckedRef.current) {
      authCheckedRef.current = true
      console.log('No user found, redirecting to login')
      router.push('/login')
    }
  }, [user, authLoading, router, isClient])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    
    // Validate form
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    // Ensure password only contains valid characters
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/
    if (!passwordRegex.test(formData.password)) {
      setError('Password contains invalid characters')
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }
    
    // Validate that the role is one of the allowed roles
    const validRoles = ['player', 'media', 'helper', 'moderator', 'admin', 'developer', 'owner']
    
    if (!validRoles.includes(formData.role)) {
      setError(`Invalid role: ${formData.role}. Please select a valid role.`)
      return
    }
    
    console.log(`Creating new user with role: ${formData.role}`)
    
    setLoading(true)
    
    try {
      // Prepare the user data for API call
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        minecraftUsername: formData.minecraftUsername || undefined,
        role: formData.role,
        bio: formData.bio || undefined
      }
      
      console.log('Creating new user:', { ...userData, password: '[REDACTED]' })
      
      // Call the API to create the user
      const result = await createUser(userData)
      
      console.log('Create user result:', result)
      
      if (!result || result.success === false) {
        // Handle API error response
        console.error('API returned error:', result?.message || 'Unknown error')
        setError(result?.message || 'Failed to create user')
        setLoading(false)
        return
      }
      
      console.log('User created successfully:', result)
      setLoading(false)
      setSuccess(true)
      
      // Show success message
      alert(`User ${formData.username} created successfully!`)
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        minecraftUsername: '',
        role: 'player',
        bio: ''
      })
      
      // Redirect to users list
      router.push('/admin/users')
    } catch (err) {
      console.error('Error creating user:', err)
      setLoading(false)
      setError(err.response?.data?.message || err.message || 'Failed to create user. Please try again.')
    }
  }

  // Show loading state while checking auth or during server-side rendering
  if (authLoading || !isClient || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="minecraft-panel p-6">
          <p className="text-center">Checking permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout user={user} activePage="users">
      <Head>
        <title>Create User - Admin Dashboard - Fusion Network</title>
      </Head>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-minecraft text-minecraft-gold mb-2">
            Create New User
          </h1>
          <p className="text-minecraft-stone">
            Add a new user to the Fusion Network.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            href="/admin/users" 
            className="minecraft-button-secondary flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Users
          </Link>
        </div>
      </div>
      
      <div className="minecraft-panel">
        <div className="p-6">
          {error && (
            <div className="bg-minecraft-red bg-opacity-20 border border-minecraft-red rounded p-3 mb-6">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-minecraft-red mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-minecraft-green bg-opacity-20 border border-minecraft-green rounded p-3 mb-6">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUserPlus} className="text-minecraft-green mr-2" />
                <p>User created successfully! Redirecting...</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username <span className="text-minecraft-red">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="minecraft-input w-full"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  maxLength="20"
                />
                <p className="text-xs text-minecraft-stone mt-1">
                  Username must be unique and between 3-20 characters.
                </p>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-minecraft-red">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="minecraft-input w-full"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-minecraft-stone mt-1">
                  Email must be unique and valid.
                </p>
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password <span className="text-minecraft-red">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="minecraft-input w-full"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                <p className="text-xs text-minecraft-stone mt-1">
                  Password must be at least 8 characters long.
                </p>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password <span className="text-minecraft-red">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="minecraft-input w-full"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-minecraft-stone mt-1">
                  Passwords must match.
                </p>
              </div>
              
              {/* Minecraft Username */}
              <div>
                <label htmlFor="minecraftUsername" className="block text-sm font-medium mb-2">
                  Minecraft Username
                </label>
                <input
                  type="text"
                  id="minecraftUsername"
                  name="minecraftUsername"
                  className="minecraft-input w-full"
                  value={formData.minecraftUsername}
                  onChange={handleChange}
                />
                <p className="text-xs text-minecraft-stone mt-1">
                  Optional. The user's in-game Minecraft username.
                </p>
              </div>
              
              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="minecraft-input w-full"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="player">Player</option>
                  <option value="media">Media</option>
                  <option value="helper">Helper</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                  <option value="owner">Owner</option>
                </select>
                <p className="text-xs text-minecraft-stone mt-1">
                  User's role determines their permissions.
                </p>
              </div>
              
              {/* Bio */}
              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  className="minecraft-input w-full"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength="500"
                ></textarea>
                <p className="text-xs text-minecraft-stone mt-1">
                  Optional. Maximum 500 characters.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Link
                href="/admin/users"
                className="minecraft-button-secondary mr-4"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="minecraft-button flex items-center"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
