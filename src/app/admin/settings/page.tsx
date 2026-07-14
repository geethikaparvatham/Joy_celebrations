"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, getDoc, setDoc, deleteDoc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Settings, Lock, User, Clock, ShieldAlert, KeyRound, AlertCircle, RefreshCw } from "lucide-react";
import styles from "../page.module.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import LogoutButton from "../LogoutButton";

type LoginLog = {
  id: string;
  username: string;
  timestamp: string;
  userAgent: string;
  ip: string;
};

export default function SettingsPage() {
  const [username, setUsername] = useState("joycelebrations@gmail.com");
  const [password, setPassword] = useState("joyteam@123");
  const [confirmPassword, setConfirmPassword] = useState("joyteam@123");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);

  // Load current admin credentials & login history
  useEffect(() => {
    // Safety timer to force-dismiss spinner after 3 seconds
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // 1. Fetch credentials via onSnapshot (fires immediately, handles failure quickly)
    const credsUnsubscribe = onSnapshot(doc(db, "admin_settings", "credentials"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.username) setUsername(data.username);
        if (data.password) {
          setPassword(data.password);
          setConfirmPassword(data.password);
        }
      }
      setIsLoading(false);
      clearTimeout(safetyTimeout);
    }, (error) => {
      console.error("Error loading credentials:", error);
      setIsLoading(false);
      clearTimeout(safetyTimeout);
    });

    // 2. Listen to login timings log (real-time sync)
    const logsUnsubscribe = onSnapshot(collection(db, "login_logs"), (snapshot) => {
      const fetchedLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginLog[];
      
      // Sort by timestamp desc
      fetchedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLoginLogs(fetchedLogs);
    }, (error) => {
      console.error("Error loading login logs:", error);
    });

    return () => {
      credsUnsubscribe();
      logsUnsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);

    if (!username.trim()) {
      setSaveError("Username cannot be empty.");
      return;
    }

    if (!password.trim()) {
      setSaveError("Password cannot be empty.");
      return;
    }

    if (password !== confirmPassword) {
      setSaveError("Passwords do not match.");
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(doc(db, "admin_settings", "credentials"), {
        username: username.trim(),
        password: password.trim(),
        updatedAt: new Date().toISOString()
      });
      setSaveSuccess(true);
    } catch (err) {
      console.error("Error saving credentials:", err);
      setSaveError("Failed to update credentials in database.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearLogs = async () => {
    if (confirm("Are you sure you want to clear the entire login timings log history?")) {
      try {
        const querySnapshot = await getDocs(collection(db, "login_logs"));
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      } catch (err) {
        console.error("Error clearing logs:", err);
        alert("Failed to clear logs.");
      }
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className={styles.container}>
      <AdminSidebar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className="heading-luxury text-2xl">Portal Settings</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Configure admin credentials and monitor session login logs.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.userProfile}>Admin User</div>
            <LogoutButton />
          </div>
        </header>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <RefreshCw className="animate-spin" size={24} style={{ color: 'var(--accent-gold)' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Credentials Block */}
            <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
              <h2 className="heading-luxury text-xl mb-6 text-[var(--accent-gold)]" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <KeyRound size={20} /> Login Credentials
              </h2>
              
              <form onSubmit={handleSaveCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {saveError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <AlertCircle size={16} />
                    <span>{saveError}</span>
                  </div>
                )}
                
                {saveSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', padding: '0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <AlertCircle size={16} />
                    <span>Admin credentials updated successfully!</span>
                  </div>
                )}

                {/* Username */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Username / Email</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem 0.6rem 2.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem 0.6rem 2.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem 0.6rem 2.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    background: 'var(--accent-gold)',
                    color: 'black',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    marginTop: '0.5rem'
                  }}
                  onMouseEnter={(e) => { if(!isSaving) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                >
                  {isSaving ? "Saving..." : "Save Credentials"}
                </button>
              </form>
            </div>

            {/* Login Logs Block */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="heading-luxury text-xl text-[var(--accent-gold)]" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
                  <Clock size={20} /> Login Timings Log
                </h2>
                {loginLogs.length > 0 && (
                  <button
                    onClick={handleClearLogs}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#EF4444',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    Clear Logs
                  </button>
                )}
              </div>

              {loginLogs.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  <ShieldAlert size={36} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '0.8rem' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>No login logs available yet.</p>
                </div>
              ) : (
                <div style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '0.6rem 0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Login Date & Time</th>
                        <th style={{ padding: '0.6rem 0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Browser</th>
                        <th style={{ padding: '0.6rem 0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '0.8rem', fontSize: '0.8rem', color: 'white', fontWeight: '500' }}>
                            {formatTimestamp(log.timestamp)}
                          </td>
                          <td style={{ padding: '0.8rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {log.userAgent}
                          </td>
                          <td style={{ padding: '0.8rem', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                            {log.ip}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
