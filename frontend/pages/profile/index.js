import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import UserRole from '../../components/UserRole'
import axios from 'axios'

export default function Profile({ isLoggedIn, user }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    bio: '',
    minecraftUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=profile')
    } else if (user) {
      setFormData(prevState => ({
        ...prevState,
        bio: user.bio || '',
        minecraftUsername: user.minecraftUsername || ''
      }))
    }
  }, [isLoggedIn, user, router])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validate password fields if attempting to change password
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password')
        setLoading(false)
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match')
        setLoading(false)
        return
      }
      if (formData.newPassword.length < 8) {
        setError('New password must be at least 8 characters')
        setLoading(false)
        return
      }
    }

    try {
      // In a real app, this would connect to your backend API
      // const response = await axios.put('/api/users/profile', {
      //   bio: formData.bio,
      //   minecraftUsername: formData.minecraftUsername,
      //   ...(formData.newPassword && {
      //     currentPassword: formData.currentPassword,
      //     newPassword: formData.newPassword
      //   })
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // })

      // For demo purposes, simulate a successful update
      setTimeout(() => {
        setSuccess('Profile updated successfully')
        setLoading(false)
        
        // Update local user data
        const updatedUser = {
          ...user,
          bio: formData.bio,
          minecraftUsername: formData.minecraftUsername
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.')
      setLoading(false)
    }
  }

  if (!isLoggedIn || !user) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>My Profile - Fusion Network</title>
        <meta name="description" content="Manage your Fusion Network profile" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-minecraft text-minecraft-gold mb-6">
          My Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="minecraft-panel">
            <div className="flex flex-col items-center p-4">
              <div className="w-32 h-32 bg-minecraft-black rounded-full mb-4 flex items-center justify-center overflow-hidden">
                {/* User avatar would go here */}
                <span className="text-5xl">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              
              <h2 className="text-xl font-minecraft mb-2">{user.username}</h2>
              
              <div className="mb-4">
                <UserRole role={user.role} roleColor={user.roleColor} />
              </div>
              
              <div className="text-sm text-minecraft-stone">
                <p>Member since: {new Date(user.joinDate || Date.now()).toLocaleDateString()}</p>
                <p>Posts: {user.postCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="minecraft-panel md:col-span-2">
            <form onSubmit={handleSubmit} className="p-4">
              {error && (
                <div className="bg-minecraft-red bg-opacity-20 border border-minecraft-red rounded p-3 mb-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-minecraft-red mr-2" />
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-minecraft-green bg-opacity-20 border border-minecraft-green rounded p-3 mb-4">
                  <p className="text-minecraft-green">{success}</p>
                </div>
              )}

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
                  placeholder="Your Minecraft username"
                />
                <p className="text-sm text-minecraft-stone mt-1">
                  This helps other players find you on the server
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="bio" className="block mb-2 font-minecraft">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="minecraft-input w-full"
                  placeholder="Tell us about yourself..."
                  maxLength="500"
                ></textarea>
                <p className="text-sm text-minecraft-stone mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div className="border-t border-minecraft-stone pt-6 mb-6">
                <h3 className="font-minecraft text-lg mb-4">Change Password</h3>
                
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block mb-2 font-minecraft">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="minecraft-input w-full"
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="newPassword" className="block mb-2 font-minecraft">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="minecraft-input w-full"
                    placeholder="Enter new password"
                    minLength="8"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block mb-2 font-minecraft">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="minecraft-input w-full"
                    placeholder="Confirm new password"
                    minLength="8"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="minecraft-button w-full"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
