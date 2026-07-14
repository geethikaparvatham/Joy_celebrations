"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck, Ticket } from "lucide-react";

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
  occasion: string;
  date: string;
  timeSlot: string;
  addons?: string[] | string;
  totalAmount: number;
  bookingId: string;
  read: boolean;
  createdAt: string;
  action?: string;
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevUnreadCount = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  // Play a big, attention-grabbing notification sound using Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq: number, startTime: number, duration: number, volume: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      // Loud chime sequence: C5 → E5 → G5 → C6 (triumphant chord arpeggio)
      playTone(523.25, now + 0.0,  0.4, 0.9); // C5
      playTone(659.25, now + 0.15, 0.4, 0.9); // E5
      playTone(783.99, now + 0.3,  0.4, 0.9); // G5
      playTone(1046.5, now + 0.45, 0.7, 1.0); // C6 (loud + long)
      // Second wave for emphasis
      playTone(1046.5, now + 0.7,  0.3, 0.7);
      playTone(783.99, now + 0.9,  0.3, 0.6);
    } catch (err) {
      console.warn('Could not play notification sound:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) {
        const newNotifications: Notification[] = data.notifications;
        const newUnreadCount = newNotifications.filter((n: Notification) => !n.read).length;

        // Play sound if unread count INCREASED (new notification arrived)
        // Skip on first load to avoid sound on page open
        if (!isFirstLoad.current && newUnreadCount > prevUnreadCount.current) {
          playNotificationSound();
        }

        prevUnreadCount.current = newUnreadCount;
        isFirstLoad.current = false;
        setNotifications(newNotifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Poll every 3 seconds for near-instant new notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
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
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleBookingAction = async (notificationId: string, bookingId: string, action: "Confirmed" | "Cancelled") => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: action, notificationId })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true, action } : n));
      }
    } catch (err) {
      console.error("Error updating booking action:", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => markAsRead(n.id)));
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
        onClick={() => { setIsOpen(prev => !prev); if (!isOpen) fetchNotifications(); }}
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

                  {!n.action && (
                    <div style={{ marginLeft: "2rem", marginTop: "0.8rem", display: "flex", gap: "0.5rem" }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleBookingAction(n.id, n.bookingId, "Confirmed"); }} 
                        style={{ padding: "0.4rem 1rem", background: "#22C55E", color: "white", border: "none", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold", cursor: "pointer", transition: "transform 0.1s" }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Allow
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleBookingAction(n.id, n.bookingId, "Cancelled"); }} 
                        style={{ padding: "0.4rem 1rem", background: "#EF4444", color: "white", border: "none", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold", cursor: "pointer", transition: "transform 0.1s" }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Deny
                      </button>
                    </div>
                  )}
                  {n.action && (
                    <div style={{ marginLeft: "2rem", marginTop: "0.6rem" }}>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        color: n.action === "Confirmed" ? "#22C55E" : "#EF4444", 
                        fontWeight: "bold",
                        background: n.action === "Confirmed" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px"
                      }}>
                        {n.action === "Confirmed" ? "✓ Allowed" : "✗ Denied"}
                      </span>
                    </div>
                  )}

                  {!n.read && !n.action && (
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
    </div>
  );
}
