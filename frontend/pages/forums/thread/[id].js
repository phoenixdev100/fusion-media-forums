import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faLock, faThumbtack, faExclamationTriangle, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import ForumPost from '../../../components/ForumPost'

// No mock data - we'll fetch real data from the API

export default function ThreadDetail({ isAuthenticated, user, login }) {
  const router = useRouter()
  const { id } = router.query
  const [thread, setThread] = useState(null)
  const [posts, setPosts] = useState([])
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [replyError, setReplyError] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingPost, setEditingPost] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editError, setEditError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [replyImages, setReplyImages] = useState([])
  const [editImages, setEditImages] = useState([])
  const [keepImages, setKeepImages] = useState([])

  useEffect(() => {
    if (id) {
      const fetchThreadAndPosts = async () => {
        try {
          // Fetch thread data
          const threadResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/threads/${id}`);
          if (!threadResponse.ok) {
            throw new Error('Failed to fetch thread');
          }
          const threadData = await threadResponse.json();
          
          // Fetch posts for this thread
          const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${id}?page=${currentPage}`);
          if (!postsResponse.ok) {
            throw new Error('Failed to fetch posts');
          }
          const postsData = await postsResponse.json();
          
          // Update state with real data
          setThread(threadData);
          setPosts(postsData.posts || []);
          setTotalPages(postsData.pagination?.pages || 1);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching thread data:', error);
          setLoading(false);
        }
      };
      
      fetchThreadAndPosts();
    }
  }, [id, currentPage])

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      router.push(`/login?redirect=forums/thread/${id}`)
      return
    }
    
    if (!replyContent.trim()) {
      setReplyError('Reply content cannot be empty')
      return
    }
    
    // Check image upload limits
    if (replyImages.length > 5) {
      setReplyError('You can upload a maximum of 5 images per post. Please remove some images and try again.')
      return
    }
    
    // Check file sizes
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const oversizedImages = replyImages.filter(img => img.size > MAX_FILE_SIZE)
    if (oversizedImages.length > 0) {
      setReplyError(`Some images exceed the maximum file size of 5MB. Please resize your images and try again.`)
      return
    }
    
    setReplyLoading(true)
    setReplyError('')
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.')
      }
      
      // Create FormData for multipart/form-data (for file uploads)
      const formData = new FormData()
      formData.append('content', replyContent)
      formData.append('thread', id)
      
      // Add images if any
      if (replyImages.length > 0) {
        replyImages.forEach(image => {
          formData.append('images', image)
        })
      }
      
      // Send reply to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.errors && errorData.errors.length > 0) {
          // Handle validation errors
          const errorMessages = errorData.errors.map(err => err.msg).join('\n')
          throw new Error(errorMessages)
        } else if (errorData.message && errorData.message.includes('files')) {
          // Handle file upload errors with more details
          throw new Error(`${errorData.message}. You can upload a maximum of 5 images, each up to 5MB in size.`)
        } else {
          throw new Error(errorData.message || 'Failed to post reply')
        }
      }
      
      const newPost = await response.json()
      
      // Update UI with the new post
      setPosts([...posts, newPost])
      setReplyContent('')
      setReplyImages([])
      setReplyLoading(false)
      
      // Scroll to the new post
      window.scrollTo(0, document.body.scrollHeight)
    } catch (err) {
      console.error('Error posting reply:', err)
      setReplyError(err.message || 'Failed to post reply. Please try again.')
      setReplyLoading(false)
    }
  }

  // Handle post likes
  const handleLikePost = async (postId) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=forums/thread/${id}`)
      return
    }
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      // Send like request to API
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to like post')
      }
      
      // Update post likes in the UI
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const userLiked = post.likes?.includes(user.id)
          return {
            ...post,
            likes: userLiked
              ? post.likes.filter(id => id !== user.id)
              : [...(post.likes || []), user.id]
          }
        }
        return post
      }))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }
  
  // Handle post editing
  const handleEditPost = (postId) => {
    const post = posts.find(p => p._id === postId)
    if (post) {
      setEditingPost(post)
      setEditContent(post.content)
      setEditError('')
      // Initialize keepImages with IDs of all current images
      if (post.imageAttachments && post.imageAttachments.length > 0) {
        setKeepImages(post.imageAttachments.map(img => img._id))
      } else {
        setKeepImages([])
      }
    }
  }
  
  const handleCancelEdit = () => {
    setEditingPost(null)
    setEditContent('')
    setEditError('')
    setEditImages([])
    setKeepImages([])
  }
  
  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      setEditError('Post content cannot be empty')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      // Create FormData for multipart/form-data (for file uploads)
      const formData = new FormData()
      formData.append('content', editContent)
      
      // Add new images if any
      if (editImages.length > 0) {
        editImages.forEach(image => {
          formData.append('images', image)
        })
      }
      
      // Add IDs of images to keep
      if (keepImages.length > 0) {
        formData.append('keepImages', JSON.stringify(keepImages))
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update post')
      }
      
      const updatedPost = await response.json()
      
      // Update the post in the UI
      setPosts(posts.map(post => {
        if (post._id === editingPost._id) {
          return updatedPost
        }
        return post
      }))
      
      // Reset edit state
      setEditingPost(null)
      setEditContent('')
      setEditImages([])
      setKeepImages([])
    } catch (error) {
      console.error('Error updating post:', error)
      setEditError(error.message || 'Failed to update post')
    }
  }
  
  // Handle post deletion
  const handleDeletePost = (postId) => {
    setDeleteConfirm(postId)
  }
  
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      // Check if it was the first post (thread starter) before sending the delete request
      const deletedPost = posts.find(p => p._id === deleteConfirm)
      const isFirstPost = posts.indexOf(deletedPost) === 0
      
      // Send the delete request
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/${deleteConfirm}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Handle response
      if (!response.ok) {
        let errorMessage = 'Failed to delete post'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }
      
      // Handle successful deletion
      if (isFirstPost) {
        // If it was the thread starter, redirect to forums
        router.push('/forums')
        return
      }
      
      // Remove the post from the UI
      setPosts(posts.filter(post => post._id !== deleteConfirm))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(error.message || 'Failed to delete post')
      setDeleteConfirm(null)
    }
  }
  
  // Handle thread deletion
  const handleDeleteThread = async () => {
    // Only allow staff members to delete threads
    if (!isAuthenticated || !['admin', 'moderator', 'developer', 'owner'].includes(user?.role)) {
      return
    }
    
    if (!window.confirm('Are you sure you want to delete this entire thread? This action cannot be undone.')) {
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/threads/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete thread')
      }
      
      // Redirect to forums after successful deletion
      router.push('/forums')
    } catch (error) {
      console.error('Error deleting thread:', error)
      alert(error.message || 'Failed to delete thread')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="minecraft-panel p-8 text-center">
          <p className="text-xl">Loading thread...</p>
        </div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="minecraft-panel p-8 text-center">
          <p className="text-xl text-minecraft-red">Thread not found</p>
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
        <title>{thread.title} - Fusion Network Forums</title>
        <meta name="description" content={`${thread.title} - Discussion thread on Fusion Network Forums`} />
      </Head>
      
      <div className="mb-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/forums" className="text-minecraft-blue hover:text-minecraft-green">
            Forums
          </Link>
          <span className="mx-2">›</span>
          <Link href={`/forums/category/${thread.category?._id}`} className="text-minecraft-blue hover:text-minecraft-green">
            {thread.category?.name}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-minecraft-stone truncate">{thread.title}</span>
        </div>
        
        {/* Thread Title */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-minecraft text-minecraft-gold">
            {thread.isPinned && (
              <FontAwesomeIcon icon={faThumbtack} className="mr-2 text-minecraft-red" title="Pinned Thread" />
            )}
            {thread.isLocked && (
              <FontAwesomeIcon icon={faLock} className="mr-2 text-minecraft-red" title="Locked Thread" />
            )}
            {thread.title}
          </h1>
          
          <div className="flex items-center">
            <div className="text-sm text-minecraft-stone mr-4">
              <p>Views: {thread.views}</p>
              <p>Replies: {posts.length - 1}</p>
            </div>
            
            {/* Thread Actions for admins, moderators, developers, owners only */}
            {isAuthenticated && ['admin', 'moderator', 'developer', 'owner'].includes(user?.role) && (
              <button
                onClick={handleDeleteThread}
                className="text-minecraft-red hover:underline flex items-center"
                title="Delete Thread"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Thread Posts */}
      <div className="space-y-6 mb-8">
        {posts.map((post, index) => (
          <div key={post._id}>
            {editingPost && editingPost._id === post._id ? (
              <div className="minecraft-panel p-4">
                <h3 className="font-minecraft text-lg mb-2">Edit Post</h3>
                {editError && (
                  <div className="bg-minecraft-red bg-opacity-20 border border-minecraft-red rounded p-3 mb-4">
                    <p>{editError}</p>
                  </div>
                )}
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="minecraft-input w-full mb-4"
                  rows="6"
                ></textarea>
                
                {/* Current Images */}
                {editingPost.imageAttachments && editingPost.imageAttachments.length > 0 && (
                  <div className="mb-4">
                    <p className="font-minecraft mb-2">Current Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {editingPost.imageAttachments.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={`${process.env.NEXT_PUBLIC_URL}${image.path}`} 
                            alt={image.originalname || `Image ${index + 1}`}
                            className={`w-24 h-24 object-cover rounded-md border-2 ${keepImages.includes(image._id) ? 'border-minecraft-green' : 'border-minecraft-red'}`}
                          />
                          <button
                            type="button"
                            className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center ${keepImages.includes(image._id) ? 'bg-minecraft-red' : 'bg-minecraft-green'}`}
                            onClick={() => {
                              if (keepImages.includes(image._id)) {
                                setKeepImages(keepImages.filter(id => id !== image._id))
                              } else {
                                setKeepImages([...keepImages, image._id])
                              }
                            }}
                          >
                            {keepImages.includes(image._id) ? '✕' : '✓'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Images Upload */}
                <div className="mb-4">
                  <label className="block font-minecraft mb-2">Add New Images:</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={(e) => setEditImages(Array.from(e.target.files))}
                    className="minecraft-input w-full"
                  />
                  {editImages.length > 0 && (
                    <p className="mt-1 text-sm text-minecraft-green">{editImages.length} new image(s) selected</p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-minecraft-stone border-opacity-20 rounded hover:bg-minecraft-stone hover:bg-opacity-10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="minecraft-button"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <ForumPost
                post={post}
                isThreadStarter={index === 0}
                isAuthenticated={isAuthenticated}
                currentUser={user}
                onLike={() => handleLikePost(post._id)}
                onEdit={() => handleEditPost(post._id)}
                onDelete={() => handleDeletePost(post._id)}
                onReport={() => {}}
              />
            )}
          </div>
        ))}
        
        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="minecraft-panel p-6 max-w-md">
              <h3 className="font-minecraft text-xl mb-4">Confirm Deletion</h3>
              <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-minecraft-stone border-opacity-20 rounded hover:bg-minecraft-stone hover:bg-opacity-10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-minecraft-red bg-opacity-20 hover:bg-opacity-30 text-minecraft-red px-4 py-2 rounded border border-minecraft-red border-opacity-20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`minecraft-button px-3 py-1 ${
                  currentPage === page ? 'bg-minecraft-green' : ''
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Reply Form */}
      {!thread.isLocked && (!thread.category || thread.category.name !== 'Announcements' || (user && ['admin', 'developer', 'owner'].includes(user.role))) ? (
        <div className="minecraft-panel">
          <h2 className="font-minecraft text-xl mb-4 p-4 border-b border-minecraft-stone">
            <FontAwesomeIcon icon={faReply} className="mr-2" />
            Post Reply
          </h2>
          
          {!isAuthenticated ? (
            <div className="p-4 text-center">
              <p className="mb-4">You must be logged in to reply to this thread.</p>
              <Link href={`/login?redirect=forums/thread/${id}`} className="minecraft-button">
                Login to Reply
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReplySubmit} className="p-4">
              {replyError && (
                <div className="bg-minecraft-red bg-opacity-20 border border-minecraft-red rounded p-3 mb-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-minecraft-red mr-2" />
                    <p>{replyError}</p>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows="6"
                  className="minecraft-input w-full"
                  placeholder="Write your reply here..."
                  required
                ></textarea>
              </div>
              
              {/* Image Upload */}
              <div className="mb-4">
                <label className="block font-minecraft mb-2">Add Images (optional):</label>
                <p className="text-sm mb-2">Maximum 5 images, each up to 5MB in size</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={(e) => setReplyImages(Array.from(e.target.files))}
                  className="minecraft-input w-full"
                />
                {replyImages.length > 0 && (
                  <p className="mt-1 text-sm text-minecraft-green">
                    {replyImages.length} image(s) selected
                    {replyImages.length > 5 && (
                      <span className="text-minecraft-red ml-2">(Maximum 5 allowed)</span>
                    )}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="minecraft-button"
                  disabled={replyLoading}
                >
                  {replyLoading ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : thread.category && thread.category.name === 'Announcements' && (!user || !['admin', 'developer', 'owner'].includes(user.role)) ? (
        <div className="minecraft-panel p-4 text-center">
          <p className="text-minecraft-red">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            Only administrators, developers, and owners can reply to announcements.
          </p>
        </div>
      ) : (
        <div className="minecraft-panel p-4 text-center">
          <p className="text-minecraft-red">
            <FontAwesomeIcon icon={faLock} className="mr-2" />
            This thread is locked and no new replies can be posted.
          </p>
        </div>
      )}
    </>
  )
}
