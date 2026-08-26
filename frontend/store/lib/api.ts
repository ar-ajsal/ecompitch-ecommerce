// User/Storefront — Centralized API Service
// All backend calls go through this module.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tw_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('tw_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('tw_token');
  localStorage.removeItem('tw_user');
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('tw_user');
  return u ? JSON.parse(u) : null;
};

export const setStoredUser = (user: any): void => {
  localStorage.setItem('tw_user', JSON.stringify(user));
};

// ─── Core request helper ──────────────────────────────────────────────────────
async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });

  const data = await res.json().catch(() => ({ message: 'Unexpected server response' }));

  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type ApiProduct = {
  _id: string;
  name: string;
  sku?: string;
  brand?: string;
  category: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  status: string;
  images: { url: string; publicId: string }[];
  sold: number;
  tags?: string[];
  specifications?: { name: string; value: string }[];
  variants?: { name: string; options: string[] }[];
  createdAt: string;
};

export type CartItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
  lineTotal: number;
};

export type CartData = {
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
};

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  address?: {
    fullName?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<AuthUser>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthUser>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request<AuthUser>('/api/auth/me'),

  updateProfile: (data: Partial<AuthUser & { password?: string }>) =>
    request<AuthUser>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ products: ApiProduct[]; total: number; page: number; pages: number }>(
      `/api/products${qs}`
    );
  },

  getById: (id: string) => request<ApiProduct>(`/api/products/${id}`),

  getCategories: () => request<string[]>('/api/products/categories'),
};

// ─── Dynamic CMS ──────────────────────────────────────────────────────────────
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
  // Business feature toggles
  whatsappEnabled: boolean;
  whatsappNumber: string;
  onlinePaymentEnabled: boolean;
};

export const categoriesApi = {
  getAll: () => request<ApiCategory[]>('/api/categories'),
};

export const settingsApi = {
  get: () => request<ApiSettings>('/api/settings'),
};

// ─── Payment ──────────────────────────────────────────────────────────────────
export const paymentApi = {
  createSession: (orderId: string) =>
    request<{ payment_session_id: string; order_id: string }>('/api/payment/create-session', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),

  verify: (orderId: string) =>
    request<{ success: boolean; message: string }>('/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export type ShippingAddress = {
  fullName: string;
  phone: string;
  email?: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  alternatePhone?: string;
};

export type ApiOrder = {
  _id: string;
  items: { product: string; name: string; image: string; price: number; quantity: number }[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export const orderApi = {
  createOrder: (shippingAddress: ShippingAddress, items: { product: string, quantity: number }[]) =>
    request<ApiOrder>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, items }),
    }),

  getMyOrders: () => request<ApiOrder[]>('/api/orders/my'),

  getOrderById: (id: string) => request<ApiOrder>(`/api/orders/${id}`),
};
