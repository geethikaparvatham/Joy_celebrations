
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Settings, Users, Calendar, LayoutDashboard, Ticket, Package } from "lucide-react";
import styles from "@/page.module.css";

export default function AdminSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>Admin Panel</div>
      <nav className={styles.nav}>
        <Link to="/admin" className={`${styles.navItem} ${pathname === '/admin' ? styles.active : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/admin/packages" className={`${styles.navItem} ${pathname.includes('/packages') ? styles.active : ''}`}>
          <Package size={20} /> Packages & Timings
        </Link>
        <Link to="/admin/bookings" className={`${styles.navItem} ${pathname.includes('/bookings') ? styles.active : ''}`}>
          <Ticket size={20} /> Bookings
        </Link>
        <Link to="/admin/customers" className={`${styles.navItem} ${pathname.includes('/customers') ? styles.active : ''}`}>
          <Users size={20} /> Customers
        </Link>
        <Link to="/admin/settings" className={`${styles.navItem} ${pathname.includes('/settings') ? styles.active : ''}`}>
          <Settings size={20} /> Settings
        </Link>
      </nav>
    </aside>
  );
}
