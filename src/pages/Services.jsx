import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Wind, Database, FlaskConical, Beaker, Factory, Settings, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const iconMap = {
  droplets: Droplets,
  wind: Wind,
  tank: Database,
  'flask-conical': FlaskConical,
  beaker: Beaker,
  factory: Factory,
  settings: Settings,
};

function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (data) {
        setServices(data);
        const hash = window.location.hash.slice(1);
        if (hash) {
          const service = data.find(s => s.slug === hash);
          if (service) setSelectedService(service);
        }
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="services-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive water treatment and environmental solutions</p>
        </div>
      </section>

      {/* Services List */}
      <section className="services-list">
        <div className="container">
          <div className="services-detail-grid">
            {services.map(service => {
              const IconComponent = iconMap[service.icon] || Droplets;
              return (
                <div key={service.id} id={service.slug} className="service-detail-card">
                  <div className="service-detail-header">
                    <div className="service-detail-icon">
                      <IconComponent size={48} />
                    </div>
                    <div>
                      <h2>{service.title}</h2>
                      <p className="service-category">{service.category}</p>
                    </div>
                  </div>
                  <div className="service-detail-content">
                    <p>{service.description}</p>
                    {service.features && service.features.length > 0 && (
                      <div className="service-features">
                        <h4>Key Features:</h4>
                        <ul>
                          {service.features.map((feature, idx) => (
                            <li key={idx}>
                              <CheckCircle size={16} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="service-actions">
                      <Link to={`/service-booking?service=${service.slug}`} className="btn btn-primary">
                        Book Service
                      </Link>
                      <Link to={`/quotation?service=${service.slug}`} className="btn btn-outline">
                        Get Quote
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Need a Custom Solution?</h2>
          <p>Contact our experts for tailored water treatment solutions</p>
          <Link to="/contact" className="btn btn-primary">
            Contact Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Services;
