import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Quotation from './pages/Quotation';
import ServiceBooking from './pages/ServiceBooking';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminServices from './pages/admin/AdminServices';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminServiceRequests from './pages/admin/AdminServiceRequests';
import AdminQuotations from './pages/admin/AdminQuotations';
import AdminCareers from './pages/admin/AdminCareers';
import AdminInquiries from './pages/admin/AdminInquiries';
import './App.css';

function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="products" element={<Products />} />
              <Route path="quotation" element={<Quotation />} />
              <Route path="service-booking" element={<ServiceBooking />} />
              <Route path="careers" element={<Careers />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<Blog />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<AdminHome />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="service-requests" element={<AdminServiceRequests />} />
              <Route path="quotations" element={<AdminQuotations />} />
              <Route path="careers" element={<AdminCareers />} />
              <Route path="inquiries" element={<AdminInquiries />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </SiteProvider>
  );
}

export default App;
