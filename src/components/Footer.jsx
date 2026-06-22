import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, ExternalLink, Link2, Share2 } from 'lucide-react';
import { useSite } from '../context/SiteContext';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSite();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/products', label: 'Products' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const services = [
    { path: '/services#ro-service-amc', label: 'RO Service & AMC' },
    { path: '/services#ac-service-amc', label: 'AC Service & AMC' },
    { path: '/services#water-tank-cleaning', label: 'Water Tank Cleaning' },
    { path: '/services#water-testing-services', label: 'Water Testing' },
    { path: '/services#water-treatment-plants', label: 'Water Treatment Plants' },
    { path: '/services#industrial-water-solutions', label: 'Industrial Solutions' },
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-section company-info">
            <h3 className="footer-title">
              {settings.company_name || 'HYFROSYNC ENVIRO PVT. LTD.'}
            </h3>
            <p className="footer-tagline">{settings.company_tagline}</p>
            <p className="footer-description">
              Leading provider of water treatment solutions, RO services, and environmental services
              for residential, commercial, and industrial clients.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Our Services</h4>
            <ul className="footer-links">
              {services.map(service => (
                <li key={service.path}>
                  <Link to={service.path}>{service.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Us</h4>
            <div className="footer-contact">
              {settings.company_address && (
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>{settings.company_address}</span>
                </div>
              )}
              {settings.company_phone && (
                <a href={`tel:${settings.company_phone}`} className="contact-item">
                  <Phone size={16} />
                  <span>{settings.company_phone}</span>
                </a>
              )}
              {settings.company_email && (
                <a href={`mailto:${settings.company_email}`} className="contact-item">
                  <Mail size={16} />
                  <span>{settings.company_email}</span>
                </a>
              )}
            </div>
            <div className="social-links">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Globe size={20} />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <ExternalLink size={20} />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Link2 size={20} />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Share2 size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} {settings.company_name || 'HYFROSYNC ENVIRO PVT. LTD.'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
