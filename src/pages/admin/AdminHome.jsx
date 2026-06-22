import { useOutletContext } from 'react-router-dom';
import { Settings, Package, FileText, FileQuestion, Briefcase, MessageSquare, TrendingUp } from 'lucide-react';

function AdminHome() {
  const { stats } = useOutletContext();

  const statCards = [
    { key: 'services', icon: Settings, label: 'Services', color: '#2563eb' },
    { key: 'products', icon: Package, label: 'Products', color: '#059669' },
    { key: 'blogs', icon: FileText, label: 'Blog Posts', color: '#7c3aed' },
    { key: 'serviceRequests', icon: FileQuestion, label: 'Service Requests', color: '#dc2626' },
    { key: 'quotationRequests', icon: FileQuestion, label: 'Quotation Requests', color: '#ea580c' },
    { key: 'careerApplications', icon: Briefcase, label: 'Job Applications', color: '#0891b2' },
    { key: 'contactInquiries', icon: MessageSquare, label: 'Contact Inquiries', color: '#ca8a04' },
  ];

  return (
    <div className="admin-home">
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        {statCards.map(card => (
          <div key={card.key} className="stat-card-admin">
            <div className="stat-icon-admin" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats[card.key] || 0}</span>
              <span className="stat-label-admin">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h2><TrendingUp size={20} /> Quick Actions</h2>
        <div className="quick-actions">
          <a href="/admin/services" className="quick-action">Add New Service</a>
          <a href="/admin/products" className="quick-action">Add New Product</a>
          <a href="/admin/blogs" className="quick-action">Write Blog Post</a>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
