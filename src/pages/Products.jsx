import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Search, Filter } from 'lucide-react';
import { supabase } from '../utils/supabase';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (data) {
        setProducts(data);
        const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(cats);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="products-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Our Products</h1>
          <p>High-quality water treatment products and equipment</p>
        </div>
      </section>

      {/* Filters */}
      <section className="products-filters">
        <div className="container">
          <div className="filters-row">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filter">
              <Filter size={18} />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-list">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <Package size={48} />
              <p>No products found</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <Package size={48} />
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.short_description}</p>
                    {product.price_range && (
                      <p className="product-price">{product.price_range}</p>
                    )}
                    <Link to={`/quotation?product=${product.slug}`} className="btn btn-outline btn-sm">
                      Request Quote <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Need Bulk Orders or Custom Solutions?</h2>
          <p>We provide customized water treatment solutions for industrial needs</p>
          <Link to="/quotation" className="btn btn-primary">
            Request Quotation <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Products;
