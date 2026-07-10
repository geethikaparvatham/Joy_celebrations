import Link from "next/link";
import { Check, Clock, Users, PlusCircle } from "lucide-react";
import styles from "./page.module.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Celebration Packages in Vijayawada',
  description: 'Explore our budget-friendly birthday packages and romantic date night options at JOY Celebrations, Vijayawada’s top private party theatre.',
  keywords: ['Budget-Friendly Birthday Packages Vijayawada', 'Romantic Date Night Vijayawada', 'Private Party Packages', 'Joy Celebrations Packages'],
};

const packages = [
  {
    id: "plan-1",
    name: "PLAN 1",
    price: 599,
    duration: "1 Hour",
    members: "Up to 4 Members",
    features: [
      "Perfect for Private Movie Experience",
      "Large Screen Projection",
      "Premium Sound System",
    ]
  },
  {
    id: "plan-2",
    name: "PLAN 2",
    price: 1300,
    duration: "1 Hour",
    members: "Up to 4 Members",
    isPopular: true,
    features: [
      "Premium Decoration",
      "Customized Name Board",
      "LED Letters",
      "1 Kg Cake OR Half Kg Cool Cake",
    ]
  },
  {
    id: "plan-3",
    name: "PLAN 3",
    price: 2500,
    duration: "2 Hours",
    members: "Up to 10 Members",
    features: [
      "Premium Decoration",
      "Birthday Video",
      "Fog Effect",
      "LED Letters & Name Board",
    ]
  },
  {
    id: "plan-4",
    name: "Midnight Special",
    price: 2500,
    duration: "1 Hour",
    members: "Up to 10 Members",
    isMidnight: true,
    features: [
      "Exclusive Midnight Slot",
      "Premium Decoration",
      "Birthday Video",
      "Fog Effect",
      "LED Letters",
      "Special Cake",
    ]
  }
];

export default function PackagesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Our <span className="gold-text">Packages</span></h1>
        <p className={styles.subtitle}>
          Choose the perfect package for your celebration. All packages include a luxury private theatre experience.
        </p>
      </div>

      <div className={styles.grid}>
        {packages.map((pkg) => (
          <div key={pkg.id} className={`${styles.card} ${pkg.isMidnight ? styles.midnightCard : ''} ${pkg.isPopular ? styles.popularCard : ''}`}>
            {pkg.isMidnight && <div className={styles.midnightBadge}>MIDNIGHT</div>}
            
            <h2 className={styles.planName}>{pkg.name}</h2>
            <div className={styles.price}>
              <span>₹</span>{pkg.price}
            </div>
            
            <ul className={styles.features}>
              <li>
                <Clock size={18} className={styles.featureIcon} />
                {pkg.duration}
              </li>
              <li>
                <Users size={18} className={styles.featureIcon} />
                {pkg.members}
              </li>
              {pkg.features.map((feature, i) => (
                <li key={i}>
                  <Check size={16} className={styles.featureIconCheck} />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href={`/book-now?package=${pkg.id}`} className={`btn-primary ${styles.bookBtn}`}>
              BOOK NOW
            </Link>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": packages.map((pkg, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Service",
                "name": pkg.name,
                "provider": {
                  "@type": "LocalBusiness",
                  "name": "JOY Celebrations"
                },
                "offers": {
                  "@type": "Offer",
                  "price": pkg.price,
                  "priceCurrency": "INR"
                }
              }
            }))
          })
        }}
      />
    </div>
  );
}
