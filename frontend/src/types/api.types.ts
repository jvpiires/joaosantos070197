export interface User {
  id: number;
  login: string;
  role: string;
}

export interface Regional {
  id: number;
  nome: string;
  ativo: boolean;
}

export interface AlbumNotification {
  albumId: number;
  title: string;
  artistName: string;
  createdAt: string;
}
