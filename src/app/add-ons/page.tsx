import Link from "next/link";
import { Camera, Film, CloudFog, PartyPopper, Flower, Cake } from "lucide-react";
import styles from "./page.module.css";

const addons = [
  {
    id: "photography",
    title: "Professional Photography (1 Hour)",
    price: 1500,
    icon: <Camera size={24} className={styles.icon} />,
    features: ["Unlimited Photos"]
  },
  {
    id: "cinematic-reel",
    title: "Cinematic Reel",
    price: 1500,
    icon: <Film size={24} className={styles.icon} />,
    features: []
  },
  {
    id: "fog-effect",
    title: "Fog Effect",
    price: 799,
    icon: <CloudFog size={24} className={styles.icon} />,
    features: []
  },
  {
    id: "bubble-entry",
    title: "Bubble Entry",
    price: 299,
    icon: <PartyPopper size={24} className={styles.icon} />,
    features: []
  },
  {
    id: "rose-petals",
    title: "Rose Petals Entry",
    price: 699,
    icon: <Flower size={24} className={styles.icon} />,
    features: []
  }
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
            <div key={addon.id} className={`glass-panel ${styles.card}`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  {addon.icon}
                </div>
                <h2 className={styles.cardTitle}>{addon.title}</h2>
              </div>
              
              <div className={styles.price}>
                <span>₹</span>{addon.price}
              </div>

              {addon.features.length > 0 && (
                <ul className={styles.features}>
                  {addon.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className={`glass-panel ${styles.specialNote}`}>
          <Cake size={32} className={styles.icon} style={{ marginBottom: '1rem' }} />
          <h3>Customized Cakes & Decoration</h3>
          <p>Available upon request. Contact us to make your celebration perfectly customized to your taste!</p>
          <Link href="/contact" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Contact Us for Details
          </Link>
        </div>
      </div>
    </div>
  );
}
