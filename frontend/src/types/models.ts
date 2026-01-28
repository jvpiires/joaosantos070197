export interface Pageable<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; 
  sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Artist {
  id: number;
  name: string;
}

export interface Album {
  id: number;
  title: string;
  artistId: number;
  artistName?: string;
  images: AlbumImage[];
}

export interface AlbumImage {
  id: number;
  url: string;
  fileName: string;
}

// Params para filtros
export interface ArtistQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  name?: string;
}
