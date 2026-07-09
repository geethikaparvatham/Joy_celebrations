"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import TypingAnimation from "@/components/ui/TypingAnimation";

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
            Let's Celebrate Your <br/> <TypingAnimation /> <span className="gold-text">With Us</span>
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
    </div>
  );
}
