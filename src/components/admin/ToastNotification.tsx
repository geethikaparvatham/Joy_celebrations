import React, { useEffect, useState } from 'react';
import { Bell, X, Check } from 'lucide-react';

interface ToastProps {
  booking: any;
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ToastNotification({ booking, onClose, onAccept, onReject }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50);
    
    // Play Samsung notification sound
    try {
      const audio = new Audio('/samsung_whistle.mp3');
      audio.volume = 1.0;
      audio.play().catch(e => console.error("Audio playback failed (usually requires user interaction first)", e));
    } catch (e) {
      console.error("Audio instantiation failed", e);
    }
  }, []);

  if (!booking) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: isVisible ? '20px' : '-500px',
      width: '380px',
      background: 'rgba(20, 20, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(212,175,55,0.4)',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.15)',
      padding: '1.2rem',
      color: 'white',
      zIndex: 99999,
      transition: 'right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
          <Bell size={18} className="animate-pulse" />
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '0.5px' }}>NEW BOOKING RECEIVED</span>
        </div>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Booking ID:</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{booking.bookingId || booking.id}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Customer:</span>
          <span style={{ fontWeight: 'bold' }}>{booking.customerName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Phone:</span>
          <span>{booking.customerPhone || booking.phoneNumber}</span>
        </div>
        {(booking.whatsappNumber || booking.email) && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9CA3AF' }}>Contact:</span>
            <span style={{ fontSize: '0.75rem' }}>WA: {booking.whatsappNumber} | {booking.email}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
          <span style={{ color: '#9CA3AF' }}>Date & Time:</span>
          <span style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>{booking.date} | {booking.timeSlot}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Package:</span>
          <span>{booking.packageName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Guests & Decor:</span>
          <span>{booking.guests || 'TBD'} | {booking.decoration || 'Standard'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.3rem' }}>
          <span style={{ color: '#9CA3AF' }}>Pay Status:</span>
          <span style={{ color: booking.paymentStatus === 'success' ? '#22C55E' : '#F59E0B' }}>
            {booking.paymentStatus?.toUpperCase() || 'PENDING'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Amount:</span>
          <span style={{ fontWeight: 'bold', color: '#22C55E', fontSize: '0.9rem' }}>₹{booking.totalAmount || booking.totalPrice}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
        <button 
          onClick={() => onAccept(booking.id)}
          style={{ flex: 1, padding: '0.6rem', background: '#22C55E', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', transition: 'transform 0.1s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Check size={16} /> Accept
        </button>
        <button 
          onClick={() => onReject(booking.id)}
          style={{ flex: 1, padding: '0.6rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', transition: 'transform 0.1s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <X size={16} /> Reject
        </button>
      </div>
    </div>
  );
}
