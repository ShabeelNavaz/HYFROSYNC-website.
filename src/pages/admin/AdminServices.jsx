import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../utils/supabase';

function AdminServices() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    category: '',
    icon: '',
    features: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('display_order');
    if (data) setServices(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      features: formData.features.split('\n').filter(f => f.trim()),
    };

    if (editing) {
      await supabase.from('services').update(dataToSave).eq('id', editing);
    } else {
      await supabase.from('services').insert([dataToSave]);
    }

    resetForm();
    fetchServices();
  };

  const handleEdit = (service) => {
    setEditing(service.id);
    setFormData({
      ...service,
      features: (service.features || []).join('\n'),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({
      title: '',
      slug: '',
      description: '',
      short_description: '',
      category: '',
      icon: '',
      features: '',
      is_active: true,
      display_order: 0,
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Manage Services</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={() => !formData.slug && setFormData(prev => ({
                    ...prev,
                    slug: generateSlug(prev.title)
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Icon</label>
                <select name="icon" value={formData.icon} onChange={handleChange}>
                  <option value="">Select Icon</option>
                  <option value="droplets">Droplets</option>
                  <option value="wind">Wind</option>
                  <option value="tank">Tank</option>
                  <option value="flask-conical">Flask</option>
                  <option value="beaker">Beaker</option>
                  <option value="factory">Factory</option>
                  <option value="settings">Settings</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Short Description</label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Features (one per line)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows="4"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <Save size={18} /> {editing ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-outline">
                <X size={18} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.title}</td>
                <td>{service.category}</td>
                <td>
                  <span className={`status-badge ${service.is_active ? 'active' : 'inactive'}`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{service.display_order}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(service)} className="btn-icon">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="btn-icon danger">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminServices;
