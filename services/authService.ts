import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  message?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/authenticate', {
        email,
        password,
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<string> {
    try {
      const response = await api.post<string>('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      await api.get('/auth/validateToken');
      return true;
    } catch (error) {
      return false;
    }
  },
};
