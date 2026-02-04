import apiClient from './apiClient';
import { type UserFavoriteDTO }from '../types/models';

export const favoriteService = {
  // Buscar favoritos do usuário
  getUserFavorites: async (userId: number): Promise<number[]> => {
    const response = await apiClient.get<UserFavoriteDTO[]>(`/api/v1/favorites/user/${userId}`);
    return response.data.map(favorite => favorite.albumId);
  },

  // Adicionar favorito
  addFavorite: async (userId: number, albumId: number): Promise<void> => {
    await apiClient.post(`/api/v1/favorites/${userId}/${albumId}`);
  },

  // Remover favorito
  removeFavorite: async (userId: number, albumId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/favorites/${userId}/${albumId}`);
  },

  // Verificar se é favorito
  isFavorite: async (userId: number, albumId: number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/api/v1/favorites/${userId}/${albumId}`);
    return response.data;
  }
};