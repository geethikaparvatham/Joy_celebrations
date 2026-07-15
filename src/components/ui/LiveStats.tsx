import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LiveStats() {
  const [stats, setStats] = useState({
    rating: "5.0",
    reviews: "200+",
    packages: "4+",
    celebrations: "1000+"
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "admin_settings", "website_stats"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats({
          rating: data.rating || "5.0",
          reviews: data.reviews || "200+",
          packages: data.packages || "4+",
          celebrations: data.celebrations || "1000+"
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      gap: '2rem',
      width: '100%',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
          {stats.rating} <span style={{ color: 'var(--accent-gold)' }}>★</span>
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Google Rating</p>
      </div>
      
      <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)', margin: '0 1rem' }} className="md-divider"></div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{stats.reviews}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Happy Reviews</p>
      </div>

      <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)', margin: '0 1rem' }} className="md-divider"></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{stats.packages}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Premium Packages</p>
      </div>

      <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)', margin: '0 1rem' }} className="md-divider"></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{stats.celebrations}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Celebrations</p>
      </div>
      
      <style>{`
        .md-divider { display: none; }
        @media (min-width: 768px) {
          .md-divider { display: block; }
        }
      `}</style>
    </div>
  );
}
