import { useState } from 'react';
import { Send, CheckCircle, User, Mail, Phone, Briefcase, GraduationCap, FileText, Upload } from 'lucide-react';
import { supabase } from '../utils/supabase';

function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    qualification: '',
    cover_letter: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const positions = [
    'Service Engineer - RO/AC',
    'Water Treatment Plant Operator',
    'Sales Executive',
    'Customer Support Executive',
    'Project Manager',
    'Chemical Engineer',
    'Lab Technician',
    'Field Technician',
    'Other',
  ];

  const experienceLevels = [
    'Fresher',
    '1-2 years',
    '2-5 years',
    '5-10 years',
    '10+ years',
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
        .from('career_applications')
        .insert([formData]);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
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
            <h2>Application Submitted!</h2>
            <p>Thank you for your interest in joining our team. We will review your application and get back to you soon.</p>
            <button onClick={() => setSubmitted(false)} className="btn btn-primary">
              Apply for Another Position
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="careers-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Join Our Team</h1>
          <p>Build your career with HYFROSYNC ENVIRO</p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="why-join">
        <div className="container">
          <h2 className="section-title">Why Work With Us</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Competitive Salary</h3>
              <p>Industry-best compensation packages</p>
            </div>
            <div className="benefit-card">
              <h3>Learning & Growth</h3>
              <p>Continuous training and development programs</p>
            </div>
            <div className="benefit-card">
              <h3>Work-Life Balance</h3>
              <p>Flexible working hours and leave policies</p>
            </div>
            <div className="benefit-card">
              <h3>Health Benefits</h3>
              <p>Comprehensive medical insurance for employees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="form-section">
        <div className="container">
          <h2 className="section-title">Apply Now</h2>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="career-form">
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="position">
                    <Briefcase size={16} /> Position *
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="experience">
                    Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  >
                    <option value="">Select Experience</option>
                    {experienceLevels.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="qualification">
                  <GraduationCap size={16} /> Qualification
                </label>
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., B.Tech, M.Sc, Diploma"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cover_letter">
                  <FileText size={16} /> Cover Letter / About Yourself
                </label>
                <textarea
                  id="cover_letter"
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself and why you want to join..."
                />
              </div>

              <div className="form-note">
                <Upload size={16} />
                <p>Send your resume to <strong>careers@hyfrosyncenviro.com</strong> after submitting this form</p>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                <Send size={18} />
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Careers;
