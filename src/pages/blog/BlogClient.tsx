
import { useState } from "react";
import { Link } from 'react-router-dom';


interface BlogPost {
  slug: string;
  title: string;
  category: string;
  image: string;
}

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Celebration Ideas", "Places & Activities", "Movies & Shows"];

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '2rem',
              border: activeCategory === category ? 'none' : '1px solid rgba(212, 175, 55, 0.3)',
              background: activeCategory === category ? '#d4af37' : 'transparent',
              color: activeCategory === category ? '#050505' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              fontWeight: activeCategory === category ? 600 : 400
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {filteredPosts.map(post => (
          <Link to={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none' }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'transform 0.3s ease',
              cursor: 'pointer' 
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden' }}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                   
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '0 0.5rem' }}>
                <div style={{ color: '#d4af37', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                  {post.category}
                </div>
                <h2 style={{ color: 'white', fontSize: '1.25rem', lineHeight: '1.4', fontWeight: 600, margin: 0 }}>
                  {post.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
