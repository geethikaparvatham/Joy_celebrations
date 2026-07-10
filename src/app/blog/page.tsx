import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog | Party Ideas & Inspiration | JOY Celebrations Vijayawada',
  description: 'Read the latest tips, tricks, and ideas for planning the perfect birthday, anniversary, or surprise party at Vijayawada\'s best private theatre.',
  keywords: ['Party Ideas Vijayawada', 'Birthday Celebration Tips', 'Private Theatre Guide'],
};

const posts = [
  {
    slug: 'best-birthday-celebration-ideas-vijayawada',
    title: 'Why Are Private Theater Parties the Next Big Trend in Vijayawada',
    category: 'Celebration Ideas',
    image: '/bg1.jpg'
  },
  {
    slug: 'romantic-proposal-decoration-guide',
    title: 'From Solo Chill to Group Thrills in Vijayawada — Why Private Experiences Always Win',
    category: 'Places & Activities',
    image: '/bg2.jpg'
  },
  {
    slug: 'private-theatre-vs-restaurant',
    title: 'How Are Private Theaters in Vijayawada Replacing Boring Movie Nights?',
    category: 'Movies & Shows',
    image: '/bg3.jpg'
  },
  {
    slug: 'top-5-anniversary-surprise-ideas',
    title: 'Top 5 Anniversary Surprise Ideas Using a Private Theatre',
    category: 'Celebration Ideas',
    image: '/gallery5.jpg'
  },
  {
    slug: 'private-theatre-vs-public-cinema',
    title: '5 Reasons Why a Private Theatre is Better Than a Public Cinema',
    category: 'Places & Activities',
    image: '/gallery6.jpg'
  },
  {
    slug: 'best-romantic-movies-date-night',
    title: 'Best Movies to Watch for a Romantic Date Night in a Private Theatre',
    category: 'Movies & Shows',
    image: '/addon_candle_path.jpg'
  }
];

export default function BlogIndex() {
  return (
    <div style={{ padding: '8rem 5% 5rem', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-luxury" style={{ color: 'white', fontSize: '2.5rem', margin: 0 }}>Blog</h1>
      </div>

      <BlogClient posts={posts} />
    </div>
  );
}
