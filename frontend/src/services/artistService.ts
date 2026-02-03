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

  create: async (data: { 
    name: string; 
    year?: number; 
    image?: File | null; 
    albumIds?: number[] 
  }): Promise<Artist> => {
    const formData = new FormData();
    
    // Criar objeto JSON com os dados do artista
    const artistData = {
      name: data.name,
      year: data.year || null,
      albumIds: data.albumIds || []
    };
    
    // Adicionar JSON como string
    formData.append('data', JSON.stringify(artistData));
    
    // Adicionar imagem se fornecida
    if (data.image) {
      formData.append('image', data.image);
    }
    
    const response = await apiClient.post<Artist>(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
