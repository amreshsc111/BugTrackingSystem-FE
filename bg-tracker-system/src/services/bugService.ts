import apiClient from './apiClient';
import type { Bug } from '../types';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const bugService = {
  getBugs: async (params?: any): Promise<Bug[]> => {
    const response = await apiClient.get<Bug[]>(API_ENDPOINTS.BUGS.LIST, { params });
    return response.data;
  },

  getMyBugs: async (): Promise<Bug[]> => {
    const response = await apiClient.get<Bug[]>(API_ENDPOINTS.BUGS.MY_BUGS);
    return response.data;
  },

  createBug: async (formData: FormData): Promise<{ bugId: string }> => {
    const response = await apiClient.post<{ bugId: string }>(API_ENDPOINTS.BUGS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  assignBug: async (id: string): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.BUGS.ASSIGN(id), {});
  },

  updateStatus: async (id: string, status: number): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.BUGS.STATUS(id), { status });
  },
};
