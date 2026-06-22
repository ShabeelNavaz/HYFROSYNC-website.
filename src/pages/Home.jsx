import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Wind, Database, FlaskConical, Beaker, Factory, Settings, ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useSite } from '../context/SiteContext';

const iconMap = {
  droplets: Droplets,
  wind: Wind,
  tank: Database,
  'flask-conical': FlaskConical,
  beaker: Beaker,
  factory: Factory,
  settings: Settings,
};

function Home() {
  const [services, setServices] = useState([]);
  const { settings } = useSite();

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (data) setServices(data);
    }
    fetchServices();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1>{settings.company_name || 'HYFROSYNC ENVIRO PVT. LTD.'}</h1>
          <p className="hero-tagline">{settings.company_tagline || 'Pure Water, Pure Life'}</p>
          <p className="hero-description">
            Your trusted partner for comprehensive water treatment solutions, RO services,
            AC maintenance, and industrial water management.
          </p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">
              Our Services <ArrowRight size={18} />
            </Link>
            <Link to="/quotation" className="btn btn-outline">
              Get Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <CheckCircle className="feature-icon" />
              <h3>Expert Team</h3>
              <p>Highly trained and certified professionals</p>
            </div>
            <div className="feature-card">
              <CheckCircle className="feature-icon" />
              <h3>Quality Service</h3>
              <p>Premium quality products and services</p>
            </div>
            <div className="feature-card">
              <CheckCircle className="feature-icon" />
              <h3>24/7 Support</h3>
              <p>Round the clock customer assistance</p>
            </div>
            <div className="feature-card">
              <CheckCircle className="feature-icon" />
              <h3>Affordable Pricing</h3>
              <p>Competitive rates with no hidden charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive water and environmental solutions for residential, commercial, and industrial needs
          </p>
          <div className="services-grid">
            {services.map(service => {
              const IconComponent = iconMap[service.icon] || Droplets;
              return (
                <div key={service.id} className="service-card">
                  <div className="service-icon">
                    <IconComponent size={40} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.short_description}</p>
                  <Link to={`/services#${service.slug}`} className="service-link">
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Need Our Services?</h2>
          <p>Get in touch with our experts for a free consultation and quote</p>
          <div className="cta-buttons">
            <Link to="/service-booking" className="btn btn-primary">
              Book a Service
            </Link>
            <a href={`tel:${settings.company_phone}`} className="btn btn-outline">
              <Phone size={18} /> Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="industries-section">
        <div className="container">
          <h2 className="section-title">Industries We Serve</h2>
          <div className="industries-grid">
            <div className="industry-item">Residential</div>
            <div className="industry-item">Commercial</div>
            <div className="industry-item">Industrial</div>
            <div className="industry-item">Healthcare</div>
            <div className="industry-item">Hospitality</div>
            <div className="industry-item">Education</div>
            <div className="industry-item">Manufacturing</div>
            <div className="industry-item">Pharmaceuticals</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
