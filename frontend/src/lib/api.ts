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
  getCustomerById: (id: string) => api.get(`/admin/customers/${id}`),
  getInventory: () => api.get('/admin/inventory'),
  getAdmins: () => api.get('/admin/admins'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  createAdmin: (data: any) => api.post('/admin/create-admin', data),
  deleteAdmin: (id: string) => api.delete(`/admin/delete-admin/${id}`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.post('/admin/settings', data),
  uploadImage: (formData: FormData) => api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getUploadedImages: () => api.get('/admin/upload'),
  deleteUploadedImage: (filename: string) => api.delete(`/admin/upload/${filename}`),
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

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const couponAPI = {
  getAll: () => api.get('/coupons'),
  create: (data: any) => api.post('/coupons', data),
  validate: (code: string, amount: number) => api.post('/coupons/validate', { code, amount }),
  delete: (id: string) => api.delete(`/coupons/${id}`),
};

export const cmsAPI = {
  getSettings: () => api.get('/cms/settings'),
  updateSetting: (key: string, value: any) => api.post('/cms/settings', { key, value }),
  getBanners: () => api.get('/cms/banners'),
  getAllBanners: () => api.get('/cms/banners/all'),
  saveBanner: (data: any) => api.post('/cms/banners', data),
  deleteBanner: (id: string) => api.delete(`/cms/banners/${id}`),
  getPages: () => api.get('/cms/pages'),
  getPage: (slug: string) => api.get(`/cms/pages/${slug}`),
  savePage: (data: any) => api.post('/cms/pages', data),
};

export const addressAPI = {
  getAll: () => api.get('/addresses'),
  getById: (id: string) => api.get(`/addresses/${id}`),
  create: (data: any) => api.post('/addresses', data),
  update: (id: string, data: any) => api.put(`/addresses/${id}`, data),
  delete: (id: string) => api.delete(`/addresses/${id}`),
  setDefault: (id: string) => api.patch(`/addresses/${id}/default`),
};

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  items?: any[];
  created_at: string;
}

export default api;
