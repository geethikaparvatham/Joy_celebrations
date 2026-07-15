import SEO from "@/components/SEO";
import styles from "./About.module.css";

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <SEO 
        title="About Us | JOY Celebrations Private Theatre"
        description="Learn about JOY Celebrations, Vijayawada's premier private theatre. Discover our mission to provide the ultimate luxury cinematic celebration experience."
        keywords="About JOY Celebrations, Private theatre founders, Vijayawada luxury theatre"
        canonicalUrl="/about"
      />
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Our <span className="gold-text">Story</span></h1>
        <p className={styles.subtitle}>
          Discover the vision and passion behind Vijayawada's premier private theatre experience.
        </p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.imageWrapper}>
          <img 
            src="/gallery5.jpg" 
            alt="JOY Celebrations Theatre luxurious seating and decoration" 
            className={styles.aboutImage} 
            loading="lazy"
          />
        </div>
        
        <article className={styles.textContent}>
          <h2 className="heading-luxury">Why We Started</h2>
          <p>
            At <strong>JOY Celebrations</strong>, we believe that every special moment deserves an extraordinary setting. 
            We noticed a gap in the market for private, luxurious spaces where families, friends, and 
            couples could celebrate without the interruptions of public venues. We established the premier <strong>private party theatre in Vijayawada</strong> to offer a VIP experience.
          </p>
          <p>
            Our mission is to provide an unparalleled cinematic and celebration experience. From the 
            moment you step in, our premium interiors, personalized decorations, and dedicated service 
            ensure your celebration is nothing short of magical. Whether you are hosting a <strong>birthday celebration in Vijayawada</strong>, planning a beautiful <strong>anniversary celebration</strong>, or looking for a memorable <strong>romantic date night</strong>, our theatre is equipped to make it perfect.
          </p>
        </article>
      </div>
    </main>
  );
}
