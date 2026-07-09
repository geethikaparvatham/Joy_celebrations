import { Settings, Users, Calendar, LayoutDashboard, Ticket } from "lucide-react";
import styles from "./page.module.css";

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>Admin Panel</div>
        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.active}`}><LayoutDashboard size={20} /> Dashboard</a>
          <a href="#" className={styles.navItem}><Ticket size={20} /> Bookings</a>
          <a href="#" className={styles.navItem}><Calendar size={20} /> Calendar</a>
          <a href="#" className={styles.navItem}><Users size={20} /> Customers</a>
          <a href="#" className={styles.navItem}><Settings size={20} /> Settings</a>
        </nav>
      </aside>
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className="heading-luxury text-2xl">Overview</h1>
          <div className={styles.userProfile}>Admin User</div>
        </header>
        
        <div className={styles.statsGrid}>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3>Today's Bookings</h3>
            <p className={styles.statValue}>4</p>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3>Upcoming</h3>
            <p className={styles.statValue}>12</p>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3>Revenue (MTD)</h3>
            <p className={styles.statValue}>₹45,200</p>
          </div>
        </div>

        <div className={`glass-panel ${styles.recentBookings}`}>
          <h2 className="heading-luxury text-xl mb-4 text-[var(--accent-gold)]">Recent Bookings</h2>
          <p className="text-[var(--text-secondary)]">Mock table data will be populated from Firestore.</p>
        </div>
      </main>
    </div>
  );
}
