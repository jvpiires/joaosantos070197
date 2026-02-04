import apiClient from './apiClient';

export interface StatsDTO {
  totalArtists: number;
  totalAlbums: number;
}

export const statsService = {
  getStats: async (): Promise<StatsDTO> => {
    const response = await apiClient.get<StatsDTO>('/api/v1/stats');
    return response.data;
  }
};
