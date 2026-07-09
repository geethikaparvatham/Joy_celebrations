"use client";

import { MessageCircle, Phone } from "lucide-react";
import styles from "./WhatsAppButton.module.css";

export default function WhatsAppButton() {
  const whatsappNumber = "919618681267";
  const phoneNumber = "918328101267";
  const message = "Hello JOY Celebrations, I would like to book a private party theatre.";
  const encodedMessage = encodeURIComponent(message);
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <div className={styles.floatingContainer}>
      <a 
        href={`tel:${phoneNumber}`} 
        className={`${styles.floatingBtn} ${styles.phoneBtn}`}
        aria-label="Call Us"
      >
        <Phone size={24} />
      </a>
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`${styles.floatingBtn} ${styles.whatsappBtn}`}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
