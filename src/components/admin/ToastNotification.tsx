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

    // Auto close after 6 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, 6000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!booking) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: isVisible ? '20px' : '-400px',
      width: '350px',
      background: 'rgba(20, 20, 20, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--accent-gold)',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.2)',
      padding: '1.2rem',
      color: 'white',
      zIndex: 99999,
      transition: 'right 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Customer:</span>
          <span style={{ fontWeight: 'bold' }}>{booking.customerName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Phone:</span>
          <span>{booking.phoneNumber}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Date & Time:</span>
          <span>{booking.date} | {booking.timeSlot}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Package:</span>
          <span style={{ color: 'var(--accent-gold)' }}>{booking.packageName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9CA3AF' }}>Amount:</span>
          <span style={{ fontWeight: 'bold', color: '#22C55E' }}>₹{booking.totalPrice}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
        <button 
          onClick={() => onAccept(booking.id)}
          style={{ flex: 1, padding: '0.5rem', background: '#22C55E', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}
        >
          <Check size={14} /> Accept
        </button>
        <button 
          onClick={() => onReject(booking.id)}
          style={{ flex: 1, padding: '0.5rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}
        >
          <X size={14} /> Reject
        </button>
      </div>
    </div>
  );
}
