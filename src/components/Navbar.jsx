import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Play, BookOpen, Layers, FileCode, Info, Sun, Moon, Menu, X, Code2 } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: ShieldCheck },
    { to: '/playground', label: 'Playground', icon: Play, badge: 'IDE' },
    { to: '/learn', label: 'Learn', icon: BookOpen },
    { to: '/examples', label: 'Examples', icon: Layers },
    { to: '/reference', label: 'Language Ref', icon: FileCode },
    { to: '/about', label: 'About', icon: Info }
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <NavLink to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-wrapper">
            <ShieldCheck className="logo-icon" size={24} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">TypeGuard</span>
            <span className="brand-subtitle">Write. Analyze. Understand.</span>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* GitHub Link Placeholder */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <Code2 size={18} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-list">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
