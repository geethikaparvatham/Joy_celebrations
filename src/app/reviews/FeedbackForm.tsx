"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [feedback, setFeedback] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the message for WhatsApp
    const whatsappNumber = "919618681267";
    let msg = `*New Customer Feedback!*%0A%0A`;
    msg += `*Name:* ${name || 'Anonymous'}%0A`;
    if (event) msg += `*Event:* ${event}%0A`;
    msg += `*Rating:* ${rating} Stars ⭐%0A`;
    msg += `*Feedback:* "${feedback}"%0A`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${msg}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setName("");
    setEvent("");
    setFeedback("");
    setRating(5);
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
