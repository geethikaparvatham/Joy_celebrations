
import { useState } from "react";
import { Star, Send } from "lucide-react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [feedback, setFeedback] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }
    
    // Google prohibits websites from automatically posting reviews on a user's behalf for security reasons.
    // The best practice workaround is to copy their text and redirect them to the Google Review page.
    if (feedback) {
      navigator.clipboard.writeText(feedback).catch(err => console.error('Could not copy text: ', err));
      alert("We've copied your feedback! You will now be redirected to Google. Please paste your feedback there to complete your review!");
    }
    
    // Redirect to Google Reviews (User must replace this URL with their actual Google Business Review link)
    window.location.href = "https://g.page/review";
    
    // Reset form
    setName("");
    setEvent("");
    setFeedback("");
    setRating(0);
  };

  return (
    <div style={{ marginTop: '5rem', background: 'rgba(212, 175, 55, 0.05)', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.2)', maxWidth: '600px', margin: '5rem auto 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="heading-luxury" style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Had a great time with us?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          We would love to hear about your experience! Submit your feedback below.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ color: 'white', fontSize: '1.1rem' }}>How would you rate your experience?</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(rating)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <Star 
                  size={32} 
                  fill={star <= hoverRating ? "#d4af37" : "transparent"} 
                  color={star <= hoverRating ? "#d4af37" : "rgba(255,255,255,0.3)"} 
                  style={{ transition: 'all 0.2s ease' }}
                />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Your Name (Optional)" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', color: 'white', fontFamily: 'inherit', outline: 'none' }}
          />
          <input 
            type="text" 
            placeholder="Event (e.g. Birthday)" 
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            style={{ width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', color: 'white', fontFamily: 'inherit', outline: 'none' }}
          />
        </div>

        <textarea 
          placeholder="Write your feedback here..." 
          required
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{ width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', color: 'white', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
        />

        <button 
          type="submit" 
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
        >
          <Send size={18} /> Submit Feedback
        </button>
      </form>
    </div>
  );
}
