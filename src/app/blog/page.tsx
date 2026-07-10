import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | Party Ideas & Inspiration | JOY Celebrations Vijayawada',
  description: 'Read the latest tips, tricks, and ideas for planning the perfect birthday, anniversary, or surprise party at Vijayawada\'s best private theatre.',
  keywords: ['Party Ideas Vijayawada', 'Birthday Celebration Tips', 'Private Theatre Guide'],
};

const posts = [
  {
    slug: 'best-birthday-celebration-ideas-vijayawada',
    title: 'Best Birthday Celebration Ideas in Vijayawada',
    excerpt: 'Looking for the perfect way to celebrate a birthday in Vijayawada? Discover why private theatres are becoming the #1 choice.',
    date: '2023-11-15'
  },
  {
    slug: 'romantic-proposal-decoration-guide',
    title: 'The Ultimate Romantic Proposal Decoration Guide',
    excerpt: 'Planning to pop the question? Learn how to create a breathtaking romantic setup that guarantees a "Yes!".',
    date: '2023-12-02'
  },
  {
    slug: 'private-theatre-vs-restaurant',
    title: 'Private Theatre vs. Restaurant: Which is Better for Celebrations?',
    excerpt: 'Comparing the experience, privacy, and cost of celebrating at a busy restaurant versus a luxury private party theatre.',
    date: '2024-01-10'
  }
];

export default function BlogIndex() {
  return (
    <div style={{ padding: '8rem 5% 5rem', minHeight: '100vh', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="heading-luxury" style={{ color: '#d4af37', marginBottom: '1rem', textAlign: 'center' }}>Celebration <span className="gold-text">Blog</span></h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '4rem', fontSize: '1.1rem' }}>
        Inspiration, guides, and tips for your next big event in Vijayawada.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {posts.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px', padding: '2rem', height: '100%', transition: 'all 0.3s ease', cursor: 'pointer' }} className="blog-card">
              <div style={{ color: '#d4af37', fontSize: '0.9rem', marginBottom: '1rem' }}>{post.date}</div>
              <h2 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '1rem', lineHeight: '1.4' }}>{post.title}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
