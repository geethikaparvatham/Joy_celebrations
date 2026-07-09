"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Download, Share2 } from "lucide-react";

interface BookingData {
  n: string; // name
  p: string; // phone
  pk: string; // package
  o: string; // occasion
  d: string; // date
  t: string; // time
  a: string[]; // addons
  tm: number; // total amount
  pm: string; // payment method
  id: string; // booking id
}

function ReceiptContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<BookingData | null>(null);

  useEffect(() => {
    const d = searchParams.get('d');
    if (d) {
      try {
        const decoded = JSON.parse(atob(d));
        setData(decoded);
      } catch (e) {
        console.error("Invalid receipt data");
      }
    }
  }, [searchParams]);

  if (!data) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <p>Loading receipt...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'JOY Celebrations Booking Receipt',
          text: `Check out my booking for a ${data.pk} at JOY Celebrations!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Receipt link copied to clipboard!');
    }
  };

  return (
    <div style={{ minHeight: '80vh', padding: '4rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ 
        background: 'var(--bg-secondary)', 
        borderRadius: '16px', 
        border: '1px solid #d4af37', 
        padding: '3rem 2rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 15px 50px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Receipt Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Check size={32} color="white" />
          </div>
          <h1 className="heading-luxury" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#d4af37' }}>Booking Confirmed</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Receipt ID: #{data.id}</p>
        </div>

        {/* Receipt Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Customer</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{data.n}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Package</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{data.pk}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Occasion</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{data.o}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Date & Time</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{data.d} | {data.t}</span>
          </div>
          
          {data.a && data.a.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Add-ons</span>
              <span style={{ color: 'white', fontWeight: 'bold', textAlign: 'right', maxWidth: '60%' }}>
                {data.a.join(', ')}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Payment Method</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{data.pm}</span>
          </div>
        </div>

        {/* Total */}
        <div style={{ 
          background: 'rgba(212, 175, 55, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <span style={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 'bold' }}>Total Paid</span>
          <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>₹ {data.tm.toLocaleString('en-IN')}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleShare} className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={18} /> Share
          </button>
          <button onClick={handlePrint} className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><p>Loading receipt...</p></div>}>
      <ReceiptContent />
    </Suspense>
  );
}
