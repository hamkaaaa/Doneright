// API Service untuk berkomunikasi dengan backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function untuk handle API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Authentication API
export const authAPI = {
  register: async (username, email, password) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    return apiCall('/tasks');
  },

  create: async (taskData) => {
    return apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  update: async (id, taskData) => {
    return apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  delete: async (id) => {
    return apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  toggleComplete: async (id) => {
    return apiCall(`/tasks/toggle/${id}`, {
      method: 'PATCH',
    });
  },

  getTrash: async () => {
    return apiCall('/tasks/trash');
  },

  restore: async (id) => {
    return apiCall(`/tasks/restore/${id}`, {
      method: 'PATCH',
    });
  },

  deletePermanent: async (id) => {
    return apiCall(`/tasks/permanent/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return apiCall('/categories');
  },

  create: async (name) => {
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  delete: async (id) => {
    return apiCall(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  getAllTasks: async () => {
    return apiCall('/admin/tasks');
  },

  getOverdueTasks: async () => {
    return apiCall('/admin/overdue');
  },

  getStatistics: async () => {
    return apiCall('/admin/statistics');
  },

  getCategories: async () => {
    return apiCall('/admin/categories');
  },

  createCategory: async (name) => {
    return apiCall('/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  updateCategory: async (id, name) => {
    return apiCall(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  deleteCategory: async (id) => {
    return apiCall(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
