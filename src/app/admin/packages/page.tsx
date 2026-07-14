"use client";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import LogoutButton from "../../admin/LogoutButton";
import AdminNotifications from "../../../components/admin/AdminNotifications";
import PackagesManager from "./PackagesManager";
import styles from "../../admin/page.module.css";

export default function AdminPackagesPage() {
  return (
    <div className={styles.container}>
      <AdminSidebar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className="heading-luxury text-2xl">Manage Packages</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AdminNotifications />
            <div className={styles.userProfile}>Admin User</div>
            <LogoutButton />
          </div>
        </header>
        
        <PackagesManager />
      </main>
    </div>
  );
}
