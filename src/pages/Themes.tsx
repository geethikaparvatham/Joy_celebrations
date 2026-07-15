import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import styles from "@/page.module.css";

const themes = [
  { name: "Birthday", image: "/images/theme_birthday.jpg" },
  { name: "Anniversary", image: "/images/theme_anniversary.jpg" },
  { name: "Proposal", image: "/images/theme_proposal.jpg" },
  { name: "Bride To Be", image: "/images/theme_bride.jpg" },
  { name: "Baby Shower", image: "/images/theme_baby.jpg" },
  { name: "Couple Celebration", image: "/images/theme_couple.jpg" },
  { name: "Surprise Party", image: "/images/theme_surprise.jpg" },
  { name: "Friendship Celebration", image: "/images/theme_friendship.jpg" },
  { name: "Movie Night", image: "/images/theme_movie.jpg" },
  { name: "Bachelor Party", image: "/images/theme_bachelor.jpg" },
  { name: "Farewell", image: "/images/theme_farewell.jpg" },
  { name: "Family Celebration", image: "/images/theme_family.jpg" }
];
export default function OccasionsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Explore Our <span className="gold-text">Themes</span></h1>
        <p className={styles.subtitle}>
          No matter the milestone, we have the perfect setting for you. Discover tailored experiences for your special day.
        </p>
      </div>

      <div className={styles.grid}>
        {themes.map((theme, i) => (
          <Link to={`/book-now?occasion=${encodeURIComponent(theme.name)}`} key={i} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              <img src={theme.image} alt={theme.name} className={styles.cardImage} />
            </div>
            
            <div className={styles.overlay}>
              <h2 className={styles.cardTitle}>{theme.name}</h2>
              <span className={styles.cardLink}>
                Book Experience <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
