import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bell, X, CheckCheck, Ticket, Check } from "lucide-react";
import ToastNotification from './ToastNotification';

type Notification = {
  id: string;
  _id?: string;
  notifId?: string;
  type: string;
  title: string;
  message: string;
  customerName: string;
  customerPhone: string;
  packageName: string;
  packageId?: string;
  occasion: string;
  date: string;
  timeSlot: string;
  addons?: string[] | string;
  totalAmount: number;
  read: boolean;
  createdAt: string;
  status?: string;
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestToast, setLatestToast] = useState<Notification | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevUnreadCount = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  // Play a big, attention-grabbing notification sound using HTML5 Audio
  const playNotificationSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.warn('Browser blocked audio playback. User must click on the page first:', err);
        });
      }
    } catch (err) {
      console.warn('Could not play notification sound:', err);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications: Notification[] = [];
      let newUnreadCount = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const notification: Notification = {
          id: doc.id,
          title: "New Booking Request",
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          packageName: data.packageName,
          packageId: data.packageId,
          occasion: data.occasion,
          date: data.date,
          timeSlot: data.timeSlot,
          addons: data.addons,
          totalAmount: data.totalAmount,
          read: data.read || false,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          status: data.status,
          ...data
        };
        newNotifications.push(notification);
        if (!notification.read) {
          newUnreadCount++;
        }
      });
      
      if (!isFirstLoad.current && newUnreadCount > prevUnreadCount.current) {
        playNotificationSound();
        const newest = newNotifications.find(n => !n.read && (!latestToast || n.id !== latestToast.id));
        if (newest) {
          setLatestToast(newest);
        }
      }

      prevUnreadCount.current = newUnreadCount;
      isFirstLoad.current = false;
      setNotifications(newNotifications);
    }, (error) => {
      console.error("Error fetching notifications:", error);
      isFirstLoad.current = false;
    });

    return () => unsubscribe();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      const docRef = doc(db, "bookings", id);
      await updateDoc(docRef, { read: true });
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleBookingAction = async (notificationId: string, action: "Confirmed" | "Cancelled") => {
    try {
      const docRef = doc(db, "bookings", notificationId);
      await updateDoc(docRef, { 
        status: action, 
        read: true 
      });
      
      // Update local joy_plans if Confirmed (Legacy compatibility)
      if (action === "Confirmed") {
        const notif = notifications.find(n => n.id === notificationId);
        const plansData = localStorage.getItem('joy_plans');
        if (plansData && notif) {
          const plans = JSON.parse(plansData);
          const planToUpdate = plans.find((p: any) => p.id === notif.packageId || p.name === notif.packageName);
          if (planToUpdate) {
            const bookedByDate = planToUpdate.bookedSlotsByDate || {};
            const currentForDate = bookedByDate[notif.date] || [];
            if (!currentForDate.includes(notif.timeSlot)) {
              planToUpdate.bookedSlotsByDate = {
                ...bookedByDate,
                [notif.date]: [...currentForDate, notif.timeSlot]
              };
              const updatedPlans = plans.map((p: any) => p.id === planToUpdate.id ? planToUpdate : p);
              localStorage.setItem('joy_plans', JSON.stringify(updatedPlans));
              window.dispatchEvent(new Event('storage'));
            }
          }
        }
      }
    } catch (err) {
      console.error("Error updating booking action:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.read);
      // We process them in a loop or batch. A simple loop is fine for admin portal.
      for (const n of unreadNotifs) {
        const docRef = doc(db, "bookings", n.id);
        await updateDoc(docRef, { read: true });
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: "relative",
          background: isOpen ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${isOpen ? "var(--accent-gold)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "8px",
          color: isOpen ? "var(--accent-gold)" : "rgba(255,255,255,0.7)",
          padding: "0.5rem 0.7rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.85rem",
          transition: "all 0.2s",
        }}
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "#EF4444",
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            fontSize: "0.65rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--bg-primary)",
            animation: "pulse 2s infinite"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          width: "390px",
          maxHeight: "520px",
          background: "#1a1a1a",
          border: "1px solid rgba(212,175,55,0.3)",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          zIndex: 1000,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{
            padding: "1rem 1.2rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(212,175,55,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bell size={16} color="var(--accent-gold)" />
              <span style={{ fontWeight: "bold", color: "white", fontSize: "0.95rem" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span style={{
                  background: "#EF4444",
                  color: "white",
                  borderRadius: "10px",
                  padding: "0.1rem 0.45rem",
                  fontSize: "0.7rem",
                  fontWeight: "bold"
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent-gold)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}
                >
                  <CheckCheck size={14} /> All read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "0.2rem" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
                <Bell size={36} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 1rem" }} />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>No notifications yet</p>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem", marginTop: "0.25rem" }}>New bookings will appear here</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  style={{
                    padding: "1rem 1.2rem",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: n.read ? "transparent" : "rgba(212,175,55,0.06)",
                    cursor: n.read ? "default" : "pointer",
                    transition: "background 0.2s",
                    borderLeft: n.read ? "3px solid transparent" : "3px solid var(--accent-gold)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{
                        width: "28px", height: "28px",
                        background: n.read ? "rgba(255,255,255,0.05)" : "rgba(212,175,55,0.15)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        <Ticket size={13} color={n.read ? "rgba(255,255,255,0.4)" : "var(--accent-gold)"} />
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: n.read ? "rgba(255,255,255,0.6)" : "white" }}>
                        {n.title}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", flexShrink: 0, marginLeft: "0.5rem" }}>
                      {formatTime(n.createdAt)}
                    </span>
                  </div>

                  <div style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: "1.6",
                    marginLeft: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem"
                  }}>
                    <div><strong>Name:</strong> {n.customerName}</div>
                    <div><strong>Phone:</strong> {n.customerPhone}</div>
                    <div><strong>Date & Time:</strong> {n.date} | {n.timeSlot}</div>
                    <div><strong>Package:</strong> {n.packageName}</div>
                    <div><strong>Occasion:</strong> {n.occasion}</div>
                    {n.addons && (Array.isArray(n.addons) ? n.addons.length > 0 : n.addons !== '') && (
                      <div><strong>Addons:</strong> {Array.isArray(n.addons) ? n.addons.join(', ') : n.addons}</div>
                    )}
                    <div style={{
                      borderTop: "1px solid rgba(212,175,55,0.3)", 
                      paddingTop: "0.5rem", 
                      marginTop: "0.2rem", 
                      fontWeight: "bold", 
                      color: "var(--accent-gold)",
                      fontSize: "1rem"
                    }}>
                      Total Estimate: ₹{(n.totalAmount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {(!n.status || n.status === "pending") && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginLeft: "2rem" }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleBookingAction(n.id, "Confirmed"); }} 
                        style={{ background: '#22C55E', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
                      >
                        <Check size={16} /> Accept Booking
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleBookingAction(n.id, "Cancelled"); }} 
                        style={{ background: '#EF4444', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
                      >
                        <X size={16} /> Reject Booking
                      </button>
                    </div>
                  )}
                  {n.status && n.status !== "pending" && (
                    <div style={{ marginLeft: "2rem" }}>
                      <div style={{ 
                        marginTop: '1.5rem', 
                        padding: '0.4rem 0.8rem', 
                        background: n.status === "Confirmed" ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: n.status === "Confirmed" ? '#22C55E' : '#EF4444',
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {n.status === "Confirmed" ? "✓ Accepted" : "✗ Rejected"}
                      </div>
                    </div>
                  )}

                  {!n.read && n.status !== "pending" && (
                    <div style={{ marginLeft: "2rem", marginTop: "0.6rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "rgba(212,175,55,0.6)" }}>
                        Tap anywhere to dismiss
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Top Right Animated Toast */}
      {latestToast && (
        <ToastNotification 
          booking={latestToast} 
          onClose={() => setLatestToast(null)} 
          onAccept={(id) => { handleBookingAction(id, "Confirmed"); setLatestToast(null); }}
          onReject={(id) => { handleBookingAction(id, "Cancelled"); setLatestToast(null); }}
        />
      )}
    </div>
  );
}
