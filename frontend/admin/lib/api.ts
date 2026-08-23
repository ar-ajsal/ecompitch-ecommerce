// Admin Frontend — Centralized API Service
// All API calls go through this module. Never scatter raw fetch calls in components.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('admin_user');
  return u ? JSON.parse(u) : null;
};

export const setStoredUser = (user: any): void => {
  localStorage.setItem('admin_user', JSON.stringify(user));
};

// ─── Core request helper ──────────────────────────────────────────────────────
async function request<T = any>(
  path: string,
  options: RequestInit = {},
  isFormData = false
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });

  const data = await res.json().catch(() => ({ message: 'Unexpected server response' }));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ _id: string; name: string; email: string; role: string; token: string }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  getMe: () => request('/api/auth/me'),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export type ApiProduct = {
  _id: string;
  name: string;
  sku?: string;
  brand?: string;
  category: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  reorderLevel?: number;
  status: 'Active' | 'Draft' | 'Archived';
  images: { url: string; publicId: string }[];
  sold: number;
  tags?: string[];
  specifications?: { name: string; value: string }[];
  variants?: { name: string; options: string[] }[];
  createdAt: string;
};

// ─── CMS ──────────────────────────────────────────────────────────────────────
export type ApiCategory = {
  _id: string;
  name: string;
  description: string;
  image: { url: string; publicId: string };
  featured: boolean;
};

export type ApiSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroMedia: { url: string; publicId: string; type: 'image' | 'video' };
};

export const categoriesApi = {
  getAll: () => request<ApiCategory[]>('/api/categories'),
  create: (data: Partial<ApiCategory>) => request<ApiCategory>('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ApiCategory>) => request<ApiCategory>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/api/categories/${id}`, { method: 'DELETE' }),
};

export const settingsApi = {
  get: () => request<ApiSettings>('/api/settings'),
  update: (data: Partial<ApiSettings>) => request<ApiSettings>('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export const productApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ products: ApiProduct[]; total: number; page: number; pages: number }>(
      `/api/admin/products${qs}`
    );
  },

  getById: (id: string) => request<ApiProduct>(`/api/products/${id}`),

  create: (data: Partial<ApiProduct>) =>
    request<ApiProduct>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<ApiProduct>) =>
    request<ApiProduct>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/api/products/${id}`, { method: 'DELETE' }),
};

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getToken();
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await res.json().catch(() => ({ message: 'Upload failed' }));
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data;
  },

  deleteImage: (publicId: string) =>
    request<{ message: string }>(
      `/api/upload/${encodeURIComponent(publicId)}`,
      { method: 'DELETE' }
    ),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export type ApiOrder = {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  items: { product: string; name: string; image: string; price: number; quantity: number }[];
  shippingAddress: {
    fullName: string; street: string; city: string; state?: string; pincode: string; phone?: string;
  };
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  createdAt: string;
};

export const orderApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ orders: ApiOrder[]; total: number; page: number; pages: number }>(
      `/api/admin/orders${qs}`
    );
  },

  updateStatus: (id: string, status: string, paymentStatus?: string) =>
    request<ApiOrder>(`/api/orders/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ...(paymentStatus ? { paymentStatus } : {}) }),
    }),
};
