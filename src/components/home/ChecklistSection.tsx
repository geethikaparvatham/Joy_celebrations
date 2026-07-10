"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./ChecklistSection.module.css";

const CHECKLIST_ITEMS = [
  "Modern Premium Interiors",
  "Private Theatre Experience",
  "Fully Air Conditioned Hall",
  "HD Projector & Dolby Sound",
  "Beautiful Theme Decorations",
  "Birthday Celebration Packages",
  "Anniversary Celebration Packages",
  "Proposal & Surprise Planning",
  "Customized Name Board",
  "LED Letter Decorations",
  "Romantic Candle Setup",
  "Photography Friendly Ambience",
  "Online Booking",
  "WhatsApp Support",
  "Instant Booking Confirmation"
];

export default function ChecklistSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className={styles.section} 
      ref={sectionRef}
      aria-labelledby="checklist-heading"
    >
      <div className={styles.container}>
        <h2 id="checklist-heading" className={styles.heading}>
          Why Choose JOY Celebrations?
        </h2>
        
        <ul className={styles.list} aria-label="Reasons to choose JOY Celebrations">
          {CHECKLIST_ITEMS.map((item, index) => (
            <li 
              key={index} 
              className={styles.listItem}
              style={{ 
                animationDelay: isVisible ? `${index * 100}ms` : '0ms',
                animationPlayState: isVisible ? 'running' : 'paused'
              }}
            >
              <div className={styles.iconWrapper} aria-hidden="true">
                <Check size={18} strokeWidth={3} />
              </div>
              <span className={styles.text}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
