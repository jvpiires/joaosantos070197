import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaMusic, FaCompactDisc, FaCog, FaSignOutAlt } from 'react-icons/fa';

interface DashboardLayoutProps {
    title: string;
    userName?: string | null;
    userRole?: string | null;
    onLogout: () => void;
    children: React.ReactNode;
}

const menuItems = [
    { to: '/', label: 'Artistas', icon: <FaMusic className="menu-icon" />, end: true },
    { to: '/albuns', label: 'Álbuns', icon: <FaCompactDisc className="menu-icon" /> },
    { to: '/settings', label: 'Configurações', icon: <FaCog className="menu-icon" /> }
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    title,
    userName,
    userRole,
    onLogout,
    children
}) => {
    const initials = userName?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <FaMusic color="#3b82f6" />
                        <span>MusicApp</span>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-btn">
                        <FaSignOutAlt />
                        <span>Sair da Conta</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div className="page-title">
                        <h1>{title}</h1>
                    </div>

                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">{userName || 'Usuário'}</span>
                            <span className="user-role">{userRole || 'USER'}</span>
                        </div>
                        <div className="user-avatar">{initials}</div>
                    </div>
                </header>

                <div className="content-scroll">{children}</div>
            </main>
        </div>
    );
};
