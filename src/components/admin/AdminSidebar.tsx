"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Users, Calendar, LayoutDashboard, Ticket, Package } from "lucide-react";
import styles from "../../app/admin/page.module.css";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>Admin Panel</div>
      <nav className={styles.nav}>
        <Link href="/admin" className={`${styles.navItem} ${pathname === '/admin' ? styles.active : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/admin/packages" className={`${styles.navItem} ${pathname.includes('/packages') ? styles.active : ''}`}>
          <Package size={20} /> Packages & Timings
        </Link>
        <Link href="/admin/bookings" className={`${styles.navItem} ${pathname.includes('/bookings') ? styles.active : ''}`}>
          <Ticket size={20} /> Bookings
        </Link>
        <Link href="/admin/calendar" className={`${styles.navItem} ${pathname.includes('/calendar') ? styles.active : ''}`}>
          <Calendar size={20} /> Calendar
        </Link>
        <Link href="/admin/customers" className={`${styles.navItem} ${pathname.includes('/customers') ? styles.active : ''}`}>
          <Users size={20} /> Customers
        </Link>
        <Link href="/admin/settings" className={`${styles.navItem} ${pathname.includes('/settings') ? styles.active : ''}`}>
          <Settings size={20} /> Settings
        </Link>
      </nav>
    </aside>
  );
}
