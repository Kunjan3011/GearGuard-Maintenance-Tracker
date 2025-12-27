import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, Users, ClipboardList, Calendar, BarChart2, LogOut, Settings, User, Factory, Tags } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allMenuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'manager', 'technician', 'employee'] },
        { name: 'Maintenance Requests', icon: ClipboardList, path: '/kanban', roles: ['admin', 'manager', 'technician', 'employee'] },
        { name: 'Calendar', icon: Calendar, path: '/calendar', roles: ['admin', 'manager', 'technician'] },
        { name: 'Equipment', icon: Box, path: '/equipment', roles: ['admin', 'manager', 'technician', 'employee'] },
        { name: 'Categories', icon: Tags, path: '/equipment-categories', roles: ['admin', 'manager', 'technician'] },
        { name: 'Work Centers', icon: Factory, path: '/work-centers', roles: ['admin', 'manager'] },
        { name: 'Reporting', icon: BarChart2, path: '/reporting', roles: ['admin', 'manager'] },
        { name: 'Teams', icon: Users, path: '/teams', roles: ['admin'] },
    ];

    const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.role));

    // Logic for Breadcrumbs
    const pathParts = location.pathname.split('/').filter(x => x);
    const currentTitle = menuItems.find(item => item.path === `/${pathParts[0]}`)?.name || 'Dashboard';

    return (
        <>
            <header className="navbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '100%' }}>
                    <div className="logo" style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', paddingRight: '2rem', fontFamily: 'Outfit', letterSpacing: '-0.03em' }}>
                        GearGuard<span style={{ color: 'var(--color-accent)' }}>.</span>
                    </div>
                    <nav style={{ display: 'flex', height: '100%' }}>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.icon && <item.icon size={18} />} {item.nameDisplay ? item.nameDisplay.toUpperCase() : item.name.toUpperCase()}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                    <button
                        className="btn-link"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}
                    >
                        <span style={{ fontSize: '13px', opacity: 0.9 }}>{user?.username}</span>
                        <img
                            src={`https://i.pravatar.cc/150?u=${user?.username}`}
                            alt="Admin"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-sm)' }}
                        />
                    </button>

                    {showProfileMenu && (
                        <div className="card animate-fade-in" style={{ position: 'absolute', top: '120%', right: 0, width: '200px', zIndex: 1000, padding: '0.5rem', boxShadow: 'var(--shadow-lg)' }}>
                            <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                                <p style={{ fontWeight: 700, fontSize: '14px' }}>{user?.username}</p>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
                            </div>
                            <button className="btn-link" style={{ width: '100%', textAlign: 'left', padding: '0.6rem', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <User size={14} /> My Profile
                            </button>
                            <button className="btn-link" style={{ width: '100%', textAlign: 'left', padding: '0.6rem', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <Settings size={14} /> Settings
                            </button>
                            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.5rem 0' }}></div>
                            <button
                                className="btn-link"
                                onClick={handleLogout}
                                style={{ width: '100%', textAlign: 'left', padding: '0.6rem', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--color-scrap)' }}
                            >
                                <LogOut size={14} /> Log Out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="subnavbar">
                <div className="breadcrumb">
                    <span className="breadcrumb-item" style={{ color: 'var(--color-text-muted)' }}>Maintenance</span>
                    {pathParts.length > 0 && <span className="breadcrumb-item">{currentTitle}</span>}
                    {pathParts.length === 0 && <span className="breadcrumb-item">Dashboard</span>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                        <BarChart2 size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
