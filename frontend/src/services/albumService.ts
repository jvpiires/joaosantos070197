import apiClient from './apiClient';
import type { Album, Pageable } from '../types/models';

const BASE_URL = '/api/v1/albums';

export const albumService = {
  getAll: async (params?: any): Promise<Pageable<Album>> => {
    const response = await apiClient.get<Pageable<Album>>(BASE_URL, {
      params: params
    });
    return response.data;
  },

  getById: async (id: number): Promise<Album> => {
    const response = await apiClient.get<Album>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: { title: string; artistId: number }): Promise<Album> => {
    const response = await apiClient.post<Album>(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: { title: string; artistId: number }): Promise<Album> => {
    const response = await apiClient.put<Album>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  }
};
