import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useInView } from "framer-motion";

const AnimatedStat = ({ value }: { value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  const numMatch = value.match(/[\d.]+/);
  const number = numMatch ? parseFloat(numMatch[0]) : 0;
  const suffix = value.replace(/[\d.]+/g, '');
  const isFloat = value.includes('.');

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = number;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    
    let totalDuration = 2000;
    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / totalDuration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(easeProgress * (end - start) + start);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [number, isInView]);

  const formattedNumber = isFloat ? displayValue.toFixed(1) : Math.floor(displayValue);

  return (
    <span ref={ref}>
      {formattedNumber}{suffix}
    </span>
  );
};

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
          <AnimatedStat value={stats.rating} /> <span style={{ color: 'var(--accent-gold)' }}>★</span>
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Google Rating</p>
      </div>
      
      <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)', margin: '0 1rem' }} className="md-divider"></div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}><AnimatedStat value={stats.reviews} /></h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Happy Reviews</p>
      </div>

      <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)', margin: '0 1rem' }} className="md-divider"></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}><AnimatedStat value={stats.packages} /></h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Premium Packages</p>
      </div>

      <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)', margin: '0 1rem' }} className="md-divider"></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}><AnimatedStat value={stats.celebrations} /></h3>
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
