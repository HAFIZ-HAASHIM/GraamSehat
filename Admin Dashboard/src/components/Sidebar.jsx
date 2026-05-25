/**
 * GraamSehat Admin Dashboard - Sidebar Navigation Component
 * Location: /src/components/Sidebar.jsx
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Search, 
  Users, 
  UserCheck, 
  AlertCircle, 
  Package, 
  FileSpreadsheet, 
  BookOpen, 
  Settings as SettingsIcon,
  Shield
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ mobileOpen, toggleSidebar }) {
  const { pendingApprovals, currentAdmin } = useAdmin();
  
  const navItems = [
    { path: '/overview', name: 'Overview', icon: LayoutDashboard },
    { path: '/map', name: 'Patient Map', icon: Map },
    { path: '/rankings', name: 'City Rankings', icon: TrendingUp },
    { path: '/search', name: 'Patient Search', icon: Search },
    { path: '/asha', name: 'ASHA Workers', icon: Users },
    { 
      path: '/approvals', 
      name: 'Approval Queue', 
      icon: UserCheck, 
      badge: pendingApprovals.length > 0 ? pendingApprovals.length : null 
    },
    { path: '/lost-found', name: 'Lost & Found', icon: AlertCircle },
    { path: '/medicine', name: 'Medicine Stock', icon: Package },
    { path: '/reports', name: 'Reports', icon: FileSpreadsheet },
    { path: '/content', name: 'Health Articles', icon: BookOpen },
    { path: '/settings', name: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Shield size={28} className="logo-icon" />
        <div className="logo-text">
          <span className="brand-main">GraamSehat</span>
          <span className="brand-sub">Admin Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 1024) toggleSidebar();
              }}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{item.name}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      {currentAdmin && (
        <div className="sidebar-footer">
          <div className="admin-avatar">
            {currentAdmin.name ? currentAdmin.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="admin-info">
            <div className="admin-name">{currentAdmin.name || 'System Admin'}</div>
            <div className="admin-email">{currentAdmin.email}</div>
          </div>
        </div>
      )}
    </aside>
  );
}
