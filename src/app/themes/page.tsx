import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./page.module.css";

const themes = [
  { name: "Birthday", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHs-fSjGKVytlc-rNc0HKOXg4oRJRLJ97U291Sv1i9BOc4WOl8LwEfJU9mQkckvd5qvxmk_GyrS72E_9-u32BAPnAnTjXqpBLg6vTaY78pi-o_VWD3cnC4SIdWupeDq1bZIPUTZHHABycE=w1920-h1080-k-no" },
  { name: "Anniversary", image: "/images/theme_anniversary.jpg" },
  { name: "Proposal", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHShzO4dBkSPzBlwyHE2_BGBzADpWQ2KwpIrBUkyn94ehUHZi2EhklM1kye6PidP5emHUsogboqWrYBH6FkKYDjw8pxQguKj3zj_FhpX_KI7tJcNZaqo_0JJdfKzeBmPzXVMpIt1gTUhwUC=w1920-h1080-k-no" },
  { name: "Bride To Be", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHhoJ_LJJk1nPPnRN_PRPDXpAq8EmhEHc6fSr7nXCbf7D7fpOiWjq9maHSxc-qXDnkNcg4tjGKTSa4vSZBdhB5hpj7V1To7peefPl0KENj51zYOTD_HwYKG6arCYyBSLecQ-NCZtpG-mAtm=w1920-h1080-k-no" },
  { name: "Baby Shower", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEBXYZIaDJpRx4V8oqI8eiVbRYOeSkWW0VIYrqUcJOvK6_aZFcTRApXaBNGz0tsob8r9652YaIzMrIXeBvkAIpLiJRAvQHkavo5_CfJD13WOXua9Kpa5S6iIm7CZ_lw8b1Nbi7G2UPj39s=w1920-h1080-k-no" },
  { name: "Couple Celebration", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHs-fSjGKVytlc-rNc0HKOXg4oRJRLJ97U291Sv1i9BOc4WOl8LwEfJU9mQkckvd5qvxmk_GyrS72E_9-u32BAPnAnTjXqpBLg6vTaY78pi-o_VWD3cnC4SIdWupeDq1bZIPUTZHHABycE=w1920-h1080-k-no" },
  { name: "Surprise Party", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGbhv0D1P-BHX787hg7lkBzpwHXWxCNV_QoHvHCyOb-7xfPoZ0IwJsiQdLoY_GdU2AXAd-Fcsm6x2efeZE73Cj1eOoQNGBVDx5fA6EEnbabqIqm3xu2Cp2z-UE-_vbF_ezOtpxjkImArpKU=w1920-h1080-k-no" },
  { name: "Friendship Celebration", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHs-fSjGKVytlc-rNc0HKOXg4oRJRLJ97U291Sv1i9BOc4WOl8LwEfJU9mQkckvd5qvxmk_GyrS72E_9-u32BAPnAnTjXqpBLg6vTaY78pi-o_VWD3cnC4SIdWupeDq1bZIPUTZHHABycE=w1920-h1080-k-no" },
  { name: "Movie Night", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHhoJ_LJJk1nPPnRN_PRPDXpAq8EmhEHc6fSr7nXCbf7D7fpOiWjq9maHSxc-qXDnkNcg4tjGKTSa4vSZBdhB5hpj7V1To7peefPl0KENj51zYOTD_HwYKG6arCYyBSLecQ-NCZtpG-mAtm=w1920-h1080-k-no" },
  { name: "Bachelor Party", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEBXYZIaDJpRx4V8oqI8eiVbRYOeSkWW0VIYrqUcJOvK6_aZFcTRApXaBNGz0tsob8r9652YaIzMrIXeBvkAIpLiJRAvQHkavo5_CfJD13WOXua9Kpa5S6iIm7CZ_lw8b1Nbi7G2UPj39s=w1920-h1080-k-no" },
  { name: "Farewell", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHs-fSjGKVytlc-rNc0HKOXg4oRJRLJ97U291Sv1i9BOc4WOl8LwEfJU9mQkckvd5qvxmk_GyrS72E_9-u32BAPnAnTjXqpBLg6vTaY78pi-o_VWD3cnC4SIdWupeDq1bZIPUTZHHABycE=w1920-h1080-k-no" },
  { name: "Family Celebration", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGbhv0D1P-BHX787hg7lkBzpwHXWxCNV_QoHvHCyOb-7xfPoZ0IwJsiQdLoY_GdU2AXAd-Fcsm6x2efeZE73Cj1eOoQNGBVDx5fA6EEnbabqIqm3xu2Cp2z-UE-_vbF_ezOtpxjkImArpKU=w1920-h1080-k-no" }
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
          <Link href={`/book-now?occasion=${encodeURIComponent(theme.name)}`} key={i} className={styles.card}>
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
