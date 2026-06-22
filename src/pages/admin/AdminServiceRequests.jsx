import { useState, useEffect } from 'react';
import { Download, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../utils/supabase';

function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setRequests(data);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('service_requests').update({ status }).eq('id', id);
    fetchRequests();
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status });
    }
  };

  const exportToExcel = () => {
    const exportData = filteredRequests.map(r => ({
      'Name': r.name,
      'Email': r.email || '',
      'Phone': r.phone,
      'Service Type': r.service_type,
      'Address': r.address,
      'City': r.city,
      'Pincode': r.pincode,
      'Preferred Date': r.preferred_date || '',
      'Preferred Time': r.preferred_time || '',
      'Message': r.message || '',
      'Status': r.status,
      'Created At': new Date(r.created_at).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Service Requests');
    XLSX.writeFile(wb, `service_requests_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    completed: 'success',
    cancelled: 'danger',
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Service Requests</h1>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
              <th>Phone</th>
              <th>Service</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.id}>
                <td>{new Date(request.created_at).toLocaleDateString()}</td>
                <td>{request.name}</td>
                <td>{request.phone}</td>
                <td>{request.service_type}</td>
                <td>{request.city}</td>
                <td>
                  <span className={`status-badge ${statusColors[request.status] || 'default'}`}>
                    {request.status}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => setSelectedRequest(request)} className="btn-icon">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Service Request Details</h2>
              <button onClick={() => setSelectedRequest(null)} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div><strong>Name:</strong> {selectedRequest.name}</div>
                <div><strong>Phone:</strong> {selectedRequest.phone}</div>
                <div><strong>Email:</strong> {selectedRequest.email || 'N/A'}</div>
                <div><strong>Service:</strong> {selectedRequest.service_type}</div>
                <div><strong>Address:</strong> {selectedRequest.address}</div>
                <div><strong>City:</strong> {selectedRequest.city}</div>
                <div><strong>Pincode:</strong> {selectedRequest.pincode}</div>
                <div><strong>Preferred Date:</strong> {selectedRequest.preferred_date || 'N/A'}</div>
                <div><strong>Preferred Time:</strong> {selectedRequest.preferred_time || 'N/A'}</div>
                <div className="full-width"><strong>Message:</strong> {selectedRequest.message || 'N/A'}</div>
              </div>
              <div className="status-actions">
                <button
                  onClick={() => updateStatus(selectedRequest.id, 'confirmed')}
                  className={`btn btn-sm ${selectedRequest.status === 'confirmed' ? 'btn-primary' : 'btn-outline'}`}
                >
                  <CheckCircle size={16} /> Confirm
                </button>
                <button
                  onClick={() => updateStatus(selectedRequest.id, 'completed')}
                  className={`btn btn-sm ${selectedRequest.status === 'completed' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Complete
                </button>
                <button
                  onClick={() => updateStatus(selectedRequest.id, 'cancelled')}
                  className={`btn btn-sm ${selectedRequest.status === 'cancelled' ? 'btn-danger' : 'btn-outline'}`}
                >
                  <XCircle size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServiceRequests;
