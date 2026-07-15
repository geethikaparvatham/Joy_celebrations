
import { Link } from 'react-router-dom';
import { Cake } from "lucide-react";
import styles from "./AddOns.module.css";

const addons = [
  { id: "photography", title: "Professional Photography (1 Hour)", price: 1500, image: "/addon_photography.jpg", details: "• Unlimited Photos" },
  { id: "cinematic-reel", title: "Cinematic Reel", price: 1500, image: "/addon_cinematic_reel.jpg", details: "" },
  { id: "fog-effect", title: "Fog Effect", price: 799, image: "/addon_fog.jpg", details: "" },
  { id: "bubble-entry", title: "Bubble Entry", price: 299, image: "/addon_bubble_entry.jpg", details: "" },
  { id: "rose-petals", title: "Rose Petals Entry", price: 699, image: "/addon_rose_petals.jpg", details: "" }
];

export default function AddOnsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Our <span className="gold-text">Add-ons</span></h1>
        <p className={styles.subtitle}>
          Enhance your experience with our premium add-on services tailored just for you.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          {addons.map((addon) => (
            <div key={addon.id} className={styles.photoCard}>
              <div className={styles.circularImageWrapper}>
                <img src={addon.image} alt={addon.title}  className={styles.image} />
              </div>
              <h3 className={styles.addonTitle}>{addon.title}</h3>
              <p className={styles.addonPrice}>₹ {addon.price}</p>
              {addon.details && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{addon.details}</p>}
            </div>
          ))}
        </div>

        <div className={`glass-panel ${styles.specialNote}`}>
          <Cake size={32} className={styles.icon} style={{ marginBottom: '1rem' }} />
          <h3>Customized Cakes & Decoration</h3>
          <p>Available upon request. Contact us to make your celebration perfectly customized to your taste!</p>
          <Link to="/contact" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Contact Us for Details
          </Link>
        </div>
      </div>
    </div>
  );
}
