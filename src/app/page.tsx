"use client";

import Head from "next/head";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import TypingAnimation from "@/components/ui/TypingAnimation";
import ChecklistSection from "@/components/home/ChecklistSection";

const heroBackgrounds = [
  "/bg2.jpg",
  "/bg1.jpg",
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
      <section className={styles.hero}>
        {heroBackgrounds.map((bg, index) => (
          <div
            key={bg}
            className={styles.heroBackground}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url('${bg}')`,
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
          >
            ✨ VIJAYAWADA'S PREMIER PRIVATE PARTY THEATRE ✨
          </motion.div>
          
          <motion.h1 
            className={`${styles.title} heading-luxury`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <span style={{ display: 'none' }}>Private Party Theatre in Vijayawada - </span>Let's Celebrate Your <br/> <TypingAnimation /> <span className="gold-text">With Us</span>
          </motion.h1>
          
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Birthdays, anniversaries, proposals & movie nights —<br/>crafted with love, starting at just ₹599/hr
          </motion.p>
          
          <motion.div 
            className={styles.ctaContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link href="/book-now" className="btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}>
              Book Your Celebration
            </Link>
            <Link href="/themes" className={styles.btnOutline}>
              Explore Themes
            </Link>
            <a href="https://www.instagram.com/joy.celebrations" target="_blank" rel="noopener noreferrer" className={styles.btnOutline}>
              Check Samples
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <span>SCROLL</span>
          <span>↓</span>
        </motion.div>
      </section>
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <h3 className={styles.statNumber}>
              5.0 <span className="gold-text">★</span>
            </h3>
            <p className={styles.statLabel}>Google Rating</p>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statBox}>
            <h3 className={styles.statNumber}>200+</h3>
            <p className={styles.statLabel}>Happy Reviews</p>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statBox}>
            <h3 className={styles.statNumber}>4+</h3>
            <p className={styles.statLabel}>Premium Party Packages</p>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statBox}>
            <h3 className={styles.statNumber}>1000+</h3>
            <p className={styles.statLabel}>Successful Celebrations</p>
          </div>
        </div>
      </section>

      <ChecklistSection />

      <section style={{ padding: '5rem 10%', background: '#0a0a0a', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <h2 className="heading-luxury" style={{ color: '#d4af37', marginBottom: '2rem', textAlign: 'center' }}>The Best Private Party Theatre in Vijayawada</h2>
        <div style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Welcome to <strong>JOY Celebrations</strong>, the ultimate <strong>private party theatre in Vijayawada</strong>. Whether you are planning a grand <strong>birthday celebration in Vijayawada</strong>, a romantic <strong>anniversary celebration</strong>, or an intimate <strong>proposal decoration</strong>, our luxury private theatre offers the perfect setting. We provide state-of-the-art 4K projection, Dolby Atmos immersive sound, and breathtaking custom decorations tailored for your special moments.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            Looking for a unique <strong>couple theatre in Vijayawada</strong> for a romantic date night? Or perhaps a fun-filled <strong>kids birthday theatre</strong>? Our premium packages start at just ₹599, combining world-class entertainment with exclusive privacy. Say goodbye to crowded restaurants and hello to a personalized, VIP experience. Book your <strong>surprise celebration in Vijayawada</strong> today and let us craft memories that will last a lifetime.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Private Party Theatre Booking",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "205"
            }
          })
        }}
      />
    </div>
  );
}
