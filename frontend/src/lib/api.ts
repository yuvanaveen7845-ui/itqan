import axios from 'axios';

// Always use full API URL - required for separate frontend/backend deployments
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  googleLogin: (credential: string) => api.post('/auth/google', { credential }),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.post('/auth/change-password', data),
};

export const productAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  verifyPayment: (data: any) => api.post('/orders/verify-payment', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  estimateDelivery: (pincode: string) => api.post('/orders/estimate-delivery', { pincode }),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: () => api.get('/admin/orders'),
  getCustomers: () => api.get('/admin/customers'),
  getInventory: () => api.get('/admin/inventory'),
  createAdmin: (data: any) => api.post('/admin/create-admin', data),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.post('/admin/settings', data),
};

export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId: string) => api.post('/wishlist', { product_id: productId }),
  remove: (productId: string) => api.delete(`/wishlist/${productId}`),
};

export const cartAPI = {
  getAll: () => api.get('/cart'),
  sync: (items: any[]) => api.post('/cart/sync', { items }),
  updateQuantity: (productId: string, quantity: number) => api.patch(`/cart/${productId}`, { quantity }),
  remove: (productId: string) => api.delete(`/cart/${productId}`),
};

export default api;
