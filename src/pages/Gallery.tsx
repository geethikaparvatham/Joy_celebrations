import { Expand } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import SEO from "@/components/SEO";
import styles from "./Gallery.module.css";

const galleryItems = [
  { id: 1, url: "/bg1.jpg" },
  { id: 2, url: "/bg3.jpg" },
  { id: 3, url: "/gallery13.jpg?v=2" },
  { id: 4, url: "/gallery12.jpg" },
  { id: 5, url: "/gallery5.jpg" },
  { id: 6, url: "/gallery6.jpg" },
  { id: 7, url: "/gallery8.jpg" },
  { id: 8, url: "/gallery9.jpg" },
  { id: 9, url: "/gallery10.jpg?v=2" }
];

export default function GalleryPage() {
  return (
    <main className={styles.container}>
      <SEO 
        title="Gallery & Decorations | JOY Celebrations Private Theatre"
        description="View our stunning private theatre decorations, birthday setups, and romantic proposal arrangements in Vijayawada."
        keywords="Private theatre decoration photos, Birthday celebration gallery, Surprise proposal Vijayawada"
        canonicalUrl="/gallery"
      />
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Our <span className="gold-text">Gallery</span></h1>
        <p className={styles.subtitle}>
          Take a look at the beautiful moments celebrated at JOY. From intimate birthdays to grand surprises.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <a 
          href="https://www.instagram.com/joy.celebrations" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          aria-label="Follow JOY Celebrations on Instagram"
        >
          <InstagramIcon size={20} /> Follow us on Instagram @joy.celebrations
        </a>
      </div>

      <div className={styles.masonry}>
        {galleryItems.map((item, index) => (
          <div key={item.id} className={styles.item}>
            <img 
              src={item.url} 
              alt={`JOY Celebrations Private Theatre Decoration in Vijayawada - Gallery Image ${item.id}`} 
              className={styles.galleryImage}
              loading={index > 3 ? "lazy" : "eager"}
            />
            <div className={styles.overlay}>
              <div className={styles.icon} aria-hidden="true">
                <Expand size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
