import { useState } from 'react';
import { Send, CheckCircle, User, Mail, Phone, MessageSquare, MapPin, Clock } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useSite } from '../context/SiteContext';

function Contact() {
  const { settings } = useSite();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('contact_inquiries')
        .insert([formData]);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-success-page">
        <div className="container">
          <div className="success-card">
            <CheckCircle size={64} />
            <h2>Message Sent!</h2>
            <p>Thank you for contacting us. We will get back to you shortly.</p>
            <button onClick={() => setSubmitted(false)} className="btn btn-primary">
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We are here to help you</p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>Have questions? We would love to hear from you.</p>

              <div className="contact-details">
                {settings.company_address && (
                  <div className="contact-detail-item">
                    <MapPin size={24} />
                    <div>
                      <h4>Address</h4>
                      <p>{settings.company_address}</p>
                    </div>
                  </div>
                )}
                {settings.company_phone && (
                  <div className="contact-detail-item">
                    <Phone size={24} />
                    <div>
                      <h4>Phone</h4>
                      <a href={`tel:${settings.company_phone}`}>{settings.company_phone}</a>
                    </div>
                  </div>
                )}
                {settings.company_email && (
                  <div className="contact-detail-item">
                    <Mail size={24} />
                    <div>
                      <h4>Email</h4>
                      <a href={`mailto:${settings.company_email}`}>{settings.company_email}</a>
                    </div>
                  </div>
                )}
                <div className="contact-detail-item">
                  <Clock size={24} />
                  <div>
                    <h4>Business Hours</h4>
                    <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                {error && <p className="error-message">{error}</p>}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      <User size={16} /> Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      <Phone size={16} /> Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} /> Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    <MessageSquare size={16} /> Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your inquiry about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Write your message here..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  <Send size={18} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      {settings.google_maps_embed && (
        <section className="map-section">
          <div className="container">
            <div className="map-wrapper">
              <iframe
                src={settings.google_maps_embed}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Company Location"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Contact;
