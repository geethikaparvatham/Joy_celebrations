import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Our <span className="gold-text">Story</span></h1>
        <p className={styles.subtitle}>
          Discover the vision and passion behind Vijayawada's premier private theatre experience.
        </p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.imageWrapper}>
          <img 
            src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAEBXYZIaDJpRx4V8oqI8eiVbRYOeSkWW0VIYrqUcJOvK6_aZFcTRApXaBNGz0tsob8r9652YaIzMrIXeBvkAIpLiJRAvQHkavo5_CfJD13WOXua9Kpa5S6iIm7CZ_lw8b1Nbi7G2UPj39s=w1200-h800-k-no" 
            alt="JOY Celebrations Theatre" 
            className={styles.aboutImage} 
          />
        </div>
        
        <div className={styles.textContent}>
          <h2>Why We Started</h2>
          <p>
            At JOY Celebrations, we believe that every special moment deserves an extraordinary setting. 
            We noticed a gap in the market for private, luxurious spaces where families, friends, and 
            couples could celebrate without the interruptions of public venues.
          </p>
          <p>
            Our mission is to provide an unparalleled cinematic and celebration experience. From the 
            moment you step in, our premium interiors, personalized decorations, and dedicated service 
            ensure your celebration is nothing short of magical.
          </p>
          
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>5.0</div>
              <div className={styles.statLabel}>Google Rating</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>204+</div>
              <div className={styles.statLabel}>Happy Reviews</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1000+</div>
              <div className={styles.statLabel}>Events Hosted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
