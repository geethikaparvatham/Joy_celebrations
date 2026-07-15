import { Expand } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import styles from "./Gallery.module.css";

const galleryItems = [
  { id: 1, url: "/bg1.jpg" },
  { id: 2, url: "/bg3.jpg" },
  { id: 3, url: "/gallery3.jpg" },
  { id: 4, url: "/gallery4.jpg" },
  { id: 5, url: "/bg2.jpg" },
  { id: 6, url: "/gallery5.jpg" },
  { id: 7, url: "/gallery6.jpg" }
];

export default function GalleryPage() {
  return (
    <div className={styles.container}>
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
        >
          <InstagramIcon size={20} /> Follow us on Instagram @joy.celebrations
        </a>
      </div>

      <div className={styles.masonry}>
        {galleryItems.map((item) => (
          <div key={item.id} className={styles.item}>
            <img 
              src={item.url} 
              alt={`Gallery Image ${item.id}`} 
              className={styles.galleryImage}
            />
            <div className={styles.overlay}>
              <div className={styles.icon}>
                <Expand size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
