import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  IoGridOutline,
  IoCalendarOutline,
  IoListOutline,
  IoPersonOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoBarChartOutline,
  IoTimeOutline
} from 'react-icons/io5';

const Sidebar = ({ collapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Filter links by user role
  const menuItems = user.role === 'admin' 
    ? [
        { path: '/admin', label: 'Admin Dashboard', icon: IoGridOutline },
        { path: '/employees', label: 'Employees', icon: IoPeopleOutline },
        { path: '/leave-requests', label: 'Leave Requests', icon: IoCalendarOutline },
        { path: '/reports', label: 'Reports', icon: IoBarChartOutline },
        { path: '/profile', label: 'Profile', icon: IoPersonOutline }
      ]
    : [
        { path: '/dashboard', label: 'Dashboard', icon: IoGridOutline },
        { path: '/apply-leave', label: 'Apply Leave', icon: IoCalendarOutline },
        { path: '/my-leaves', label: 'My Leaves', icon: IoListOutline },
        { path: '/leave-history', label: 'Leave History', icon: IoTimeOutline },
        { path: '/profile', label: 'Profile', icon: IoPersonOutline }
      ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 'var(--navbar-height)',
        left: 0,
        bottom: 0,
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        zIndex: 99,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderRight: '1px solid var(--glass-border)',
        transition: 'width var(--transition-normal)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0.75rem',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}
      className="glass-scroll"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={idx}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? '0' : '0.85rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: '0.85rem 1rem',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={20} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.8 }} />
              {!collapsed && (
                <span 
                  style={{ 
                    whiteSpace: 'nowrap',
                    opacity: 1,
                    transition: 'opacity var(--transition-fast)'
                  }}
                >
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
