import { Target, Eye, Award, Users, Building2, Calendar } from 'lucide-react';

function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>Leading the way in water treatment and environmental solutions</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                HYFROSYNC ENVIRO PVT. LTD. is a leading environmental services company
                specializing in comprehensive water treatment solutions, RO services,
                AC maintenance, and industrial water management systems.
              </p>
              <p>
                With years of experience in the industry, we have established ourselves
                as a trusted partner for residential, commercial, and industrial clients
                seeking reliable and efficient water and environmental solutions.
              </p>
              <p>
                Our team of certified professionals is committed to delivering exceptional
                service quality, using state-of-the-art technology and sustainable practices
                to ensure customer satisfaction.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card">
                <Users className="stat-icon" />
                <div className="stat-number">5000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-card">
                <Building2 className="stat-icon" />
                <div className="stat-number">200+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat-card">
                <Calendar className="stat-icon" />
                <div className="stat-number">10+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-card">
                <Award className="stat-icon" />
                <div className="stat-number">25+</div>
                <div className="stat-label">Certified Experts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-mission">
        <div className="container">
          <div className="vm-grid">
            <div className="vm-card">
              <div className="vm-icon">
                <Eye size={40} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be the most trusted and innovative environmental services company,
                setting industry benchmarks in water treatment and sustainability
                solutions across India and beyond.
              </p>
            </div>
            <div className="vm-card">
              <div className="vm-icon">
                <Target size={40} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide exceptional water treatment and environmental services
                through cutting-edge technology, skilled professionals, and
                customer-centric approaches, ensuring clean water and healthy
                environments for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Integrity</h3>
              <p>We uphold the highest ethical standards in all our dealings.</p>
            </div>
            <div className="value-card">
              <h3>Quality</h3>
              <p>We never compromise on the quality of our products and services.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We continuously adopt new technologies and methods.</p>
            </div>
            <div className="value-card">
              <h3>Sustainability</h3>
              <p>We are committed to environmentally responsible practices.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
