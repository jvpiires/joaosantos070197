import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('../pages/home/HomePage', () => ({
    HomePage: () => <div>Home Page</div>,
}));

vi.mock('../pages/admin/UsersPage', () => ({
    UsersPage: () => <div>Users Page</div>,
}));

vi.mock('../pages/admin/RegionaisPage', () => ({
    RegionaisPage: () => <div>Regionais Page</div>,
}));

vi.mock('../pages/artists/ArtistsPage', () => ({
    ArtistsPage: () => <div>Artists Page</div>,
}));

vi.mock('../pages/albums/AlbumsPage', () => ({
    AlbumsPage: () => <div>Albums Page</div>,
}));

vi.mock('../pages/favorites/FavoritesPage', () => ({
    FavoritesPage: () => <div>Favorites Page</div>,
}));

describe('App routes', () => {
    it('renders artists page for /artists', () => {
        render(
            <MemoryRouter initialEntries={['/artists']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText('Artists Page')).toBeInTheDocument();
    });

    it('redirects unknown routes to home', () => {
        render(
            <MemoryRouter initialEntries={['/unknown']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
});