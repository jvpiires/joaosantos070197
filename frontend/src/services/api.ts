import apiClient from './apiClient';

export const albumService = {

  getAllAlbums: async () => {
    const response = await apiClient.get('/albums');
    return response.data;
  },


  getAlbumById: async (id: number) => {
    const response = await apiClient.get(`/albums/${id}`);
    return response.data;
  },


  createAlbum: async (albumData: any) => {
    const response = await apiClient.post('/albums', albumData);
    return response.data;
  },


  updateAlbum: async (id: number, albumData: any) => {
    const response = await apiClient.put(`/albums/${id}`, albumData);
    return response.data;
  },


  deleteAlbum: async (id: number) => {
    const response = await apiClient.delete(`/albums/${id}`);
    return response.data;
  },
};

export const artistService = {
  getAllArtists: async () => {
    const response = await apiClient.get('/artists');
    return response.data;
  },

  getArtistById: async (id: number) => {
    const response = await apiClient.get(`/artists/${id}`);
    return response.data;
  },

  createArtist: async (artistData: any) => {
    const response = await apiClient.post('/artists', artistData);
    return response.data;
  },

  updateArtist: async (id: number, artistData: any) => {
    const response = await apiClient.put(`/artists/${id}`, artistData);
    return response.data;
  },

  deleteArtist: async (id: number) => {
    const response = await apiClient.delete(`/artists/${id}`);
    return response.data;
  },
};