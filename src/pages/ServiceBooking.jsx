import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, CheckCircle, User, Mail, Phone, MapPin, Calendar, Clock, FileText } from 'lucide-react';
import { supabase } from '../utils/supabase';

function ServiceBooking() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: searchParams.get('service') || '',
    address: '',
    city: '',
    pincode: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const serviceTypes = [
    'RO Service & AMC',
    'AC Service & AMC',
    'Water Tank Cleaning',
    'Water Testing Services',
    'Water Treatment Chemicals',
    'Water Treatment Plants',
    'Industrial Water Solutions',
    'Other',
  ];

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
        .from('service_requests')
        .insert([formData]);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit service request. Please try again.');
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
            <h2>Service Booked Successfully!</h2>
            <p>Thank you for booking our service. Our team will contact you shortly to confirm the appointment.</p>
            <button onClick={() => setSubmitted(false)} className="btn btn-primary">
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-booking-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Book a Service</h1>
          <p>Schedule your service appointment online</p>
        </div>
      </section>

      {/* Form */}
      <section className="form-section">
        <div className="container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="service-booking-form">
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
                    <Phone size={16} /> Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="service_type">
                  <FileText size={16} /> Service Type *
                </label>
                <select
                  id="service_type"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Service</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  <MapPin size={16} /> Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter your full address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    maxLength="6"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferred_date">
                    <Calendar size={16} /> Preferred Date
                  </label>
                  <input
                    type="date"
                    id="preferred_date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preferred_time">
                    <Clock size={16} /> Preferred Time
                  </label>
                  <select
                    id="preferred_time"
                    name="preferred_time"
                    value={formData.preferred_time}
                    onChange={handleChange}
                  >
                    <option value="">Select Time</option>
                    <option value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</option>
                    <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                    <option value="Evening (4PM - 7PM)">Evening (4PM - 7PM)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Additional Notes</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any specific requirements or notes..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                <Send size={18} />
                {loading ? 'Booking...' : 'Book Service'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceBooking;
