import { useState, useEffect } from 'react';
import { Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../utils/supabase';

function AdminCareers() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('career_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setApplications(data);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('career_applications').update({ status }).eq('id', id);
    fetchApplications();
    if (selectedApp?.id === id) {
      setSelectedApp({ ...selectedApp, status });
    }
  };

  const exportToExcel = () => {
    const exportData = filteredApps.map(a => ({
      'Name': a.name,
      'Email': a.email,
      'Phone': a.phone,
      'Position': a.position,
      'Experience': a.experience || '',
      'Qualification': a.qualification || '',
      'Cover Letter': a.cover_letter || '',
      'Status': a.status,
      'Applied On': new Date(a.created_at).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');
    XLSX.writeFile(wb, `career_applications_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredApps = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const statusColors = {
    pending: 'warning',
    reviewed: 'info',
    shortlisted: 'success',
    rejected: 'danger',
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Job Applications</h1>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
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
              <th>Position</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <tr key={app.id}>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                <td>{app.name}</td>
                <td>{app.position}</td>
                <td>{app.phone}</td>
                <td>{app.experience || '-'}</td>
                <td>
                  <span className={`status-badge ${statusColors[app.status] || 'default'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => setSelectedApp(app)} className="btn-icon">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div><strong>Name:</strong> {selectedApp.name}</div>
                <div><strong>Email:</strong> <a href={`mailto:${selectedApp.email}`}>{selectedApp.email}</a></div>
                <div><strong>Phone:</strong> <a href={`tel:${selectedApp.phone}`}>{selectedApp.phone}</a></div>
                <div><strong>Position:</strong> {selectedApp.position}</div>
                <div><strong>Experience:</strong> {selectedApp.experience || 'N/A'}</div>
                <div><strong>Qualification:</strong> {selectedApp.qualification || 'N/A'}</div>
                <div className="full-width"><strong>Cover Letter:</strong>
                  <p className="cover-letter">{selectedApp.cover_letter || 'N/A'}</p>
                </div>
              </div>
              <div className="status-actions">
                <button
                  onClick={() => updateStatus(selectedApp.id, 'reviewed')}
                  className="btn btn-sm btn-outline"
                >
                  Reviewed
                </button>
                <button
                  onClick={() => updateStatus(selectedApp.id, 'shortlisted')}
                  className="btn btn-sm btn-primary"
                >
                  <CheckCircle size={16} /> Shortlist
                </button>
                <button
                  onClick={() => updateStatus(selectedApp.id, 'rejected')}
                  className="btn btn-sm btn-danger"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCareers;
