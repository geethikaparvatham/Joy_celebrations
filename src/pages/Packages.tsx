
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from 'react-router-dom';
import { Check, Clock, Users } from "lucide-react";
import styles from "./Packages.module.css";

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  members: string;
  features: string[];
  timings: string[];
  bookedSlots?: string[];
  isPopular?: boolean;
  isMidnight?: boolean;
};

export default function PackagesPage() {
  const defaultPlans: Plan[] = [
    {
      id: "plan-1",
      name: "PLAN 1",
      price: 599,
      duration: "1 Hour",
      members: "Up to 4 Members",
      features: ["Perfect for Private Movie Experience", "Large Screen Projection", "Premium Sound System"],
      timings: [
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", 
        "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", 
        "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM", 
        "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM", "12:00 AM - 01:00 AM", 
        "01:00 AM - 02:00 AM"
      ],
      bookedSlots: ["12:00 PM - 01:00 PM", "06:00 PM - 07:00 PM"],
      isPopular: false,
      isMidnight: false
    },
    {
      id: "plan-2",
      name: "PLAN 2",
      price: 1300,
      duration: "1 Hour",
      members: "Up to 4 Members",
      features: ["Premium Decoration", "Customized Name Board", "LED Letters", "1 Kg Cake OR Half Kg Cool Cake"],
      timings: [
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", 
        "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", 
        "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM", 
        "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM", "12:00 AM - 01:00 AM", 
        "01:00 AM - 02:00 AM"
      ],
      bookedSlots: ["02:00 PM - 03:00 PM", "08:00 PM - 09:00 PM"],
      isPopular: true,
      isMidnight: false
    },
    {
      id: "plan-3",
      name: "PLAN 3",
      price: 2500,
      duration: "2 Hours",
      members: "Up to 10 Members",
      features: ["Premium Decoration", "Birthday Video", "Fog Effect", "LED Letters & Name Board"],
      timings: [
        "09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM", "03:00 PM - 05:00 PM", 
        "05:00 PM - 07:00 PM", "07:00 PM - 09:00 PM", "09:00 PM - 11:00 PM", "11:00 PM - 01:00 AM", 
        "12:00 AM - 02:00 AM"
      ],
      bookedSlots: ["07:00 PM - 09:00 PM"],
      isPopular: false,
      isMidnight: false
    },
    {
      id: "plan-4",
      name: "Midnight Special",
      price: 2500,
      duration: "1 Hour",
      members: "Up to 10 Members",
      features: ["Exclusive Midnight Slot", "Premium Decoration", "Birthday Video", "Fog Effect", "LED Letters", "Special Cake"],
      timings: ["11:00 PM - 12:00 AM", "12:00 AM - 01:00 AM", "01:00 AM - 02:00 AM"],
      bookedSlots: [],
      isPopular: false,
      isMidnight: true
    }
  ];

  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "plans"), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedPlans = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Plan[];
        setPlans(fetchedPlans);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSelectSlot = (planId: string, slot: string) => {
    setSelectedSlots(prev => ({
      ...prev,
      [planId]: prev[planId] === slot ? "" : slot
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>Our <span className="gold-text">Packages</span></h1>
        <p className={styles.subtitle}>
          Choose the perfect package for your celebration. All packages include a luxury private theatre experience.
        </p>
      </div>

      <div className={styles.grid}>
        {plans.map((pkg) => {
          const selectedSlot = selectedSlots[pkg.id];
          return (
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

              {((pkg.timings && pkg.timings.length > 0) || (pkg.bookedSlots && pkg.bookedSlots.length > 0)) && (
                <div style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1.2rem 1rem', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  maxHeight: '280px',
                  overflowY: 'auto'
                }}>
                  {pkg.timings && pkg.timings.filter(t => !pkg.bookedSlots?.includes(t)).length > 0 && (
                    <>
                      <p className="text-sm font-bold mb-3" style={{ color: 'var(--accent-gold)', textAlign: 'left' }}>Choose Your Slot -</p>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', 
                        gap: '0.5rem', 
                        marginBottom: pkg.bookedSlots && pkg.bookedSlots.length > 0 ? '1.5rem' : '0' 
                      }}>
                        {pkg.timings.filter(t => !pkg.bookedSlots?.includes(t)).map((time, idx) => {
                          const isSelected = selectedSlot === time;
                          return (
                            <span 
                              key={`avail-${idx}`} 
                              onClick={() => handleSelectSlot(pkg.id, time)}
                              style={{ 
                                background: isSelected ? 'var(--accent-gold)' : 'rgba(212,175,55,0.1)', 
                                border: isSelected ? '1px solid var(--accent-gold)' : '1px solid rgba(212,175,55,0.25)', 
                                padding: '0.6rem 0.5rem', 
                                borderRadius: '6px', 
                                fontSize: '0.8rem', 
                                color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)', 
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: isSelected ? 'bold' : 'normal'
                              }}
                            >
                              {time}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                  
                  {pkg.bookedSlots && pkg.bookedSlots.length > 0 && (
                    <>
                      <p className="text-sm font-bold mb-3 mt-2" style={{ color: '#EF4444', textAlign: 'left' }}>Booked Slots -</p>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', 
                        gap: '0.5rem' 
                      }}>
                        {pkg.bookedSlots.map((time, idx) => (
                          <span 
                            key={`booked-${idx}`} 
                            style={{ 
                              background: 'rgba(255,255,255,0.03)', 
                              border: '1px solid rgba(255,255,255,0.08)', 
                              padding: '0.6rem 0.5rem', 
                              borderRadius: '6px', 
                              fontSize: '0.8rem', 
                              color: '#666', 
                              textAlign: 'center',
                              textDecoration: 'line-through',
                              opacity: 0.6,
                              whiteSpace: 'nowrap',
                              cursor: 'not-allowed'
                            }}
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <Link 
                to={`/book-now?package=${pkg.id}${selectedSlot ? `&slot=${encodeURIComponent(selectedSlot)}` : ''}`} 
                className={`btn-primary ${styles.bookBtn}`}
              >
                BOOK NOW
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
