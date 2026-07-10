"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Phone, Home, Gift, PartyPopper, Image as ImageIcon, PhoneCall } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <Link href="/" className={styles.logo}>
        <span className="gold-text">JOY</span> <span className={styles.logoLight}>CELEBRATIONS</span>
      </Link>

      <div className={styles.navLinks}>
        <Link href="/" className={styles.link}>Home</Link>
        <Link href="/about" className={styles.link}>About</Link>
        <Link href="/packages" className={styles.link}>Packages</Link>
        <Link href="/themes" className={styles.link}>Themes</Link>
        <Link href="/gallery" className={styles.link}>Gallery</Link>
        <Link href="/add-ons" className={styles.link}>Add-ons</Link>
        <Link href="/blog" className={styles.link}>Blog</Link>
        <Link href="/faq" className={styles.link}>FAQ</Link>
        <Link href="/contact" className={styles.link}>Contact</Link>
      </div>

      <div className={styles.rightActions}>
        <a href="tel:09618681267" className={styles.phoneLink} aria-label="Call Joy Celebrations">
          <Phone size={16} aria-hidden="true" /> 096186 81267
        </a>
        <Link href="/book-now" className={`btn-primary ${styles.bookBtn}`}>
          Book Now
        </Link>
      </div>

      <button className={styles.mobileMenuBtn} aria-label="Toggle Mobile Menu">
        <Menu size={28} aria-hidden="true" />
      </button>
    </nav>
    
    {/* Mobile Bottom Navigation */}
    <div className={styles.mobileBottomNav}>
      <Link href="/" className={styles.mobileNavLink}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link href="/packages" className={styles.mobileNavLink}>
        <Gift size={20} />
        <span>Packages</span>
      </Link>
      <Link href="/themes" className={styles.mobileNavLink}>
        <PartyPopper size={20} />
        <span>Themes</span>
      </Link>
      <Link href="/gallery" className={styles.mobileNavLink}>
        <ImageIcon size={20} />
        <span>Gallery</span>
      </Link>
      <Link href="/contact" className={styles.mobileNavLink}>
        <PhoneCall size={20} />
        <span>Contact</span>
      </Link>
    </div>
    </>
  );
}
