import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../utils/supabase';

function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    featured_image: '',
    is_published: false,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (data) setBlogs(data);
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
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    if (editing) {
      await supabase.from('blogs').update(dataToSave).eq('id', editing);
    } else {
      await supabase.from('blogs').insert([dataToSave]);
    }

    resetForm();
    fetchBlogs();
  };

  const handleEdit = (blog) => {
    setEditing(blog.id);
    setFormData({
      ...blog,
      tags: (blog.tags || []).join(', '),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      await supabase.from('blogs').delete().eq('id', id);
      fetchBlogs();
    }
  };

  const togglePublish = async (blog) => {
    await supabase
      .from('blogs')
      .update({
        is_published: !blog.is_published,
        published_at: !blog.is_published ? new Date().toISOString() : blog.published_at
      })
      .eq('id', blog.id);
    fetchBlogs();
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      tags: '',
      featured_image: '',
      is_published: false,
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Manage Blog Posts</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={18} /> Add Post
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
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="2"
              />
            </div>
            <div className="form-group">
              <label>Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="water, treatment, RO"
                />
              </div>
              <div className="form-group">
                <label>Featured Image URL</label>
                <input
                  type="text"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                />
                Published
              </label>
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
              <th>Author</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>{blog.category}</td>
                <td>{blog.author}</td>
                <td>
                  <span className={`status-badge ${blog.is_published ? 'active' : 'inactive'}`}>
                    {blog.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => togglePublish(blog)} className="btn-icon" title={blog.is_published ? 'Unpublish' : 'Publish'}>
                    {blog.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => handleEdit(blog)} className="btn-icon">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="btn-icon danger">
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

export default AdminBlogs;
