
import { useState, useEffect } from "react";
import { LayoutDashboard, Ticket, Clock, Users, IndianRupee } from "lucide-react";
import styles from "@/page.module.css";
import LogoutButton from "./admin/LogoutButton";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNotifications from "@/components/admin/AdminNotifications";
import { Link } from 'react-router-dom';

type Booking = {
  id: string;
  customerName: string;
  customerPhone: string;
  packageName: string;
  occasion: string;
  date: string;
  timeSlot: string;
  addons: string[];
  totalAmount: number;
  paymentMethod: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = bookings.filter(b => b.date === todayStr && b.status === "Confirmed").length;
  
  const upcomingBookingsCount = bookings.filter(b => {
    return new Date(b.date).getTime() >= new Date(todayStr).getTime() && b.status === "Confirmed";
  }).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const mtdRevenue = bookings
    .filter(b => {
      if (b.status !== "Confirmed" || !b.createdAt) return false;
      const createdDate = new Date(b.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    })
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Get recent 5 confirmed bookings
  const recentBookings = bookings.filter(b => b.status === "Confirmed").slice(0, 5);

  return (
    <div className={styles.container}>
      <AdminSidebar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className="heading-luxury text-2xl">Overview</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AdminNotifications />
            <div className={styles.userProfile}>Admin User</div>
            <LogoutButton />
          </div>
        </header>
        
        <div className={styles.statsGrid}>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3>Today's Bookings</h3>
            <p className={styles.statValue}>{todayBookingsCount}</p>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3>Upcoming</h3>
            <p className={styles.statValue}>{upcomingBookingsCount}</p>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3>Revenue (MTD)</h3>
            <p className={styles.statValue}>₹{mtdRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className={`glass-panel ${styles.recentBookings}`} style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="heading-luxury text-xl text-[var(--accent-gold)]">Recent Bookings</h2>
            <Link to="/admin/bookings" style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textDecoration: 'underline' }}>
              View All Bookings
            </Link>
          </div>
          
          {recentBookings.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No bookings found in database yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <th style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Customer</th>
                    <th style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Plan</th>
                    <th style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Date & Slot</th>
                    <th style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Amount</th>
                    <th style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem' }}>
                        <div style={{ fontWeight: 'bold' }}>{b.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{b.customerPhone}</div>
                      </td>
                      <td style={{ padding: '0.8rem' }}>{b.packageName}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <div>{b.date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>{b.timeSlot}</div>
                      </td>
                      <td style={{ padding: '0.8rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>₹{b.totalAmount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          color: b.status === 'Confirmed' ? '#22C55E' : b.status === 'Pending' ? '#f5a623' : '#EF4444',
                          background: b.status === 'Confirmed' ? 'rgba(34,197,94,0.1)' : b.status === 'Pending' ? 'rgba(245,166,35,0.1)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${b.status === 'Confirmed' ? '#22C55E' : b.status === 'Pending' ? '#f5a623' : '#EF4444'}`,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
