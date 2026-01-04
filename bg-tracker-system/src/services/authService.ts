import apiClient from './apiClient';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ userId: string }> => {
    const response = await apiClient.post<{ userId: string }>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },

  refreshToken: async (token: string, refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { token, refreshToken });
    return response.data;
  },
};
