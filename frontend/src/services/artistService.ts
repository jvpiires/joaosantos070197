import apiClient from './apiClient';
import type { Artist, ArtistQueryParams, Pageable } from '../types/models';

const BASE_URL = '/api/v1/artists';

export const artistService = {
  getAll: async (params?: ArtistQueryParams): Promise<Pageable<Artist>> => {
    const response = await apiClient.get<Pageable<Artist>>(BASE_URL, {
      params: params
    });
    return response.data;
  },

  getById: async (id: number): Promise<Artist> => {
    const response = await apiClient.get<Artist>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: { name: string }): Promise<Artist> => {
    const response = await apiClient.post<Artist>(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: { name: string }): Promise<Artist> => {
    const response = await apiClient.put<Artist>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
