import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, CheckCircle, User, Building2, Mail, Phone, FileText, Calendar, IndianRupee } from 'lucide-react';
import { supabase } from '../utils/supabase';

function Quotation() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    email: '',
    phone: '',
    product_service: searchParams.get('service') || searchParams.get('product') || '',
    quantity: '',
    requirements: '',
    budget: '',
    timeline: '',
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
        .from('quotation_requests')
        .insert([formData]);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit quotation request. Please try again.');
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
            <h2>Quotation Request Submitted!</h2>
            <p>Thank you for your interest. Our team will get back to you within 24 hours with a detailed quotation.</p>
            <button onClick={() => setSubmitted(false)} className="btn btn-primary">
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quotation-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Request Quotation</h1>
          <p>Get a customized quote for your water treatment needs</p>
        </div>
      </section>

      {/* Form */}
      <section className="form-section">
        <div className="container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="quotation-form">
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
                  <label htmlFor="company_name">
                    <Building2 size={16} /> Company Name
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
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
                <label htmlFor="product_service">
                  <FileText size={16} /> Product/Service Required *
                </label>
                <input
                  type="text"
                  id="product_service"
                  name="product_service"
                  value={formData.product_service}
                  onChange={handleChange}
                  required
                  placeholder="e.g., RO Plant, Water Treatment Chemicals"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="budget">
                    <IndianRupee size={16} /> Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  >
                    <option value="">Select Budget</option>
                    <option value="Under 50,000">Under 50,000</option>
                    <option value="50,000 - 1 Lakh">50,000 - 1 Lakh</option>
                    <option value="1 Lakh - 5 Lakh">1 Lakh - 5 Lakh</option>
                    <option value="5 Lakh - 10 Lakh">5 Lakh - 10 Lakh</option>
                    <option value="Above 10 Lakh">Above 10 Lakh</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="timeline">
                  <Calendar size={16} /> Expected Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                >
                  <option value="">Select Timeline</option>
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3+ months">3+ months</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="requirements">Detailed Requirements</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Please describe your requirements in detail..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                <Send size={18} />
                {loading ? 'Submitting...' : 'Submit Quotation Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Quotation;
