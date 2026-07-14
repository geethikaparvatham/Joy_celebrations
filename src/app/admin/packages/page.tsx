import AdminSidebar from "../../../components/admin/AdminSidebar";
import LogoutButton from "../../admin/LogoutButton";
import PackagesManager from "./PackagesManager";
import styles from "../../admin/page.module.css";

export const metadata = {
  title: "Packages & Timings - Admin | Joy Celebrations",
  description: "Manage packages and timings for Joy Celebrations",
};

export default function AdminPackagesPage() {
  return (
    <div className={styles.container}>
      <AdminSidebar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className="heading-luxury text-2xl">Manage Packages</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.userProfile}>Admin User</div>
            <LogoutButton />
          </div>
        </header>
        
        <PackagesManager />
      </main>
    </div>
  );
}
