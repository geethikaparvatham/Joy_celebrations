"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import styles from "./page.module.css";

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Get in <span className="gold-text">Touch</span></h1>
        <p className={styles.subtitle}>
          Have questions or ready to book your luxury event? Reach out to us.
        </p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.contactInfo}>
          <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
              <MapPin size={24} />
            </div>
            <div className={styles.infoContent}>
              <h3>Visit Us</h3>
              <p>Beside Petrol Bunk,<br/>Above Lakshmi Medical Stores,<br/>Padavalarevu, Gunadala,<br/>Vijayawada, AP 520004</p>
            </div>
          </div>
          
          <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
              <Phone size={24} />
            </div>
            <div className={styles.infoContent}>
              <h3>Call Us</h3>
              <p>83281 01267<br/>96186 81267</p>
            </div>
          </div>
          
          <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
              <Clock size={24} />
            </div>
            <div className={styles.infoContent}>
              <h3>Business Hours</h3>
              <p>Daily<br/>10 AM – 2 AM</p>
            </div>
          </div>
        </div>

        <form 
          className={`glass-panel ${styles.form}`} 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name");
            const phone = formData.get("phone");
            const message = formData.get("message");
            
            const whatsappMessage = `Hi JOY Celebrations!%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Message:* ${message}`;
            const whatsappUrl = `https://wa.me/919618681267?text=${whatsappMessage}`;
            
            window.open(whatsappUrl, '_blank');
          }}
        >
          <h2 className="heading-luxury text-2xl mb-4">Send a Message</h2>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={4} required></textarea>
          </div>
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
            Send Message
          </button>
        </form>
      </div>

      {/* Google Maps Section */}
      <div style={{ marginTop: '5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <h2 className="heading-luxury text-2xl" style={{ textAlign: 'center', marginBottom: '2rem', color: '#d4af37' }}>Find Us Here</h2>
        <div style={{ width: '100%', height: '450px', borderRadius: '12px', overflow: 'hidden' }}>
          <iframe 
            src="https://www.google.com/maps?q=Joy+Celebrations+Private+Theatre,+Vijayawada&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'contrast(1.1) brightness(0.9)' }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="JOY Celebrations Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
