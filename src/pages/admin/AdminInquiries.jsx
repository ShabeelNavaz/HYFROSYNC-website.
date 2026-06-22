import { useState, useEffect } from 'react';
import { Download, Eye, Mail, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../utils/supabase';

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const { data } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setInquiries(data);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('contact_inquiries').update({ status }).eq('id', id);
    fetchInquiries();
    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
  };

  const exportToExcel = () => {
    const exportData = filteredInquiries.map(i => ({
      'Name': i.name,
      'Email': i.email || '',
      'Phone': i.phone || '',
      'Subject': i.subject || '',
      'Message': i.message,
      'Status': i.status,
      'Created At': new Date(i.created_at).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inquiries');
    XLSX.writeFile(wb, `contact_inquiries_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredInquiries = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

  const statusColors = {
    unread: 'warning',
    read: 'info',
    replied: 'success',
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Contact Inquiries</h1>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
          <button onClick={exportToExcel} className="btn btn-outline">
            <Download size={18} /> Export Excel
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map(inquiry => (
              <tr key={inquiry.id} className={inquiry.status === 'unread' ? 'highlight-row' : ''}>
                <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
                <td>{inquiry.name}</td>
                <td>{inquiry.email || '-'}</td>
                <td>{inquiry.phone || '-'}</td>
                <td>{inquiry.subject || '-'}</td>
                <td>
                  <span className={`status-badge ${statusColors[inquiry.status] || 'default'}`}>
                    {inquiry.status}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => {
                    setSelectedInquiry(inquiry);
                    if (inquiry.status === 'unread') {
                      updateStatus(inquiry.id, 'read');
                    }
                  }} className="btn-icon">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div><strong>Name:</strong> {selectedInquiry.name}</div>
                <div><strong>Email:</strong> <a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email || 'N/A'}</a></div>
                <div><strong>Phone:</strong> <a href={`tel:${selectedInquiry.phone}`}>{selectedInquiry.phone || 'N/A'}</a></div>
                <div><strong>Subject:</strong> {selectedInquiry.subject || 'N/A'}</div>
                <div className="full-width"><strong>Message:</strong>
                  <p className="message-text">{selectedInquiry.message}</p>
                </div>
              </div>
              <div className="status-actions">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || 'Your Inquiry'}`}
                  className="btn btn-sm btn-primary"
                  onClick={() => updateStatus(selectedInquiry.id, 'replied')}
                >
                  <Mail size={16} /> Reply via Email
                </a>
                <button
                  onClick={() => updateStatus(selectedInquiry.id, 'replied')}
                  className="btn btn-sm btn-outline"
                >
                  <CheckCircle size={16} /> Mark as Replied
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInquiries;
