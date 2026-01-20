import apiClient from './apiClient';

export const albumService = {
  // Listar todos os álbuns
  getAllAlbums: async () => {
    const response = await apiClient.get('/albums');
    return response.data;
  },

  // Buscar álbum por ID
  getAlbumById: async (id: number) => {
    const response = await apiClient.get(`/albums/${id}`);
    return response.data;
  },

  // Criar novo álbum
  createAlbum: async (albumData: any) => {
    const response = await apiClient.post('/albums', albumData);
    return response.data;
  },

  // Atualizar álbum
  updateAlbum: async (id: number, albumData: any) => {
    const response = await apiClient.put(`/albums/${id}`, albumData);
    return response.data;
  },

  // Deletar álbum
  deleteAlbum: async (id: number) => {
    const response = await apiClient.delete(`/albums/${id}`);
    return response.data;
  },
};

export const artistService = {
  // Listar todos os artistas
  getAllArtists: async () => {
    const response = await apiClient.get('/artists');
    return response.data;
  },

  // Buscar artista por ID
  getArtistById: async (id: number) => {
    const response = await apiClient.get(`/artists/${id}`);
    return response.data;
  },

  // Criar novo artista
  createArtist: async (artistData: any) => {
    const response = await apiClient.post('/artists', artistData);
    return response.data;
  },

  // Atualizar artista
  updateArtist: async (id: number, artistData: any) => {
    const response = await apiClient.put(`/artists/${id}`, artistData);
    return response.data;
  },

  // Deletar artista
  deleteArtist: async (id: number) => {
    const response = await apiClient.delete(`/artists/${id}`);
    return response.data;
  },
};