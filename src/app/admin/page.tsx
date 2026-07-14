import { Settings, Users, Calendar, LayoutDashboard, Ticket } from "lucide-react";
import styles from "./page.module.css";
import LogoutButton from "./LogoutButton";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <AdminSidebar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className="heading-luxury text-2xl">Overview</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.userProfile}>Admin User</div>
            <LogoutButton />
          </div>
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
