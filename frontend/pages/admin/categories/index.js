import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync, faTrash, faEdit, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import AdminLayout from '../../../components/AdminLayout'
import { useAuth } from '../../../context/AuthContext'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../utils/adminAPI'

export default function AdminCategories() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Client-side rendering state
  const [isClient, setIsClient] = useState(false);
  
  // Categories data state
  const [categories, setCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0,
    isRestricted: false,
    allowedRoles: []
  });
  
  // Refs for tracking state
  const dataLoadingRef = useRef(false);
  const authCheckedRef = useRef(false);
  
  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Helper function to check if user has admin privileges (admin, developer, owner)
  const isAdmin = () => {
    return user && ['admin', 'developer', 'owner'].includes(user.role);
  };
  
  // Helper function to check if user has moderator privileges
  const isModerator = () => {
    return user && ['moderator', 'admin', 'developer', 'owner'].includes(user.role);
  };
  
  // Check if user is authenticated and has admin privileges - only run once
  useEffect(() => {
    if (!loading && isClient && user && !authCheckedRef.current) {
      authCheckedRef.current = true;
      
      const staffRoles = ['admin', 'moderator', 'developer', 'owner'];
      const isStaff = staffRoles.includes(user?.role);
      
      console.log('Admin check:', { 
        user: user?.username, 
        role: user?.role, 
        isStaff
      });
      
      // Make sure the user has the required role
      if (!isStaff) {
        console.log('User is not staff, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }
    } else if (!loading && isClient && !user && !authCheckedRef.current) {
      authCheckedRef.current = true;
      console.log('No user found, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router, isClient]);
  
  // Define fetchCategories function
  const fetchDataRef = useRef(async () => {
    // Skip if already loading
    if (dataLoadingRef.current) {
      console.log('Already loading data, skipping fetch');
      return;
    }
    
    try {
      console.log('Starting categories fetch');
      dataLoadingRef.current = true;
      setError(null);
      setDataLoading(true);
      
      // Make sure we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No auth token found');
        setError('Authentication token not found. Please log in again.');
        setDataLoading(false);
        dataLoadingRef.current = false;
        return;
      }
      
      // Fetch categories
      console.log('Fetching categories');
      const categoriesData = await getCategories();
      
      setCategories(categoriesData || []);
      setLastRefresh(new Date());
      console.log('Categories fetch completed successfully');
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setDataLoading(false);
      dataLoadingRef.current = false;
    }
  });
  
  // Function to trigger a data refresh
  const handleRefresh = () => {
    if (!dataLoadingRef.current) {
      console.log('Manual refresh triggered');
      fetchDataRef.current();
    } else {
      console.log('Refresh skipped - already loading data');
    }
  };
  
  // Fetch categories when component mounts
  useEffect(() => {
    if (isClient && user && !loading) {
      fetchDataRef.current();
    }
  }, [isClient, user, loading]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!formData.name) {
      setFormError('Category name is required');
      return;
    }
    
    if (!formData.description) {
      setFormError('Category description is required');
      return;
    }
    
    try {
      setDataLoading(true);
      
      let result;
      if (editingCategory) {
        // Update existing category
        console.log(`Updating category ${editingCategory._id}:`, formData);
        result = await updateCategory(editingCategory._id, formData);
      } else {
        // Create new category
        console.log('Creating new category:', formData);
        result = await createCategory(formData);
      }
      
      if (result && result.success === false) {
        // Handle API error response
        console.error('API returned error:', result.message);
        setFormError(result.message || 'Failed to save category');
        return;
      }
      
      // Show success message
      alert(editingCategory ? 'Category updated successfully' : 'Category created successfully');
      
      // Reset form and refresh data
      setFormData({
        name: '',
        description: '',
        order: 0,
        isRestricted: false,
        allowedRoles: []
      });
      setShowForm(false);
      setEditingCategory(null);
      fetchDataRef.current();
    } catch (error) {
      console.error('Error saving category:', error);
      setFormError(`Failed to save category: ${error.message || 'Unknown error'}`);
    } finally {
      setDataLoading(false);
    }
  };
  
  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      order: category.order || 0,
      isRestricted: category.isRestricted || false,
      allowedRoles: category.allowedRoles || []
    });
    setShowForm(true);
  };
  
  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        setDataLoading(true);
        const result = await deleteCategory(categoryId);
        
        if (result.success) {
          // Show success message
          setError(null);
          alert('Category deleted successfully');
          
          // Remove the category from the local state to update UI immediately
          setCategories(prevCategories => prevCategories.filter(category => category._id !== categoryId));
          
          // Then refresh all data to ensure everything is in sync
          fetchDataRef.current();
        } else {
          console.error('Failed to delete category:', result.message);
          setError(result.message || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        setError(`Failed to delete category: ${error.message || 'Unknown error'}`);
      } finally {
        setDataLoading(false);
      }
    }
  };
  
  // Show loading state while checking auth or during server-side rendering
  if (loading || !isClient || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="minecraft-panel p-6">
          <p className="text-center">Checking permissions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AdminLayout user={user} activePage="categories">
      <Head>
        <title>Manage Categories | Admin Dashboard | Fusion Network</title>
      </Head>
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-minecraft text-minecraft-gold">Manage Categories</h1>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-minecraft-stone">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <button 
            onClick={handleRefresh} 
            className="bg-minecraft-blue bg-opacity-20 hover:bg-opacity-30 text-minecraft-blue px-3 py-1 rounded flex items-center text-sm transition-colors"
            disabled={dataLoading}
          >
            <FontAwesomeIcon icon={faSync} className={`mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
            {dataLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          {isAdmin() && (
            <button
              onClick={() => {
                setEditingCategory(null);
                setFormData({
                  name: '',
                  description: '',
                  order: 0,
                  isRestricted: false,
                  allowedRoles: []
                });
                setShowForm(!showForm);
              }}
              className="bg-minecraft-green bg-opacity-20 hover:bg-opacity-30 text-minecraft-green px-3 py-1 rounded flex items-center text-sm transition-colors"
            >
              <FontAwesomeIcon icon={showForm ? faTimes : faPlus} className="mr-2" />
              {showForm ? 'Cancel' : 'New Category'}
            </button>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="minecraft-panel mb-6 bg-minecraft-red bg-opacity-10 border border-minecraft-red border-opacity-20">
          <div className="p-4">
            <p className="text-minecraft-red">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-sm text-minecraft-blue hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}
      
      {/* Category Form */}
      {showForm && (
        <div className="minecraft-panel mb-6">
          <div className="p-4 border-b border-minecraft-stone border-opacity-20">
            <h2 className="font-minecraft">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
          </div>
          <div className="p-4">
            {formError && (
              <div className="bg-minecraft-red bg-opacity-10 border border-minecraft-red border-opacity-20 p-3 rounded mb-4">
                <p className="text-minecraft-red text-sm">{formError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full minecraft-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full minecraft-input"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full minecraft-input h-24"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRestricted"
                    checked={formData.isRestricted}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>Restricted Access</span>
                </label>
                <p className="text-xs text-minecraft-stone mt-1">
                  If checked, only users with specific roles will be able to access this category.
                </p>
              </div>
              
              {formData.isRestricted && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Allowed Roles</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['admin', 'moderator', 'helper', 'media', 'player'].map(role => (
                      <label key={role} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.allowedRoles.includes(role)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                allowedRoles: [...formData.allowedRoles, role]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                allowedRoles: formData.allowedRoles.filter(r => r !== role)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="capitalize">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mr-2 px-4 py-2 border border-minecraft-stone border-opacity-20 rounded hover:bg-minecraft-stone hover:bg-opacity-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="minecraft-button"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Categories list */}
      <div className="minecraft-panel">
        <div className="p-4 border-b border-minecraft-stone border-opacity-20">
          <h2 className="font-minecraft">Categories</h2>
        </div>
        
        {dataLoading ? (
          <div className="p-6 text-center">
            <p>Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-minecraft-stone bg-opacity-10">
                <tr>
                  <th className="p-3 text-left">Order</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Access</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id} className="border-b border-minecraft-stone border-opacity-10 last:border-0">
                    <td className="p-3">
                      {category.order || 0}
                    </td>
                    <td className="p-3">
                      {category.name}
                    </td>
                    <td className="p-3">
                      <div className="max-w-xs truncate">
                        {category.description || 'No description'}
                      </div>
                    </td>
                    <td className="p-3">
                      {category.isRestricted ? (
                        <span className="bg-minecraft-red bg-opacity-20 text-minecraft-red px-2 py-0.5 rounded text-xs">
                          Restricted
                        </span>
                      ) : (
                        <span className="bg-minecraft-green bg-opacity-20 text-minecraft-green px-2 py-0.5 rounded text-xs">
                          Public
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        {isAdmin() ? (
                          <>
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-minecraft-blue hover:underline flex items-center"
                              title="Edit category"
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-1" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-minecraft-red hover:underline flex items-center"
                              title="Delete category"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1" />
                              <span>Delete</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-minecraft-stone text-sm italic">View only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-minecraft-stone">No categories found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
