import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const postsData: Record<string, any> = {
  'best-birthday-celebration-ideas-vijayawada': {
    title: 'Why Are Private Theater Parties the Next Big Trend in Vijayawada',
    description: 'Looking for the perfect way to celebrate a birthday in Vijayawada? Discover why private theatres are becoming the #1 choice.',
    date: '2023-11-15',
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
    <div style={{ padding: '8rem 5% 5rem', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/blog" style={{ color: '#d4af37', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Blog
      </Link>
      
      <h1 className="heading-luxury" style={{ color: 'white', marginBottom: '1rem', fontSize: '2.5rem' }}>{post.title}</h1>
      <div style={{ color: '#d4af37', marginBottom: '3rem', fontSize: '0.9rem' }}>Published on {post.date}</div>
      
      <div 
        style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </div>
  );
}
