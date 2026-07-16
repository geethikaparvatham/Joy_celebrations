
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SEO from "@/components/SEO";
import styles from "./Contact.module.css";

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "JOY Celebrations Private Theatre",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-8328101267",
        "contactType": "customer service",
        "availableLanguage": ["English", "Telugu", "Hindi"]
      }
    }
  };

  return (
    <main className={styles.container}>
      <SEO 
        title="Contact Us | JOY Celebrations Private Theatre"
        description="Get in touch with JOY Celebrations in Vijayawada. Call us at 83281 01267 or 96186 81267 for private theatre bookings, decorations, and surprise events."
        keywords="Contact JOY Celebrations, Private theatre Vijayawada phone number, Booking inquiry Vijayawada"
        canonicalUrl="/contact"
        schema={contactSchema}
      />
      
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
            
            const whatsappMessage = `Hi JOY Celebrations!\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${message}`;
            const whatsappUrl = `https://wa.me/919618681267?text=${encodeURIComponent(whatsappMessage)}`;
            
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
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              required 
              pattern="^[6-9]\d{9}$"
              maxLength={10}
              title="Phone number must be exactly 10 digits and start with 6, 7, 8, or 9"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                let val = target.value.replace(/\D/g, '');
                if (val.length > 0 && !/^[6-9]/.test(val[0])) {
                  val = ''; // Clear if first digit is invalid
                }
                target.value = val;
              }}
            />
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
    </main>
  );
}
