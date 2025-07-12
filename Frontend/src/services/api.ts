const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const PRODUCT_API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || 'https://rewear-product.vercel.app';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface GoogleTokenRequest {
  credential: string;
}

export interface User {
  _id?: string;
  email: string;
  name?: string;
  role: string;
  phone?: string | number;
  location?: string;
  bio?: string;
  picture?: string;
  points?: number;
  rating?: number;
  swaps?: number;
  items?: number;
  favorites?: number;
  // removed created_at and updated_at
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  user?: User;
  role?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category?: string;
  size?: string;
  condition?: string;
  points?: number;
  owner?: string;
  images?: string[];
  owner_id?: string;
  status?: string;
  brand?: string;
  color?: string;
  material?: string;
  measurements?: {
    chest?: string;
    length?: string;
    sleeves?: string;
  };
  tags?: string[];
  likes?: number;
  views?: number;
  postedDate?: string;
  pointsRedemption?: number;
  seller?: {
    name: string;
    avatar?: string;
    rating?: number;
    reviews?: number;
    joinDate?: string;
  };
}

class ApiService {
  private baseURL: string;
  private productBaseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.productBaseURL = PRODUCT_API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useProductApi: boolean = false
  ): Promise<T> {
    const url = `${useProductApi ? this.productBaseURL : this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Include cookies for session management
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(data: LoginRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user/logout', {
      method: 'POST',
    });
  }

  async googleLogin(data: GoogleTokenRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/google/token', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<User> {
    const response = await this.request<{user: User}>('/user/me', {
      method: 'GET',
    });
    return response.user;
  }

  async checkAuth(): Promise<boolean> {
    try {
      const response = await this.request<{message: string}>('/checkAuthentication', {
        method: 'POST',
      });
      return response.message === 'Authenticated';
    } catch {
      return false;
    }
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse> {
    // Handle phone field conversion
    const updateData = { ...data };
    if (updateData.phone && typeof updateData.phone === 'string') {
      // Try to convert to number if it's a valid number string
      const phoneNum = parseInt(updateData.phone);
      if (!isNaN(phoneNum)) {
        updateData.phone = phoneNum;
      }
    }
    
    return this.request<ApiResponse>('/user/update', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async changePassword(data: {
    old_password: string;
    new_password: string;
  }): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string, password: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user/password-reset', {
      method: 'PUT',
      body: JSON.stringify({ email, password }),
    });
  }

  // Product APIs
  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>('/product/all', { method: 'GET' }, true);
  }

  async getProductById(id: string): Promise<Product> {
    return this.request<Product>(`/product/${id}`, { method: 'GET' }, true);
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<{ message: string; product: Product }> {
    return this.request<{ message: string; product: Product }>('/product', {
      method: 'POST',
      body: JSON.stringify(product),
    }, true);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<{ message: string; product_id: string }> {
    return this.request<{ message: string; product_id: string }>(`/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }, true);
  }

  async deleteProduct(id: string): Promise<{ message: string; product_id: string }> {
    return this.request<{ message: string; product_id: string }>(`/product/${id}`, {
      method: 'DELETE' }, true);
  }

  async searchProducts(params: { title?: string; category?: string; min_price?: number; max_price?: number }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params.title) query.append('title', params.title);
    if (params.category) query.append('category', params.category);
    if (params.min_price !== undefined) query.append('min_price', params.min_price.toString());
    if (params.max_price !== undefined) query.append('max_price', params.max_price.toString());
    return this.request<Product[]>(`/product/search?${query.toString()}`, { method: 'GET' }, true);
  }

  async advancedSearchProducts(params: {
    title?: string;
    category?: string;
    brand?: string;
    color?: string;
    size?: string;
    condition?: string;
    min_price?: number;
    max_price?: number;
    owner_id?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params.title) query.append('title', params.title);
    if (params.category) query.append('category', params.category);
    if (params.brand) query.append('brand', params.brand);
    if (params.color) query.append('color', params.color);
    if (params.size) query.append('size', params.size);
    if (params.condition) query.append('condition', params.condition);
    if (params.min_price !== undefined) query.append('min_price', params.min_price.toString());
    if (params.max_price !== undefined) query.append('max_price', params.max_price.toString());
    if (params.owner_id) query.append('owner_id', params.owner_id);
    return this.request<Product[]>(`/product/advanced-search?${query.toString()}`, { method: 'GET' }, true);
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    return this.request<Product[]>(`/product/user/${userId}`, { method: 'GET' }, true);
  }

  // Wishlist endpoints
  async addToWishlist(productId: string): Promise<{ message: string; wishlist_item: any }> {
    // First get user info from auth service
    const userInfo = await this.request<{user: {email: string}}>('/user/me', {
      method: 'GET',
    });
    
    // Then call product service with user email
    return this.request<{ message: string; wishlist_item: any }>(`/wishlist/add?product_id=${productId}&user_email=${userInfo.user.email}`, {
      method: 'POST',
    }, true);
  }

  async removeFromWishlist(productId: string): Promise<{ message: string }> {
    // First get user info from auth service
    const userInfo = await this.request<{user: {email: string}}>('/user/me', {
      method: 'GET',
    });
    
    // Then call product service with user email
    return this.request<{ message: string }>(`/wishlist/remove?product_id=${productId}&user_email=${userInfo.user.email}`, {
      method: 'DELETE',
    }, true);
  }

  async getWishlist(): Promise<any[]> {
    // First get user info from auth service
    const userInfo = await this.request<{user: {email: string}}>('/user/me', {
      method: 'GET',
    });
    
    // Then call product service with user email
    return this.request<any[]>(`/wishlist?user_email=${userInfo.user.email}`, {
      method: 'GET',
    }, true);
  }

  async checkWishlistStatus(productId: string): Promise<{ in_wishlist: boolean }> {
    // First get user info from auth service
    const userInfo = await this.request<{user: {email: string}}>('/user/me', {
      method: 'GET',
    });
    
    // Then call product service with user email
    return this.request<{ in_wishlist: boolean }>(`/wishlist/check/${productId}?user_email=${userInfo.user.email}`, {
      method: 'GET',
    }, true);
  }
}

export const apiService = new ApiService(); 