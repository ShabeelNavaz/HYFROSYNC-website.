-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category VARCHAR(100),
  icon VARCHAR(100),
  image_url TEXT,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  specifications JSONB,
  price_range VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author VARCHAR(255),
  category VARCHAR(100),
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Requests table
CREATE TABLE service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(20),
  preferred_date DATE,
  preferred_time VARCHAR(50),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotation Requests table
CREATE TABLE quotation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  product_service VARCHAR(255),
  quantity INTEGER,
  requirements TEXT,
  budget VARCHAR(100),
  timeline VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career Applications table
CREATE TABLE career_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  position VARCHAR(255) NOT NULL,
  experience VARCHAR(50),
  qualification VARCHAR(255),
  resume_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Inquiries table
CREATE TABLE contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services (public read)
CREATE POLICY "services_select" ON services FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "services_insert" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "services_update" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "services_delete" ON services FOR DELETE TO authenticated USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "products_select" ON products FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "products_delete" ON products FOR DELETE TO authenticated USING (true);

-- RLS Policies for blogs (public read published only)
CREATE POLICY "blogs_select" ON blogs FOR SELECT TO PUBLIC USING (is_published = true);
CREATE POLICY "blogs_select_admin" ON blogs FOR SELECT TO authenticated USING (true);
CREATE POLICY "blogs_insert" ON blogs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "blogs_update" ON blogs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "blogs_delete" ON blogs FOR DELETE TO authenticated USING (true);

-- RLS Policies for service_requests (authenticated only)
CREATE POLICY "service_requests_select" ON service_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "service_requests_insert" ON service_requests FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "service_requests_update" ON service_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for quotation_requests (authenticated only)
CREATE POLICY "quotation_requests_select" ON quotation_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "quotation_requests_insert" ON quotation_requests FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "quotation_requests_update" ON quotation_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for career_applications (authenticated only)
CREATE POLICY "career_applications_select" ON career_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "career_applications_insert" ON career_applications FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "career_applications_update" ON career_applications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for contact_inquiries (authenticated only)
CREATE POLICY "contact_inquiries_select" ON contact_inquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "contact_inquiries_insert" ON contact_inquiries FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "contact_inquiries_update" ON contact_inquiries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for admin_users (authenticated only)
CREATE POLICY "admin_users_select" ON admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_users_insert" ON admin_users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_users_update" ON admin_users FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for site_settings (public read)
CREATE POLICY "site_settings_select" ON site_settings FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "site_settings_insert" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "site_settings_update" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
('company_name', 'HYFROSYNC ENVIRO PVT. LTD.'),
('company_tagline', 'Pure Water, Pure Life'),
('company_address', 'Hyfrosync Enviro Pvt. Ltd., Industrial Area, New Delhi, India'),
('company_phone', '+91-9876543210'),
('company_email', 'info@hyfrosyncenviro.com'),
('company_whatsapp', '+91-9876543210'),
('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.2!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzAwLjAiTiA3N8KwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890'),
('google_analytics_id', ''),
('facebook_url', ''),
('twitter_url', ''),
('linkedin_url', ''),
('instagram_url', '');

-- Insert default services
INSERT INTO services (title, slug, description, short_description, category, icon, features) VALUES
('RO Service & AMC', 'ro-service-amc', 'Professional RO service and Annual Maintenance Contracts for residential and commercial water purifiers. Our expert technicians ensure your water purification systems run efficiently.', 'Expert RO maintenance and AMC services', 'Water Purification', 'droplets', ARRAY['Installation', 'Regular Service', 'Filter Replacement', 'AMC Plans']),
('AC Service & AMC', 'ac-service-amc', 'Complete air conditioning service and maintenance solutions. We provide installation, repair, gas refill, and comprehensive AMC packages.', 'AC installation, repair & maintenance services', 'HVAC Services', 'wind', ARRAY['AC Installation', 'Gas Refill', 'Repair Service', 'AMC Plans']),
('Water Tank Cleaning', 'water-tank-cleaning', 'Professional water tank cleaning and disinfection services using safe and effective methods. Regular cleaning ensures safe drinking water.', 'Professional tank cleaning & disinfection', 'Water Solutions', 'tank', ARRAY['Underground Tanks', 'Overhead Tanks', 'Disinfection', 'Regular Cleaning']),
('Water Testing Services', 'water-testing-services', 'Comprehensive water quality testing services for drinking water, industrial water, and wastewater. NABL accredited lab reports available.', 'Certified water quality testing', 'Testing', 'flask-conical', ARRAY['Drinking Water Test', 'Industrial Water Test', 'Wastewater Analysis', 'Lab Reports']),
('Water Treatment Chemicals', 'water-treatment-chemicals', 'High-quality water treatment chemicals including RO antiscalants, cooling water treatment, boiler chemicals, and effluent treatment chemicals.', 'Industrial water treatment chemicals', 'Chemicals', 'beaker', ARRAY['RO Antiscalants', 'Cooling Water Chemicals', 'Boiler Chemicals', 'ETP Chemicals']),
('Water Treatment Plants', 'water-treatment-plants', 'Design, installation, and maintenance of water treatment plants including RO plants, DM plants, softeners, and filtration systems.', 'Complete water treatment solutions', 'Plants', 'factory', ARRAY['RO Plants', 'DM Plants', 'Softeners', 'Filtration Systems']),
('Industrial Water Solutions', 'industrial-water-solutions', 'Customized industrial water management solutions including zero liquid discharge, effluent treatment plants, and process water systems.', 'End-to-end industrial water management', 'Industrial', 'settings', ARRAY['ZLD Systems', 'ETP Plants', 'STP Plants', 'Process Water']);

-- Insert default admin user (password: admin123 - should be changed immediately)
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('admin@hyfrosync.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'super_admin');