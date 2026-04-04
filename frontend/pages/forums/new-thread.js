import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

// No mock data - we'll fetch categories from the API

export default function NewThread({ isAuthenticated, user }) {
  const router = useRouter()
  const { category: preselectedCategory } = router.query
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    tags: ''
  })
  const [threadImages, setThreadImages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=forums/new-thread')
      return
    }
    
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/forums`)
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        
        // Mark the Announcements category as restricted to higher staff only
        const processedCategories = data.map(category => ({
          ...category,
          id: category._id,
          restrictedTo: category.name === 'Announcements' ? ['admin', 'developer', 'owner'] : null
        }))
        
        setCategories(processedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Failed to load categories. Please try again.')
      }
    }
    
    fetchCategories()
    
    // Set preselected category if provided in URL
    if (preselectedCategory) {
      setFormData(prev => ({ ...prev, category: preselectedCategory }))
    }
  }, [isAuthenticated, router, preselectedCategory])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Please enter a thread title')
      return
    }
    if (!formData.category) {
      setError('Please select a category')
      return
    }
    if (!formData.content.trim()) {
      return
    }
    
    // Check if user has permission to post in selected category
    const selectedCategory = categories.find(cat => cat.id === formData.category)
    if (selectedCategory?.restrictedTo && !selectedCategory.restrictedTo.includes(user?.role)) {
      setError(`Only administrators, developers, and owners can post in the ${selectedCategory.name} category`)
      return
    }
    
    // Check image upload limits
    if (threadImages.length > 5) {
      setError('You can upload a maximum of 5 images per thread. Please remove some images and try again.')
      return
    }
    
    // Check file sizes
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const oversizedImages = threadImages.filter(img => img.size > MAX_FILE_SIZE)
    if (oversizedImages.length > 0) {
      setError(`Some images exceed the maximum file size of 5MB. Please resize your images and try again.`)
      return
    }
    
    setLoading(true)
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.')
      }
      
      // Create FormData for multipart/form-data (for file uploads)
      const formDataObj = new FormData()
      formDataObj.append('title', formData.title)
      formDataObj.append('category', formData.category)
      formDataObj.append('content', formData.content)
      
      // Add tags if any
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      if (tags.length > 0) {
        formDataObj.append('tags', tags.join(','))
      }
      
      // Add images if any
      if (threadImages.length > 0) {
        threadImages.forEach(image => {
          formDataObj.append('images', image)
        })
      }
      
      console.log('Sending thread data with', threadImages.length, 'images');
      
      // Send thread data to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/threads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      })
      
      if (!response.ok) {
        let errorMessage = 'Failed to create thread';
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.message || errorMessage;
          
          // Check for validation errors
          if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = errorData.errors.map(err => err.msg).join(', ');
          } else if (errorData.message && errorData.message.includes('files')) {
            // Handle file upload errors with more details
            errorMessage = `${errorData.message}. You can upload a maximum of 5 images, each up to 5MB in size.`;
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const createdThread = await response.json()
      
      // Redirect to the new thread page
      router.push(`/forums/thread/${createdThread._id}`)
    } catch (err) {
      console.error('Error creating thread:', err)
      setError(err.message || 'Failed to create thread. Please try again.')
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="text-center py-8">Redirecting to login...</div>
  }

  return (
    <>
      <Head>
        <title>Create New Thread - Fusion Network Forums</title>
        <meta name="description" content="Start a new discussion on the Fusion Network forums" />
      </Head>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-minecraft text-minecraft-gold mb-6">
          Create New Thread
        </h1>
        
        <div className="minecraft-panel">
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-minecraft-red bg-opacity-20 border border-minecraft-red rounded p-3 mb-6">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-minecraft-red mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 font-minecraft">
                Thread Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="minecraft-input w-full"
                placeholder="Enter a descriptive title for your thread"
                maxLength="100"
                required
              />
              <p className="text-sm text-minecraft-stone mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="category" className="block mb-2 font-minecraft">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="minecraft-input w-full"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option 
                    key={category.id} 
                    value={category.id}
                    disabled={category.restrictedTo && !category.restrictedTo.includes(user?.role)}
                  >
                    {category.name}
                    {category.restrictedTo && !category.restrictedTo.includes(user?.role) ? 
                      ' (Restricted)' : ''}
                  </option>
                ))}
              </select>
              {formData.category && (
                <p className="text-sm text-minecraft-stone mt-1">
                  {categories.find(cat => cat.id === formData.category)?.description}
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block mb-2 font-minecraft">
                Thread Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
                className="minecraft-input w-full"
                placeholder="Write your thread content here..."
                maxLength="10000"
                required
              ></textarea>
              <p className="text-sm text-minecraft-stone mt-1">
                {formData.content.length}/10000 characters
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="images" className="block mb-2 font-minecraft">
                Add Images (optional)
              </label>
              <p className="text-sm mb-2">Maximum 5 images, each up to 5MB in size</p>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => setThreadImages(Array.from(e.target.files))}
                className="minecraft-input w-full"
              />
              {threadImages.length > 0 && (
                <p className="text-sm text-minecraft-green mt-1">
                  {threadImages.length} image(s) selected
                  {threadImages.length > 5 && (
                    <span className="text-minecraft-red ml-2">(Maximum 5 allowed)</span>
                  )}
                </p>
              )}
            </div>
            
            <div className="mb-8">
              <label htmlFor="tags" className="block mb-2 font-minecraft">
                Tags (Optional)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="minecraft-input w-full"
                placeholder="survival, help, build, etc. (comma separated)"
              />
              <p className="text-sm text-minecraft-stone mt-1">
                Add relevant tags to help others find your thread
              </p>
            </div>
            
            <div className="flex justify-between">
              <Link href={formData.category ? `/forums/category/${formData.category}` : '/forums'} className="minecraft-button bg-minecraft-stone">
                Cancel
              </Link>
              
              <button
                type="submit"
                className="minecraft-button"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                {loading ? 'Creating Thread...' : 'Create Thread'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
