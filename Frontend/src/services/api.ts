const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

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
  _id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  location?: string;
  bio?: string;
  picture?: string;
  points?: number;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  user?: User;
  role?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
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
    return this.request<User>('/user/me', {
      method: 'GET',
    });
  }

  async checkAuth(): Promise<boolean> {
    try {
      await this.request('/checkAuthentication', {
        method: 'POST',
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse> {
    return this.request<ApiResponse>('/user/update', {
      method: 'PUT',
      body: JSON.stringify(data),
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
}

export const apiService = new ApiService(); 