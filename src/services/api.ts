// API Service untuk berkomunikasi dengan backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function untuk handle API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
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
  register: async (username: string, email: string, password: string) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (email: string, password: string) => {
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

  create: async (taskData: any) => {
    return apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  update: async (id: string, taskData: any) => {
    return apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  toggleComplete: async (id: string) => {
    return apiCall(`/tasks/toggle/${id}`, {
      method: 'PATCH',
    });
  },

  getTrash: async () => {
    return apiCall('/tasks/trash');
  },

  restore: async (id: string) => {
    return apiCall(`/tasks/restore/${id}`, {
      method: 'PATCH',
    });
  },

  deletePermanent: async (id: string) => {
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

  create: async (name: string) => {
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  delete: async (id: string) => {
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

  createCategory: async (name: string) => {
    return apiCall('/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  updateCategory: async (id: string, name: string) => {
    return apiCall(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  deleteCategory: async (id: string) => {
    return apiCall(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
