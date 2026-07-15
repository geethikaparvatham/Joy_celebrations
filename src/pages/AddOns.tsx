
import { Link } from 'react-router-dom';
import { Cake } from "lucide-react";
import SEO from "@/components/SEO";
import styles from "./AddOns.module.css";

const addons = [
  { id: "photography", title: "Professional Photography (1 Hour)", price: 1500, image: "/addon_photography.jpg", details: "• Unlimited Photos" },
  { id: "cinematic-reel", title: "Cinematic Reel", price: 1500, image: "/addon_cinematic_reel.jpg", details: "" },
  { id: "fog-effect", title: "Fog Effect", price: 799, image: "/addon_fog.jpg", details: "" },
  { id: "bubble-entry", title: "Bubble Entry", price: 299, image: "/addon_bubble_entry.jpg", details: "" },
  { id: "rose-petals", title: "Rose Petals Entry", price: 699, image: "/addon_rose_petals.jpg", details: "" }
];

export default function AddOnsPage() {
  const addonsSchema = addons.map(addon => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${addon.title} - JOY Celebrations Add-on`,
    "image": `https://joy-celebrations.vercel.app${addon.image}`,
    "description": addon.details || `Premium ${addon.title} add-on for your celebration at JOY Celebrations Vijayawada.`,
    "offers": {
      "@type": "Offer",
      "price": addon.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://joy-celebrations.vercel.app/book-now"
    }
  }));

  return (
    <main className={styles.container}>
      <SEO 
        title="Premium Add-ons & Decorations | JOY Celebrations Vijayawada"
        description="Enhance your celebration with premium add-ons like Professional Photography, Cinematic Reels, Fog Effect, and Custom Cakes in Vijayawada."
        keywords="Private theatre add-ons, Photography Vijayawada, Fog effect celebration, Rose petals entry"
        canonicalUrl="/add-ons"
        schema={addonsSchema}
      />
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Our <span className="gold-text">Add-ons</span></h1>
        <p className={styles.subtitle}>
          Enhance your experience with our premium add-on services tailored just for you.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          {addons.map((addon, index) => (
            <article key={addon.id} className={styles.photoCard}>
              <div className={styles.circularImageWrapper}>
                <img src={addon.image} alt={`${addon.title} add-on at JOY Celebrations`} className={styles.image} loading={index > 2 ? "lazy" : "eager"} />
              </div>
              <h3 className={styles.addonTitle}>{addon.title}</h3>
              <p className={styles.addonPrice}>₹ {addon.price}</p>
              {addon.details && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{addon.details}</p>}
            </article>
          ))}
        </div>

        <aside className={`glass-panel ${styles.specialNote}`}>
          <Cake size={32} className={styles.icon} style={{ marginBottom: '1rem' }} aria-hidden="true" />
          <h3>Customized Cakes & Decoration</h3>
          <p>Available upon request. Contact us to make your celebration perfectly customized to your taste!</p>
          <Link to="/contact" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Contact Us for Details
          </Link>
        </aside>
      </div>
    </main>
  );
}
