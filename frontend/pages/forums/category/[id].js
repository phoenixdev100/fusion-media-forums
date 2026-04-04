import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faSort, faThumbtack, faLock, faComment, faEye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { formatDistanceToNow } from 'date-fns'

// No mock data - we'll fetch everything from the API

export default function CategoryPage({ isAuthenticated, user }) {
  const router = useRouter()
  const { id } = router.query
  const [category, setCategory] = useState(null)
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (id) {
      const fetchCategoryAndThreads = async () => {
        try {
          setLoading(true);
          // Fetch category data
          const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/forums/${id}`);
          
          if (!categoryResponse.ok) {
            throw new Error('Failed to fetch category');
          }
          
          const categoryData = await categoryResponse.json();
          setCategory(categoryData);
          
          // Fetch threads for this category
          const threadsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/forums/${id}/threads?page=${currentPage}&sort=${sortBy}&search=${encodeURIComponent(searchQuery)}`
          );
          
          if (!threadsResponse.ok) {
            throw new Error('Failed to fetch threads');
          }
          
          const threadsData = await threadsResponse.json();
          setThreads(threadsData.threads || []);
          setTotalPages(threadsData.pagination?.pages || 1);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching category data:', error.message);
          setLoading(false);
        }
      };
      
      fetchCategoryAndThreads();
    }
  }, [id, currentPage, sortBy, searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    // The useEffect will handle the API call when searchQuery changes
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    // The useEffect will handle the API call when sortBy changes
    setCurrentPage(1) // Reset to first page when changing sort
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="minecraft-panel p-8 text-center">
          <p className="text-xl">Loading category...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="minecraft-panel p-8 text-center">
          <p className="text-xl text-minecraft-red">Category not found</p>
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
        <title>{category.name} - Fusion Network Forums</title>
        <meta name="description" content={`Discussions in the ${category.name} category on Fusion Network Forums`} />
      </Head>
      
      <div className="mb-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/forums" className="text-minecraft-blue hover:text-minecraft-green">
            Forums
          </Link>
          <span className="mx-2">›</span>
          <span className="text-minecraft-stone">{category.name}</span>
        </div>
        
        {/* Category Header */}
        <div className="minecraft-panel mb-6">
          <div className="flex items-start p-4">
            <div className="text-4xl mr-4">{category.icon}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-minecraft text-minecraft-gold mb-2">
                {category.name}
              </h1>
              <p className="text-sm mb-2">{category.description}</p>
              
              {/* Admin-only notice for Announcements category */}
              {category.name === 'Announcements' && isAuthenticated && (!user || user.role !== 'admin') && (
                <div className="mt-2 p-2 bg-minecraft-red bg-opacity-20 rounded border border-minecraft-red">
                  <p className="text-sm">Note: Only administrators can create threads in the Announcements category.</p>
                </div>
              )}
              
              {/* Subforums */}
              {category.subforums && category.subforums.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-minecraft-stone">Subforums: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {category.subforums.map(subforum => (
                      <Link 
                        key={subforum.id} 
                        href={`/forums/category/${subforum.id}`}
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
                <span className="text-minecraft-gold">{category.totalThreads}</span> Threads
              </div>
              <div>
                <span className="text-minecraft-gold">{category.totalPosts}</span> Posts
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="minecraft-input w-full pl-10"
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-minecraft-stone"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="minecraft-input pr-10 appearance-none w-full"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-viewed">Most Viewed</option>
                <option value="most-replies">Most Replies</option>
              </select>
              <FontAwesomeIcon 
                icon={faSort} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-minecraft-stone pointer-events-none"
              />
            </div>
            
            {isAuthenticated && (
              // Only show New Thread button if:
              // 1. It's not the Announcements category, or
              // 2. User is an admin
              (category.name !== 'Announcements' || (user && user.role === 'admin')) && (
                <Link href={`/forums/new-thread?category=${id}`} className="minecraft-button whitespace-nowrap">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  New Thread
                </Link>
              )
            )}
          </div>
        </div>
        
        {/* Threads List */}
        {threads.length > 0 ? (
          <div className="minecraft-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-minecraft-stone">
                    <th className="py-3 px-4 text-left font-minecraft">Thread</th>
                    <th className="py-3 px-4 text-left font-minecraft hidden md:table-cell">Author</th>
                    <th className="py-3 px-4 text-center font-minecraft hidden md:table-cell">
                      <FontAwesomeIcon icon={faComment} title="Replies" />
                    </th>
                    <th className="py-3 px-4 text-center font-minecraft hidden md:table-cell">
                      <FontAwesomeIcon icon={faEye} title="Views" />
                    </th>
                    <th className="py-3 px-4 text-left font-minecraft">Last Post</th>
                  </tr>
                </thead>
                <tbody>
                  {threads.map(thread => (
                    <tr key={thread._id} className="border-b border-minecraft-stone hover:bg-minecraft-black hover:bg-opacity-30">
                      <td className="py-3 px-4">
                        <div className="flex items-start">
                          {/* Thread status icons */}
                          <div className="mr-2 mt-1">
                            {thread.isPinned && (
                              <FontAwesomeIcon icon={faThumbtack} className="text-minecraft-red block mb-1" title="Pinned Thread" />
                            )}
                            {thread.isLocked && (
                              <FontAwesomeIcon icon={faLock} className="text-minecraft-red" title="Locked Thread" />
                            )}
                          </div>
                          
                          {/* Thread title and metadata */}
                          <div>
                            <Link 
                              href={`/forums/thread/${thread._id}`}
                              className="font-minecraft text-minecraft-blue hover:text-minecraft-green block mb-1"
                            >
                              {thread.title}
                            </Link>
                            <div className="text-xs text-minecraft-stone flex items-center md:hidden">
                              <span>by {thread.author ? thread.author.username : 'Deleted User'}</span>
                              <span className="mx-1">•</span>
                              <span>{thread.replies} replies</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center">
                          {thread.author ? (
                            <>
                              <Link 
                                href={`/profile/${thread.author._id}`}
                                className="text-sm hover:text-minecraft-green"
                              >
                                {thread.author.username}
                              </Link>
                              <span 
                                className="ml-2 w-2 h-2 rounded-full"
                                style={{ backgroundColor: thread.author.roleColor }}
                                title={thread.author.role}
                              ></span>
                            </>
                          ) : (
                            <span className="text-sm text-minecraft-stone">Deleted User</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        {thread.replies}
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        {thread.views}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="flex items-center">
                            {thread.lastPostBy ? (
                              <>
                                <Link 
                                  href={`/profile/${thread.lastPostBy._id}`}
                                  className="hover:text-minecraft-green"
                                >
                                  {thread.lastPostBy.username}
                                </Link>
                                <span 
                                  className="ml-2 w-2 h-2 rounded-full"
                                  style={{ backgroundColor: thread.lastPostBy.roleColor }}
                                  title={thread.lastPostBy.role}
                                ></span>
                              </>
                            ) : (
                              <span className="text-minecraft-stone">Deleted User</span>
                            )}
                          </div>
                          <div className="text-xs text-minecraft-stone flex items-center mt-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            {formatDistanceToNow(new Date(thread.lastPostDate), { addSuffix: true })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="minecraft-panel p-8 text-center">
            <p className="text-lg mb-4">No threads found in this category</p>
            {isAuthenticated ? (
              <Link href={`/forums/new-thread?category=${id}`} className="minecraft-button">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create the First Thread
              </Link>
            ) : (
              <p>
                <Link href="/login" className="text-minecraft-blue hover:text-minecraft-green">
                  Login
                </Link> to create a new thread
              </p>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
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
      </div>
    </>
  )
}
