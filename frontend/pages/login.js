import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter()
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        console.log('Already authenticated as admin, redirecting to admin dashboard');
        router.push('/admin');
      } else {
        // console.log('Already authenticated as user, redirecting to dashboard');
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate form data before sending
      if (!formData.identifier || !formData.password) {
        setError('Username/email and password are required')
        setLoading(false)
        return
      }

      // Log the form data being sent
      // console.log('Sending login data:', { ...formData, password: '[REDACTED]' })
      
      // Use our configured API utility with the correct endpoint
      const response = await api.post('/api/auth/login', formData)
      
      // Log the response to debug
      // console.log('Login response:', response.data)
      
      if (response.data && response.data.token) {
        const userData = response.data.user
        const authToken = response.data.token
        
        // Log the user data to debug admin role
        // console.log('User data from login:', userData)
        // console.log('User role:', userData.role)
        // console.log('Is admin role?', ['admin', 'moderator', 'developer', 'owner'].includes(userData.role))
        
        // Use the auth context login function which handles everything
        login(userData, authToken)
        
        // No need for manual redirect, the login function will handle it
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      console.error('Login error:', err)
      
      // Enhanced error handling with more details
      if (err.response) {
        // Server responded with an error
        const errorMessage = err.response.data?.message || err.response.statusText || 'Server error'
        console.error('Login server error:', {
          status: err.response.status,
          message: errorMessage,
          data: err.response.data
        })
        setError(errorMessage)
      } else if (err.request) {
        // Request was made but no response
        console.error('Login network error: No response received')
        setError('Network error. Please check your connection and try again.')
      } else {
        // Something else happened
        console.error('Login error:', err.message)
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - Fusion Network</title>
        <meta name="description" content="Login to your Fusion Network account" />
      </Head>

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-minecraft text-minecraft-gold mb-6 text-center">
          Login
        </h1>

        <div className="minecraft-panel">
          {error && (
            <div className="bg-minecraft-red bg-opacity-20 border border-minecraft-red rounded p-3 mb-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-minecraft-red mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="identifier" className="block mb-2 font-minecraft">
                Username or Email
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="minecraft-input w-full"
                placeholder="Enter your username or email"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-minecraft">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="minecraft-input w-full"
                placeholder="Enter your password"
              />
              <div className="mt-1 text-right">
                <Link href="/forgot-password" className="text-sm text-minecraft-blue hover:text-minecraft-green">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="minecraft-button w-full"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Don't have an account?{' '}
              <Link href="/register" className="text-minecraft-blue hover:text-minecraft-green">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
