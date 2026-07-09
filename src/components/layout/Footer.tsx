import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, Star } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        {/* Column 1 - Brand */}
        <div className={styles.brand}>
          <h2>JOY Celebrations</h2>
          <p>Celebrate Every Moment in Style</p>
          <p className="mt-4">
            Vijayawada's most premium private party theatre for birthdays, anniversaries, and special moments.
          </p>
          
          <div className={styles.ratingBadge}>
            <div className={styles.stars}>★★★★★</div>
            <span>5.0 on Google</span>
          </div>

          <div className={styles.socialIcons}>
            <a href="https://instagram.com/joy.celebrations" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Column 2 - Quick Links */}
        <div className={styles.links}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/packages">Packages</Link></li>
            <li><Link href="/themes">Themes</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/book-now">Book Now</Link></li>
          </ul>
        </div>

        {/* Column 3 - Celebration Services */}
        <div className={styles.links}>
          <h3>Celebration Services</h3>
          <ul>
            <li><Link href="/themes">Birthday Celebrations</Link></li>
            <li><Link href="/themes">Anniversary Celebrations</Link></li>
            <li><Link href="/themes">Proposal Setup</Link></li>
            <li><Link href="/themes">Surprise Decorations</Link></li>
            <li><Link href="/themes">Baby Shower</Link></li>
            <li><Link href="/themes">Friends Party</Link></li>
            <li><Link href="/themes">Movie Screening</Link></li>
          </ul>
        </div>

        {/* Column 4 - Contact Info */}
        <div className={styles.contact}>
          <h3>Contact Us</h3>
          <ul>
            <li>
              <MapPin size={18} className="gold-text" />
              <div>
                <span>Padavalarevu, Gunadala<br/>Vijayawada</span>
              </div>
            </li>
            <li>
              <Phone size={18} className="gold-text" />
              <span>83281 01267 / 96186 81267</span>
            </li>
            <li>
              <MessageCircle size={18} className="gold-text" />
              <span>WhatsApp Us</span>
            </li>
            <li>
              <Mail size={18} className="gold-text" />
              <span>info@joycelebrations.com</span>
            </li>
          </ul>
        </div>

        {/* Column 5 - Support */}
        <div className={styles.links}>
          <h3>Support</h3>
          <ul>
            <li><Link href="#">FAQ</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Terms & Conditions</Link></li>
            <li><Link href="#">Refund Policy</Link></li>
            <li><Link href="#">Cancellation Policy</Link></li>
            <li><Link href="#">Booking Guidelines</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} <span>JOY Celebrations</span>. All rights reserved.</p>
          <p className={styles.madeWithLove}>Made with ❤️ in Vijayawada.</p>
        </div>
      </div>
    </footer>
  );
}
