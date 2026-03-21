import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    minecraftUsername: ''
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
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)

    try {
      // Use our configured API utility with the correct endpoint
      const response = await api.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        minecraftUsername: formData.minecraftUsername
      })
      
      // Handle successful registration - the redirect will happen in the AuthContext
      login(response.data.user, response.data.token)
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Register - Fusion Network</title>
        <meta name="description" content="Create a new account on Fusion Network" />
      </Head>

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-minecraft text-minecraft-gold mb-6 text-center">
          Create an Account
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
              <label htmlFor="username" className="block mb-2 font-minecraft">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="minecraft-input w-full"
                placeholder="Choose a username for the forums"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-minecraft">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="minecraft-input w-full"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="minecraftUsername" className="block mb-2 font-minecraft">
                Minecraft Username
              </label>
              <input
                type="text"
                id="minecraftUsername"
                name="minecraftUsername"
                value={formData.minecraftUsername}
                onChange={handleChange}
                className="minecraft-input w-full"
                placeholder="Your Minecraft username (optional)"
              />
            </div>

            <div className="mb-4">
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
                placeholder="Create a password"
                minLength="8"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 font-minecraft">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="minecraft-input w-full"
                placeholder="Confirm your password"
                minLength="8"
              />
            </div>

            <button
              type="submit"
              className="minecraft-button w-full"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-minecraft-blue hover:text-minecraft-green">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
