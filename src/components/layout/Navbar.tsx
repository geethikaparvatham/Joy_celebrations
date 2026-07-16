
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Home, Gift, PartyPopper, Image as ImageIcon, PhoneCall, Lock } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <Link to="/" className={styles.logo}>
        <span className="gold-text">JOY</span> <span className={styles.logoLight}>CELEBRATIONS</span>
      </Link>

      <div className={styles.navLinks}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/about" className={styles.link}>About</Link>
        <Link to="/packages" className={styles.link}>Packages</Link>
        <Link to="/themes" className={styles.link}>Themes</Link>
        <Link to="/gallery" className={styles.link}>Gallery</Link>
        <Link to="/add-ons" className={styles.link}>Add-ons</Link>
        <Link to="/blog" className={styles.link}>Blog</Link>
        <Link to="/faq" className={styles.link}>FAQ</Link>
        <Link to="/reviews" className={styles.link}>Feedback & Reviews</Link>
        <Link to="/contact" className={styles.link}>Contact</Link>
      </div>

      <div className={styles.rightActions}>
        <a href="tel:+919618681267" className={styles.phoneLink} aria-label="Call Joy Celebrations">
          <Phone size={16} aria-hidden="true" /> 96186 81267
        </a>
        <Link to="/admin/login" aria-label="Admin Portal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', padding: '0.5rem', cursor: 'pointer', transition: 'color 0.3s' }}>
          <Lock size={16} />
        </Link>
        <Link to="/book-now" className={`btn-primary ${styles.bookBtn}`}>
          Book Now
        </Link>
      </div>

      <button 
        className={styles.mobileMenuBtn} 
        aria-label="Toggle Mobile Menu"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
      </button>
    </nav>
    
    {/* Mobile Dropdown Menu */}
    <div className={`${styles.mobileDropdown} ${isMobileMenuOpen ? styles.open : ""}`}>
      <Link to="/" className={styles.mobileDropdownLink} onClick={closeMenu}>Home</Link>
      <Link to="/about" className={styles.mobileDropdownLink} onClick={closeMenu}>About</Link>
      <Link to="/packages" className={styles.mobileDropdownLink} onClick={closeMenu}>Packages</Link>
      <Link to="/themes" className={styles.mobileDropdownLink} onClick={closeMenu}>Themes</Link>
      <Link to="/gallery" className={styles.mobileDropdownLink} onClick={closeMenu}>Gallery</Link>
      <Link to="/add-ons" className={styles.mobileDropdownLink} onClick={closeMenu}>Add-ons</Link>
      <Link to="/blog" className={styles.mobileDropdownLink} onClick={closeMenu}>Blog</Link>
      <Link to="/faq" className={styles.mobileDropdownLink} onClick={closeMenu}>FAQ</Link>
      <Link to="/reviews" className={styles.mobileDropdownLink} onClick={closeMenu}>Feedback & Reviews</Link>
      <Link to="/contact" className={styles.mobileDropdownLink} onClick={closeMenu}>Contact</Link>
    </div>
    
    {/* Mobile Bottom Navigation */}
    <div className={styles.mobileBottomNav}>
      <Link to="/" className={styles.mobileNavLink}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link to="/packages" className={styles.mobileNavLink}>
        <Gift size={20} />
        <span>Packages</span>
      </Link>
      <Link to="/themes" className={styles.mobileNavLink}>
        <PartyPopper size={20} />
        <span>Themes</span>
      </Link>
      <Link to="/gallery" className={styles.mobileNavLink}>
        <ImageIcon size={20} />
        <span>Gallery</span>
      </Link>
      <Link to="/contact" className={styles.mobileNavLink}>
        <PhoneCall size={20} />
        <span>Contact</span>
      </Link>
    </div>
    </>
  );
}
