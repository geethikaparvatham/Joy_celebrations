import { useState, useEffect } from "react";
import { Play, Sparkles, Star, Quote } from "lucide-react";
import LiveStats from "@/components/ui/LiveStats";
import styles from "@/page.module.css";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import TypingAnimation from "@/components/ui/TypingAnimation";

const heroBackgrounds = [
  "/bg2.jpg",
  "/bg3.jpg"
];

export default function Home() {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBackgrounds.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.container}>
      <SEO 
        title="Premium Private Theatre in Vijayawada | Birthday & Anniversary Celebrations"
        description="Book Vijayawada's best private party theatre for birthdays, anniversaries, proposals & movie nights. Luxury decoration, 4K screen & Dolby Atmos. Starting at ₹599/hr."
        keywords="Private Theatre in Vijayawada, Birthday Celebration in Vijayawada, Proposal Decoration in Vijayawada, Anniversary Celebration in Vijayawada, Private Movie Screening Vijayawada, Couple Celebration Vijayawada"
        canonicalUrl="/"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "JOY Celebrations Private Theatre",
            "image": "https://joy-celebrations.vercel.app/bg2.jpg",
            "@id": "https://joy-celebrations.vercel.app",
            "url": "https://joy-celebrations.vercel.app",
            "telephone": "+919618681267",
            "priceRange": "₹599 - ₹2500",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Gunadala",
              "addressLocality": "Vijayawada",
              "addressRegion": "Andhra Pradesh",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 16.5168,
              "longitude": 80.6471
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "10:00",
              "closes": "23:59"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Private Party Theatre Booking",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "205"
            }
          }
        ]}
      />
      <section className={styles.hero}>
        {heroBackgrounds.map((bg, index) => (
          <div
            key={bg}
            className={styles.heroBackground}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('${bg}')`,
              opacity: currentBg === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentBg === index ? 1 : 0
            }}
          />
        ))}
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className={styles.heroPreTitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            ✨ VIJAYAWADA'S PREMIER PRIVATE PARTY THEATRE ✨
          </motion.div>
          
          <motion.h1 
            className={`${styles.title} heading-luxury`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ textShadow: "0 4px 15px rgba(0,0,0,0.6)" }}
          >
            <span style={{ display: 'none' }}>Private Party Theatre in Vijayawada - </span>Let's Celebrate Your <br/> <TypingAnimation /> <span className="gold-text">With Us</span>
          </motion.h1>
          
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)", fontWeight: 500 }}
          >
            Birthdays, anniversaries, proposals & movie nights —<br/>crafted with love, starting at just ₹599/hr
          </motion.p>
          
          <motion.div 
            className={styles.ctaContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link to="/book-now" className="btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1rem" }} aria-label="Book your celebration now">
              Book Your Celebration
            </Link>
            <Link to="/themes" className={styles.btnOutline} aria-label="Explore our decoration themes">
              Explore Themes
            </Link>
            <a href="https://www.instagram.com/joy.celebrations" target="_blank" rel="noopener noreferrer" className={styles.btnOutline} aria-label="Check our Instagram samples">
              Check Samples
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          aria-hidden="true"
        >
          <span>SCROLL</span>
          <span>↓</span>
        </motion.div>
      </section>
      
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <LiveStats />
        </div>
      </section>

      <main>
        <section style={{ padding: '5rem 10%', background: '#0a0a0a', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <h2 className="heading-luxury" style={{ color: '#d4af37', marginBottom: '2rem', textAlign: 'center' }}>About JOY Celebrations - The Best Private Party Theatre in Vijayawada</h2>
          <article style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Welcome to <strong>JOY Celebrations</strong>, the ultimate <strong>private party theatre in Vijayawada</strong>. Whether you are planning a grand <strong>birthday celebration in Vijayawada</strong>, a romantic <strong>anniversary celebration</strong>, or an intimate <strong>proposal decoration</strong>, our luxury private theatre offers the perfect setting. We provide state-of-the-art 4K projection, Dolby Atmos immersive sound, and breathtaking custom decorations tailored for your special moments.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              Looking for a unique <strong>couple theatre in Vijayawada</strong> for a romantic date night? Or perhaps a fun-filled <strong>kids birthday theatre</strong>? Our premium packages start at just ₹599, combining world-class entertainment with exclusive privacy. Say goodbye to crowded restaurants and hello to a personalized, VIP experience. Book your <strong>surprise celebration in Vijayawada</strong> today and let us craft memories that will last a lifetime.
            </p>
          </article>
        </section>

        <section style={{ padding: '5rem 10%', background: '#111', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <h2 className="heading-luxury" style={{ color: '#d4af37', marginBottom: '2rem', textAlign: 'center' }}>Why Choose Us?</h2>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', color: 'var(--text-secondary)' }}>
            <div style={{ background: '#0a0a0a', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Premium Decor</h3>
              <p>From romantic rose petal pathways to elaborate balloon arches, our expert decorators create stunning backdrops that make your photos pop.</p>
            </div>
            <div style={{ background: '#0a0a0a', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Ultimate Privacy</h3>
              <p>Enjoy a completely private theatre experience. Only you and your guests. No strangers, no noise, just your favorite people in a luxury setting.</p>
            </div>
            <div style={{ background: '#0a0a0a', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Cinematic Magic</h3>
              <p>Experience your favorite movies, videos, or slideshows on a massive 4K screen paired with room-shaking Dolby Atmos sound systems.</p>
            </div>
          </div>
        </section>

        <section style={{ padding: '5rem 10%', background: '#0a0a0a', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <h2 className="heading-luxury" style={{ color: '#d4af37', marginBottom: '2rem', textAlign: 'center' }}>Our Celebration Services</h2>
          <article style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '2rem' }}>We specialize in hosting a variety of private events ensuring every detail is perfectly managed.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <li style={{ background: '#111', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>Birthday Celebrations</li>
              <li style={{ background: '#111', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>Proposal Decorations</li>
              <li style={{ background: '#111', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>Anniversary Celebrations</li>
              <li style={{ background: '#111', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>Bride-to-Be Events</li>
              <li style={{ background: '#111', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>Baby Shower Celebrations</li>
              <li style={{ background: '#111', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>Private Movie Screenings</li>
              <li style={{ background: '#111', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>Surprise Events</li>
            </ul>
          </article>
        </section>

        <section style={{ padding: '5rem 10%', background: '#111', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <h2 className="heading-luxury" style={{ color: '#d4af37', marginBottom: '2rem', textAlign: 'center' }}>Safety, Hygiene & Location</h2>
          <article style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              At <strong>JOY Celebrations</strong>, your health and safety are our top priorities. Our private theatre in Gunadala, Vijayawada undergoes rigorous cleaning and sanitization protocols before and after every booking. We ensure a spotless, fresh, and hygienic environment so you can relax and celebrate with absolute peace of mind.
            </p>
            <p>
              Conveniently located in the heart of Gunadala, Vijayawada, our venue is easily accessible with ample parking available. We are a trusted local business dedicated to delivering a premium, 5-star experience to every guest that walks through our doors.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
