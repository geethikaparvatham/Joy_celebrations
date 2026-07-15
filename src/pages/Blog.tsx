import BlogClient from "./blog/BlogClient";


const posts = [
  {
    slug: 'best-birthday-celebration-ideas-vijayawada',
    title: 'Why Are Private Theater Parties the Next Big Trend in Vijayawada',
    category: 'Celebration Ideas',
    image: '/images/theme_birthday.jpg'
  },
  {
    slug: 'romantic-proposal-decoration-guide',
    title: 'From Solo Chill to Group Thrills in Vijayawada — Why Private Experiences Always Win',
    category: 'Places & Activities',
    image: '/images/theme_friendship.jpg'
  },
  {
    slug: 'private-theatre-vs-restaurant',
    title: 'How Are Private Theaters in Vijayawada Replacing Boring Movie Nights?',
    category: 'Movies & Shows',
    image: '/images/theme_couple.jpg'
  },
  {
    slug: 'top-5-anniversary-surprise-ideas',
    title: 'Top 5 Anniversary Surprise Ideas Using a Private Theatre',
    category: 'Celebration Ideas',
    image: '/images/theme_anniversary.jpg'
  },
  {
    slug: 'private-theatre-vs-public-cinema',
    title: '5 Reasons Why a Private Theatre is Better Than a Public Cinema',
    category: 'Places & Activities',
    image: '/images/theme_movie.jpg'
  },
  {
    slug: 'best-romantic-movies-date-night',
    title: 'Best Movies to Watch for a Romantic Date Night in a Private Theatre',
    category: 'Movies & Shows',
    image: '/images/theme_proposal.jpg'
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
