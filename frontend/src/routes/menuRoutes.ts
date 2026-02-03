import type { IconType } from 'react-icons';
import { FaCog, FaHeart } from 'react-icons/fa';
import { FaMusic } from 'react-icons/fa6';
import { FaCompactDisc } from 'react-icons/fa6';

export interface MenuRoute {
    path: string;
    label: string;
    icon: IconType;
    end?: boolean;
    roles?: string[];
    showInMenu?: boolean;
}

export const menuRoutes: MenuRoute[] = [
    {
        path: '/artists',
        label: 'Artistas',
        icon: FaMusic,
        roles: ['ADMIN', 'USER'],
        showInMenu: true
    },
    {   
        path: '/albums',
        label: 'Álbuns',
        icon: FaCompactDisc,
        roles: ['ADMIN', 'USER'],
        showInMenu: true
    },
    {
        path: '/favorites',
        label: 'Favoritos',
        icon: FaHeart,
        roles: ['ADMIN', 'USER'],
        showInMenu: true
    },
    {
        path: '/z_admin/users',
        label: 'Usuários',
        icon: FaCog,
        roles: ['ADMIN'],
        showInMenu: true
    },
    {
        path: '/z_admin/albums',
        label: 'Gerenciar Álbuns',
        icon: FaCompactDisc,
        roles: ['ADMIN'],
        showInMenu: true
    },
    {
        path: '/z_admin/new-album',
        label: 'Novo Álbum',
        icon: FaCompactDisc,
        roles: ['ADMIN'],
        showInMenu: true
    },
    {
        path: '/z_admin/regionais',
        label: 'Regionais',
        icon: FaCog,
        roles: ['ADMIN'],
        showInMenu: true
    }
];

