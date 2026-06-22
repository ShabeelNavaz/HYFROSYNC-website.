import { useState, useEffect } from 'react';
import { Download, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../utils/supabase';

function AdminQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    const { data } = await supabase
      .from('quotation_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setQuotations(data);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('quotation_requests').update({ status }).eq('id', id);
    fetchQuotations();
    if (selectedQuote?.id === id) {
      setSelectedQuote({ ...selectedQuote, status });
    }
  };

  const exportToExcel = () => {
    const exportData = filteredQuotations.map(q => ({
      'Name': q.name,
      'Company': q.company_name || '',
      'Email': q.email,
      'Phone': q.phone,
      'Product/Service': q.product_service,
      'Quantity': q.quantity || '',
      'Budget': q.budget || '',
      'Timeline': q.timeline || '',
      'Requirements': q.requirements || '',
      'Status': q.status,
      'Created At': new Date(q.created_at).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quotations');
    XLSX.writeFile(wb, `quotation_requests_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredQuotations = filter === 'all' ? quotations : quotations.filter(q => q.status === filter);

  const statusColors = {
    pending: 'warning',
    contacted: 'info',
    quoted: 'success',
    converted: 'success',
    closed: 'danger',
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Quotation Requests</h1>
        <div className="header-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
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
              <th>Company</th>
              <th>Phone</th>
              <th>Product/Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.map(quote => (
              <tr key={quote.id}>
                <td>{new Date(quote.created_at).toLocaleDateString()}</td>
                <td>{quote.name}</td>
                <td>{quote.company || '-'}</td>
                <td>{quote.phone}</td>
                <td>{quote.product_service}</td>
                <td>
                  <span className={`status-badge ${statusColors[quote.status] || 'default'}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => setSelectedQuote(quote)} className="btn-icon">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedQuote && (
        <div className="modal-overlay" onClick={() => setSelectedQuote(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Quotation Details</h2>
              <button onClick={() => setSelectedQuote(null)} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div><strong>Name:</strong> {selectedQuote.name}</div>
                <div><strong>Company:</strong> {selectedQuote.company_name || 'N/A'}</div>
                <div><strong>Email:</strong> <a href={`mailto:${selectedQuote.email}`}>{selectedQuote.email}</a></div>
                <div><strong>Phone:</strong> <a href={`tel:${selectedQuote.phone}`}>{selectedQuote.phone}</a></div>
                <div><strong>Product/Service:</strong> {selectedQuote.product_service}</div>
                <div><strong>Quantity:</strong> {selectedQuote.quantity || 'N/A'}</div>
                <div><strong>Budget:</strong> {selectedQuote.budget || 'N/A'}</div>
                <div><strong>Timeline:</strong> {selectedQuote.timeline || 'N/A'}</div>
                <div className="full-width"><strong>Requirements:</strong> {selectedQuote.requirements || 'N/A'}</div>
              </div>
              <div className="status-actions">
                <select
                  value={selectedQuote.status}
                  onChange={(e) => updateStatus(selectedQuote.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminQuotations;
