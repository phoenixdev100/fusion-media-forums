import api from './api';

// Admin Dashboard API utilities

// Helper function to ensure token is set in headers
const ensureAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Set token in both headers to ensure compatibility
    api.defaults.headers.common['x-auth-token'] = token;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Log authentication attempt for debugging
    console.log('Admin API authentication:', { hasToken: !!token });
  } else {
    console.warn('No authentication token found for admin API request');
  }
  return token;
};

// Get admin dashboard stats
export const getAdminStats = async () => {
  try {
    ensureAuth(); // Make sure token is set
    const response = await api.get('/api/admin/stats');
    return response.data.data || {
      users: { total: 0, new: 0 },
      posts: { total: 0, new: 0 },
      threads: { total: 0, new: 0 },
      categories: { total: 0 }
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    // Return default data on error
    return {
      users: { total: 0, new: 0 },
      posts: { total: 0, new: 0 },
      threads: { total: 0, new: 0 },
      categories: { total: 0 }
    };
  }
};

// User Management
export const getUsers = async (page = 1, limit = 10, search = '') => {
  try {
    ensureAuth();
    const response = await api.get('/api/admin/users', {
      params: { page, limit, search }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getRecentUsers = async (limit = 5) => {
  try {
    ensureAuth();
    const response = await api.get('/api/admin/users/recent', {
      params: { limit }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return [];
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/admin/users', userData);
    console.log('Create user API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create user'
    };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}`, userData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

export const banUser = async (userId, banData) => {
  try {
    // Convert duration to expiry if provided
    const payload = { ...banData };
    if (payload.duration) {
      // Calculate expiry date from duration (days)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(payload.duration));
      payload.expiry = expiryDate;
      delete payload.duration; // Remove duration as backend expects expiry
    }
    
    const response = await api.post(`/api/admin/users/${userId}/ban`, payload);
    return { success: true, ...response.data };
  } catch (error) {
    console.error(`Error banning user ${userId}:`, error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to ban user'
    };
  }
};

export const unbanUser = async (userId) => {
  try {
    ensureAuth();
    const response = await api.post(`/api/admin/users/${userId}/unban`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error(`Error unbanning user ${userId}:`, error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to unban user'
    };
  }
};

// Post Management
export const getPosts = async (page = 1, limit = 10, search = '') => {
  try {
    ensureAuth();
    const response = await api.get('/api/admin/posts', {
      params: { page, limit, search }
    });
    return response.data.data || { posts: [], total: 0 };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total: 0 };
  }
};

export const getAdminPosts = async (page = 1, limit = 20, search = '') => {
  try {
    ensureAuth();
    const response = await api.get('/api/admin/posts', {
      params: { page, limit, search }
    });
    return response.data || { data: [], pagination: { page: 1, pages: 1, total: 0 } };
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return { data: [], pagination: { page: 1, pages: 1, total: 0 } };
  }
};

export const getRecentPosts = async (limit = 5) => {
  try {
    ensureAuth();
    const response = await api.get('/api/admin/posts/recent', {
      params: { limit }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
};

export const deletePost = async (postId) => {
  try {
    ensureAuth();
    const response = await api.delete(`/api/admin/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    return { success: false, message: error.response?.data?.message || 'Failed to delete post' };
  }
};

// Thread Management
export const getThreads = async (page = 1, limit = 10, search = '') => {
  try {
    ensureAuth();
    const response = await api.get('/api/admin/threads', {
      params: { page, limit, search }
    });
    return response.data.data || { threads: [], total: 0 };
  } catch (error) {
    console.error('Error fetching threads:', error);
    return { threads: [], total: 0 };
  }
};

export const deleteThread = async (threadId) => {
  try {
    ensureAuth();
    const response = await api.delete(`/api/admin/threads/${threadId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting thread ${threadId}:`, error);
    return { success: false, message: error.response?.data?.message || 'Failed to delete thread' };
  }
};

export const toggleThreadAnnouncement = async (threadId, currentStatus) => {
  try {
    ensureAuth();
    const response = await api.put(`/api/admin/threads/${threadId}/announcement`, {
      isAnnouncement: !currentStatus
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling announcement status for thread ${threadId}:`, error);
    return { success: false, message: error.response?.data?.message || 'Failed to update thread announcement status' };
  }
};

// Category Management
export const getCategories = async () => {
  try {
    ensureAuth();
    const response = await api.get('/api/admin/categories');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (categoryData) => {
  try {
    ensureAuth();
    const response = await api.post('/api/admin/categories', categoryData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to create category' };
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    ensureAuth();
    const response = await api.put(`/api/admin/categories/${categoryId}`, categoryData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    return { success: false, message: error.response?.data?.message || 'Failed to update category' };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    ensureAuth();
    const response = await api.delete(`/api/admin/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error);
    return { success: false, message: error.response?.data?.message || 'Failed to delete category' };
  }
};

// Create announcement (thread with announcement flag)
export const createAnnouncement = async (announcementData) => {
  try {
    ensureAuth();
    // Add announcement flag to the thread data
    const threadData = {
      ...announcementData,
      isAnnouncement: true
    };
    
    const response = await api.post('/api/admin/threads', threadData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to create announcement' };
  }
};
