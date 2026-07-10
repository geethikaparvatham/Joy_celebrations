import type { Metadata } from 'next';
import { Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Feedback & Reviews',
  description: 'Read what our customers have to say about their private party theatre experience at JOY Celebrations in Vijayawada.',
};

const REVIEWS = [
  {
    name: "Sneha Reddy",
    date: "March 2024",
    rating: 5,
    text: "Celebrated my husband's birthday here and it was absolutely magical! The decorations were premium, the screen was huge, and we had complete privacy. Highly recommend the Midnight Special package!",
    event: "Birthday Celebration"
  },
  {
    name: "Karthik V.",
    date: "February 2024",
    rating: 5,
    text: "Best private theatre in Vijayawada! We booked it for our anniversary and the rose petal pathway was stunning. The sound system is incredible and the staff was very cooperative.",
    event: "Anniversary Surprise"
  },
  {
    name: "Priya Sharma",
    date: "January 2024",
    rating: 5,
    text: "A perfect place for a private movie date. We loved the comfortable sofas and the fact that we could control our own movie. Will definitely be coming back!",
    event: "Romantic Date Night"
  }
];

export default function ReviewsPage() {
  return (
    <div style={{ padding: '8rem 5% 5rem', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="heading-luxury" style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>
          Feedback & <span className="gold-text">Reviews</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Don't just take our word for it. See why our customers rate us as the best private party theatre experience in Vijayawada.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {REVIEWS.map((review, i) => (
          <div key={i} style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(212, 175, 55, 0.2)', 
            padding: '2rem', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transition: 'transform 0.3s ease'
          }}
          className="review-card"
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(review.rating)].map((_, j) => (
                <Star key={j} size={18} fill="#d4af37" color="#d4af37" />
              ))}
            </div>
            
            <p style={{ color: 'white', fontSize: '1.05rem', lineHeight: '1.6', fontStyle: 'italic', flexGrow: 1 }}>
              "{review.text}"
            </p>
            
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
              <h4 style={{ color: '#d4af37', margin: '0 0 0.3rem 0', fontSize: '1.1rem' }}>{review.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <span>{review.event}</span>
                <span>{review.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '5rem', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <h2 className="heading-luxury" style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Had a great time with us?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          We would love to hear about your experience! Your feedback helps us create even better magical moments.
        </p>
        <a 
          href="https://g.page/review" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          Leave a Google Review
        </a>
      </div>
    </div>
  );
}
