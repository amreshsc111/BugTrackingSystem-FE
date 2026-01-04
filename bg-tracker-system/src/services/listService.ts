import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export interface Role {
  id: number;
  name: string;
}

export interface SeverityLevel {
  id: number;
  name: string;
}

export interface Developer {
  id: string;
  name: string;
}

export interface BugStatusInfo {
  id: number;
  name: string;
}

export const listService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>(API_ENDPOINTS.LISTS.ROLES);
    return response.data;
  },

  getSeverityLevels: async (): Promise<SeverityLevel[]> => {
    const response = await apiClient.get<SeverityLevel[]>(API_ENDPOINTS.LISTS.SEVERITY_LEVELS);
    return response.data;
  },

  getDevelopers: async (): Promise<Developer[]> => {
    const response = await apiClient.get<Developer[]>(API_ENDPOINTS.LISTS.DEVELOPERS);
    return response.data;
  },
  
  getBugStatuses: async (): Promise<BugStatusInfo[]> => {
    const response = await apiClient.get<BugStatusInfo[]>(API_ENDPOINTS.LISTS.STATUSES);
    return response.data;
  },
};
