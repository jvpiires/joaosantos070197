import type { IconType } from 'react-icons';
import { FaCog } from 'react-icons/fa';
import { FaMusic } from 'react-icons/fa6';

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
        path: '/',
        label: 'Artistas',
        icon: FaMusic,
        end: true,
        roles: ['ADMIN', 'USER'],
        showInMenu: true
    },
    // { path: '/albuns', label: 'Álbuns', icon: FaCompactDisc, roles: ['ADMIN', 'USER'], showInMenu: true },
    {
        path: '/cadastro',
        label: 'Cadastro',
        icon: FaCog,
        roles: ['ADMIN'],
        showInMenu: false
    }
];
