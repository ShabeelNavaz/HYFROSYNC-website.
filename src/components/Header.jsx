import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useSite } from '../context/SiteContext';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSite();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/products', label: 'Products' },
    { path: '/quotation', label: 'Get Quote' },
    { path: '/service-booking', label: 'Book Service' },
    { path: '/blog', label: 'Blog' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-contact">
            {settings.company_phone && (
              <a href={`tel:${settings.company_phone}`} className="top-bar-link">
                <Phone size={14} />
                <span>{settings.company_phone}</span>
              </a>
            )}
            {settings.company_email && (
              <a href={`mailto:${settings.company_email}`} className="top-bar-link">
                <Mail size={14} />
                <span>{settings.company_email}</span>
              </a>
            )}
          </div>
        </div>
      </div>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="logo">
            <span className="logo-text">HYFROSYNC</span>
            <span className="logo-sub">ENVIRO PVT. LTD.</span>
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/admin"
              className="nav-link admin-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
