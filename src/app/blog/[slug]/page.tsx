import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const postsData: Record<string, any> = {
  'best-birthday-celebration-ideas-vijayawada': {
    title: 'Why Are Private Theater Parties the Next Big Trend in Vijayawada',
    description: 'Looking for the perfect way to celebrate a birthday in Vijayawada? Discover why private theatres are becoming the #1 choice.',
    date: '2023-11-15',
    category: 'Celebration Ideas',
    image: '/images/theme_birthday.jpg',
    content: `
      <h2>The Shift in Vijayawada's Celebration Culture</h2>
      <p>For years, birthday celebrations in Vijayawada meant booking a table at a crowded restaurant or hosting a chaotic house party. But today, the trend has completely shifted towards <strong>private party theatres in Vijayawada</strong>. The demand for intimate, personalized, and exclusive spaces is higher than ever.</p>
      
      <h2>Why Private Theatres?</h2>
      <p>Imagine walking into a beautifully decorated, soundproof room with a massive 4K screen, plush seating, and absolute privacy. You can play your favorite movie, stream a customized birthday video, and cut the cake without strangers watching. At JOY Celebrations, we provide exactly this—a VIP experience that makes the birthday boy or girl feel truly special.</p>

      <h2>Top Ideas for Your Booking</h2>
      <ul>
        <li><strong>Surprise Video:</strong> Compile messages from friends and family and play them on the big screen.</li>
        <li><strong>Theme Decor:</strong> Opt for a romantic red theme for a partner, or a fun, vibrant theme for kids.</li>
        <li><strong>Midnight Surprises:</strong> Book our Midnight Special slot for the ultimate 12:00 AM surprise.</li>
      </ul>
    `
  },
  'romantic-proposal-decoration-guide': {
    title: 'From Solo Chill to Group Thrills in Vijayawada — Why Private Experiences Always Win',
    description: 'Planning to pop the question? Learn how to create a breathtaking romantic setup that guarantees a "Yes!".',
    date: '2023-12-02',
    category: 'Places & Activities',
    image: '/images/theme_friendship.jpg',
    content: `
      <h2>Setting the Stage for Forever</h2>
      <p>A proposal is a once-in-a-lifetime moment, and the environment plays a massive role in setting the mood. If you're in Andhra Pradesh and searching for the best <strong>proposal decoration in Vijayawada</strong>, a private theatre offers an unbeatable combination of intimacy and grandeur.</p>
      
      <h2>Essential Decoration Elements</h2>
      <p>To create a truly romantic atmosphere, focus on lighting and personalization:</p>
      <ul>
        <li><strong>Fairy Lights and Candles:</strong> Dim the main lights and use soft, warm LED candles and fairy lights.</li>
        <li><strong>Rose Petal Pathway:</strong> A classic that never fails. Lead them into the theatre with a beautiful path of fresh petals.</li>
        <li><strong>"Marry Me" Neon Sign:</strong> At JOY Celebrations, we offer stunning neon signage that looks incredible in photos.</li>
      </ul>

      <h2>The Execution</h2>
      <p>Tell your partner you're going out for a regular movie date. When they walk into the private theatre, the screen lights up with a montage of your memories together, leading up to the big question. It's flawless, private, and deeply romantic.</p>
    `
  },
  'private-theatre-vs-restaurant': {
    title: 'How Are Private Theaters in Vijayawada Replacing Boring Movie Nights?',
    description: 'Comparing the experience, privacy, and cost of celebrating at a busy restaurant versus a luxury private party theatre.',
    date: '2024-01-10',
    category: 'Movies & Shows',
    image: '/images/theme_couple.jpg',
    content: `
      <h2>The Dilemma</h2>
      <p>When planning a celebration, the default option is often a nice restaurant. But as <strong>couple theatres in Vijayawada</strong> become more popular, people are starting to weigh their options. Let's compare the two.</p>
      
      <h2>Privacy & Exclusivity</h2>
      <p>Restaurants are public. You are sharing your special moment with dozens of strangers, dealing with background noise, and often feeling rushed by waiters. A private theatre is 100% yours. You control the music, the screen, and the pacing of your event.</p>

      <h2>Customization</h2>
      <p>Try asking a restaurant to dim the lights, play a specific video on a 150-inch screen, and fill the room with balloons. It's impossible. At a private theatre, customization is the core of the business.</p>
      
      <h2>The Verdict</h2>
      <p>If you just want a quick meal, a restaurant is fine. But if you want to create an unforgettable <em>experience</em>, a private celebration space wins every time. With packages starting at just ₹599, it's also incredibly budget-friendly!</p>
    `
  },
  'top-5-anniversary-surprise-ideas': {
    title: 'Top 5 Anniversary Surprise Ideas Using a Private Theatre',
    description: 'Make your anniversary unforgettable with these top 5 surprise ideas you can execute perfectly in a private party theatre.',
    date: '2024-02-14',
    category: 'Celebration Ideas',
    image: '/images/theme_anniversary.jpg',
    content: `
      <h2>Going Beyond the Usual Dinner</h2>
      <p>Anniversaries are milestones that deserve more than just a standard dinner date. If you're looking for unique <strong>anniversary celebrations in Vijayawada</strong>, renting a private theatre opens up a world of creative possibilities.</p>
      
      <h2>Idea 1: The Memory Lane Movie</h2>
      <p>Instead of watching a Hollywood movie, create a 10-minute video montage of your favorite moments, trips, and photos from the past year. Watching this on a 150-inch 4K screen with Dolby Atmos sound is an emotional and unforgettable experience.</p>

      <h2>Idea 2: The "Fake" Movie Date</h2>
      <p>Tell your partner you're going to see a regular movie. When they walk in, the room is completely decorated with balloons, LED letters spelling out your names, and their favorite songs playing in the background.</p>
      
      <h2>Idea 3: The Midnight Cake Cutting</h2>
      <p>Book our exclusive Midnight Special package. Arrive just before 12:00 AM, and as the clock strikes midnight, a beautifully decorated cake is brought in along with a magical fog entry effect.</p>
      
      <h2>Book Your Experience</h2>
      <p>At JOY Celebrations, we handle all the decorations, catering, and technical setup so you can focus entirely on your partner. Ready to plan the perfect surprise?</p>
    `
  },
  'private-theatre-vs-public-cinema': {
    title: '5 Reasons Why a Private Theatre is Better Than a Public Cinema',
    description: 'Tired of noisy crowds and uncomfortable seats? Here are 5 reasons why upgrading to a private theatre in Vijayawada is worth it.',
    date: '2024-03-05',
    category: 'Places & Activities',
    image: '/images/theme_movie.jpg',
    content: `
      <h2>The Evolution of Movie Watching</h2>
      <p>Going to the movies is a classic pastime, but public cinemas come with a lot of frustrations—crying babies, people talking on their phones, and uncomfortable seating. This is why <strong>private theatres in Vijayawada</strong> are taking over.</p>

      <h2>1. Complete Privacy</h2>
      <p>Whether you're watching an intense thriller or a romantic comedy, you can react however you want without worrying about disturbing strangers.</p>

      <h2>2. You Control the Remote</h2>
      <p>Need a bathroom break? Want to rewind a crucial scene? In a private theatre, you have the remote. You control the pace of your entertainment.</p>

      <h2>3. Premium Comfort</h2>
      <p>Instead of rigid flip-down seats, enjoy luxury sofas, bean bags, and plenty of legroom. It's like your living room, but with a 150-inch 4K screen.</p>
    `
  },
  'best-romantic-movies-date-night': {
    title: 'Best Movies to Watch for a Romantic Date Night in a Private Theatre',
    description: 'Planning a movie date? Here is a curated list of the best romantic movies to stream during your private theatre booking.',
    date: '2024-03-20',
    category: 'Movies & Shows',
    image: '/images/theme_proposal.jpg',
    content: `
      <h2>Setting the Mood</h2>
      <p>A great date night relies on a great movie. When you book a <strong>couple theatre in Vijayawada</strong>, you get access to all major streaming platforms. But what should you watch? Here are our top picks.</p>

      <h2>1. About Time (2013)</h2>
      <p>A beautiful, heartwarming sci-fi romance about time travel, love, and appreciating the little things in life. Perfect for couples.</p>

      <h2>2. The Notebook (2004)</h2>
      <p>A classic for a reason. If you want a tear-jerker that guarantees cuddles on our premium sofas, this is the one.</p>

      <h2>3. La La Land (2016)</h2>
      <p>Experience the incredible jazz soundtrack and vibrant colors on our state-of-the-art 4K projector and Dolby Atmos sound system. It's a visual masterpiece.</p>

      <h2>Make it Perfect</h2>
      <p>Pair your movie with our custom rose petal decorations and a special cake to create a truly magical evening at JOY Celebrations.</p>
    `
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = postsData[params.slug];
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | JOY Celebrations`,
    description: post.description,
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = postsData[params.slug];

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "JOY Celebrations"
    }
  };

  return (
    <>
      {/* Dynamic styles specifically for the blog content so we can style the raw HTML */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .blog-content h2 {
            color: #d4af37;
            font-size: 1.8rem;
            margin-top: 3rem;
            margin-bottom: 1rem;
            font-family: var(--font-playfair);
          }
          .blog-content p {
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
          }
          .blog-content ul {
            margin-bottom: 2rem;
            padding-left: 1.5rem;
          }
          .blog-content li {
            margin-bottom: 0.8rem;
          }
          .blog-content strong {
            color: white;
            font-weight: 600;
          }
        `
      }} />

      <div style={{ padding: '8rem 5% 5rem', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/blog" style={{ color: '#d4af37', textDecoration: 'none', marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, transition: 'all 0.3s ease' }}>
          &larr; Back to Blog
        </Link>
        
        {post.category && (
          <div style={{ color: '#d4af37', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>
            {post.category}
          </div>
        )}

        <h1 className="heading-luxury" style={{ color: 'white', marginBottom: '1.5rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.2' }}>{post.title}</h1>
        
        <div style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Published on {post.date}</span>
          <span style={{ width: '4px', height: '4px', background: 'rgba(212, 175, 55, 0.5)', borderRadius: '50%' }}></span>
          <span>5 min read</span>
        </div>

        {post.image && (
          <div style={{ width: '100%', height: 'auto', aspectRatio: '16/9', position: 'relative', marginBottom: '4rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.image} 
              alt={post.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        
        <div 
          style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </div>
    </>
  );
}
