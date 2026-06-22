import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';
import { supabase } from '../utils/supabase';

function Blog() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (data) {
        setPosts(data);
        const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(cats);

        if (slug) {
          const post = data.find(p => p.slug === slug);
          if (post) setSelectedPost(post);
        }
      }
      setLoading(false);
    }
    fetchPosts();
  }, [slug]);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedPost) {
    return (
      <div className="blog-single-page">
        <article className="blog-article">
          <div className="container">
            <button onClick={() => setSelectedPost(null)} className="back-link">
              Back to Blog
            </button>
            {selectedPost.featured_image && (
              <div className="blog-featured-image">
                <img src={selectedPost.featured_image} alt={selectedPost.title} />
              </div>
            )}
            <div className="blog-article-header">
              <h1>{selectedPost.title}</h1>
              <div className="blog-meta">
                {selectedPost.author && (
                  <span><User size={16} /> {selectedPost.author}</span>
                )}
                {selectedPost.published_at && (
                  <span><Calendar size={16} /> {new Date(selectedPost.published_at).toLocaleDateString()}</span>
                )}
                {selectedPost.category && (
                  <span><Tag size={16} /> {selectedPost.category}</span>
                )}
              </div>
            </div>
            <div className="blog-article-content">
              <p>{selectedPost.content}</p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>Blog</h1>
          <p>News, updates, and insights from HYFROSYNC ENVIRO</p>
        </div>
      </section>

      {/* Filters */}
      <section className="blog-filters">
        <div className="container">
          <div className="filters-row">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filter">
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

      {/* Posts Grid */}
      <section className="blog-list">
        <div className="container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="no-posts">
              <p>No blog posts found</p>
            </div>
          ) : (
            <div className="blog-grid">
              {filteredPosts.map(post => (
                <article key={post.id} className="blog-card">
                  {post.featured_image && (
                    <div className="blog-card-image">
                      <img src={post.featured_image} alt={post.title} />
                    </div>
                  )}
                  <div className="blog-card-content">
                    {post.category && (
                      <span className="blog-card-category">{post.category}</span>
                    )}
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-card-footer">
                      {post.published_at && (
                        <span className="blog-date">
                          <Calendar size={14} />
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="blog-read-more"
                      >
                        Read More <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Blog;
