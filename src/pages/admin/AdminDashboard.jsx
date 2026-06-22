import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Package,
  FileText,
  Users,
  Briefcase,
  MessageSquare,
  FileQuestion,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    services: 0,
    products: 0,
    blogs: 0,
    serviceRequests: 0,
    quotationRequests: 0,
    careerApplications: 0,
    contactInquiries: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [services, products, blogs, serviceRequests, quotationRequests, careerApplications, contactInquiries] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('service_requests').select('id', { count: 'exact', head: true }),
        supabase.from('quotation_requests').select('id', { count: 'exact', head: true }),
        supabase.from('career_applications').select('id', { count: 'exact', head: true }),
        supabase.from('contact_inquiries').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        services: services.count || 0,
        products: products.count || 0,
        blogs: blogs.count || 0,
        serviceRequests: serviceRequests.count || 0,
        quotationRequests: quotationRequests.count || 0,
        careerApplications: careerApplications.count || 0,
        contactInquiries: contactInquiries.count || 0,
      });
    }

    import('../../utils/supabase').then(({ supabase }) => {
      fetchStats();
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/services', icon: Settings, label: 'Services' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/blogs', icon: FileText, label: 'Blogs' },
    { path: '/admin/service-requests', icon: FileQuestion, label: 'Service Requests' },
    { path: '/admin/quotations', icon: FileQuestion, label: 'Quotations' },
    { path: '/admin/careers', icon: Briefcase, label: 'Job Applications' },
    { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>HEFROSYNC</h2>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="admin-user">
            <span>{user?.name || 'Admin'}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet context={{ stats }} />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
