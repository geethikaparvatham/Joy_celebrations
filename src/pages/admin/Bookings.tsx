
import { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Settings, Users, Calendar as CalendarIcon, Ticket, Trash2, Search, Filter, ShieldAlert, MessageCircle } from "lucide-react";
import styles from "../Admin.module.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNotifications from "@/components/admin/AdminNotifications";
import LogoutButton from "./LogoutButton";

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

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [packageFilter, setPackageFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = () => {
      const existing = localStorage.getItem('joy_bookings');
      if (existing) {
        const parsedBookings = JSON.parse(existing);
        parsedBookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(parsedBookings);
      } else {
        setBookings([]);
      }
      setIsLoading(false);
    };
    
    loadBookings();
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'joy_bookings' || e.type === 'storage') {
        loadBookings();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleStatusChange = async (id: string, newStatus: "Pending" | "Confirmed" | "Cancelled") => {
    try {
      const existing = localStorage.getItem('joy_bookings');
      if (existing) {
        const parsedBookings = JSON.parse(existing);
        const updated = parsedBookings.map((b: any) => b.id === id ? { ...b, status: newStatus } : b);
        localStorage.setItem('joy_bookings', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }

    if (newStatus === "Confirmed") {
      const b = bookings.find(item => item.id === id);
      if (b && confirm(`Booking status set to Confirmed. Would you like to send a WhatsApp confirmation message to ${b.customerName}?`)) {
        const countryCode = "91";
        const customerPhoneClean = b.customerPhone.replace(/\D/g, "");
        const formattedPhone = customerPhoneClean.startsWith("91") && customerPhoneClean.length > 10 
          ? customerPhoneClean 
          : countryCode + customerPhoneClean;
        
        let msg = `Hello *${b.customerName}*,%0A%0A`;
        msg += `Your booking for *${b.packageName}* at *JOY Celebrations Private Theatre* is *Confirmed*! 🎉%0A%0A`;
        msg += `*Booking Details:*%0A`;
        msg += `📅 *Date:* ${b.date}%0A`;
        msg += `🕒 *Time Slot:* ${b.timeSlot}%0A`;
        msg += `🎈 *Occasion:* ${b.occasion}%0A`;
        msg += `💰 *Amount:* ₹${(b.totalAmount || 0).toLocaleString('en-IN')}%0A%0A`;
        msg += `We look forward to hosting your celebration! If you have any questions, feel free to reply here.%0A%0A`;
        msg += `Thank you,%0A*JOY Celebrations Team*`;

        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${msg}`;
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking record?")) {
      try {
        const existing = localStorage.getItem('joy_bookings');
        if (existing) {
          const parsedBookings = JSON.parse(existing);
          const updated = parsedBookings.filter((b: any) => b.id !== id);
          localStorage.setItem('joy_bookings', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        }
      } catch (err) {
        console.error("Error deleting booking:", err);
      }
    }
  };

  // Filter logic
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesPackage = packageFilter === "All" || b.packageName.toLowerCase() === packageFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPackage;
  });

  // Calculate statistics
  const totalBookingsCount = filteredBookings.length;
  const confirmedBookingsCount = filteredBookings.filter(b => b.status === "Confirmed").length;
  const totalRevenue = filteredBookings
    .filter(b => b.status === "Confirmed")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className={styles.container}>
      <AdminSidebar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className="heading-luxury text-2xl">Bookings Management</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Review, track, and update customer booking slots.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AdminNotifications />
            <div className={styles.userProfile}>Admin User</div>
            <LogoutButton />
          </div>
        </header>
        
        {/* Stats Section */}
        <div className={styles.statsGrid}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-gold)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Bookings</h3>
            <p className={styles.statValue}>{totalBookingsCount}</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #22C55E' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Confirmed Slots</h3>
            <p className={styles.statValue} style={{ color: '#22C55E' }}>{confirmedBookingsCount}</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-gold)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Revenue (Confirmed)</h3>
            <p className={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={14} style={{ color: 'var(--accent-gold)' }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.6rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All" style={{ background: '#111' }}>All Statuses</option>
                <option value="Pending" style={{ background: '#111' }}>Pending</option>
                <option value="Confirmed" style={{ background: '#111' }}>Confirmed</option>
                <option value="Cancelled" style={{ background: '#111' }}>Cancelled</option>
              </select>
            </div>

            {/* Package Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                style={{
                  padding: '0.6rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All" style={{ background: '#111' }}>All Packages</option>
                <option value="Plan 1" style={{ background: '#111' }}>Plan 1</option>
                <option value="Plan 2" style={{ background: '#111' }}>Plan 2</option>
                <option value="Plan 3" style={{ background: '#111' }}>Plan 3</option>
                <option value="Midnight Special" style={{ background: '#111' }}>Midnight Special</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List/Table */}
        <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
          {filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Ticket size={48} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 1rem' }} />
              <p className="text-[var(--text-secondary)]">No booking records found matching your filters.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Customer</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Package & Occasion</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Date & Timing</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Addons Selected</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Price & Pay Mode</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    {/* Customer */}
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <div style={{ fontWeight: 'bold', color: 'white' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{b.customerPhone}</div>
                    </td>
                    
                    {/* Package */}
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <div style={{ color: 'white' }}>{b.packageName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{b.occasion}</div>
                    </td>
                    
                    {/* Date */}
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <div style={{ color: 'white' }}>{b.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '2px' }}>{b.timeSlot}</div>
                    </td>
                    
                    {/* Addons */}
                    <td style={{ padding: '1.2rem 1rem', maxWidth: '250px' }}>
                      {b.addons && b.addons.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {b.addons.map((addon, i) => (
                            <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              {addon}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>None</span>
                      )}
                    </td>
                    
                    {/* Amount & Method */}
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>₹{(b.totalAmount || 0).toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{b.paymentMethod}</div>
                    </td>
                    
                    {/* Status Select dropdown */}
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                        style={{
                          padding: '0.3rem 0.5rem',
                          background: b.status === "Confirmed" ? 'rgba(34,197,94,0.1)' : b.status === "Pending" ? 'rgba(245,166,35,0.1)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${b.status === "Confirmed" ? '#22C55E' : b.status === "Pending" ? '#f5a623' : '#EF4444'}`,
                          borderRadius: '4px',
                          color: b.status === "Confirmed" ? '#22C55E' : b.status === "Pending" ? '#f5a623' : '#EF4444',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending" style={{ background: '#111', color: '#f5a623' }}>Pending</option>
                        <option value="Confirmed" style={{ background: '#111', color: '#22C55E' }}>Confirmed</option>
                        <option value="Cancelled" style={{ background: '#111', color: '#EF4444' }}>Cancelled</option>
                      </select>
                    </td>
                    
                    {/* Actions */}
                    <td style={{ padding: '1.2rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {/* WhatsApp Message */}
                        <button
                          onClick={() => {
                            const countryCode = "91";
                            const customerPhoneClean = b.customerPhone.replace(/\D/g, "");
                            const formattedPhone = customerPhoneClean.startsWith("91") && customerPhoneClean.length > 10 
                              ? customerPhoneClean 
                              : countryCode + customerPhoneClean;
                            
                            let msg = `Hello *${b.customerName}*,%0A%0A`;
                            msg += `Your booking for *${b.packageName}* at *JOY Celebrations Private Theatre* is *Confirmed*! 🎉%0A%0A`;
                            msg += `*Booking Details:*%0A`;
                            msg += `📅 *Date:* ${b.date}%0A`;
                            msg += `🕒 *Time Slot:* ${b.timeSlot}%0A`;
                            msg += `🎈 *Occasion:* ${b.occasion}%0A`;
                            msg += `💰 *Amount:* ₹${(b.totalAmount || 0).toLocaleString('en-IN')}%0A%0A`;
                            msg += `We look forward to hosting your celebration! If you have any questions, feel free to reply here.%0A%0A`;
                            msg += `Thank you,%0A*JOY Celebrations Team*`;

                            const whatsappUrl = `https://wa.me/${formattedPhone}?text=${msg}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                          style={{
                            background: 'rgba(37,211,102,0.1)',
                            border: '1px solid rgba(37,211,102,0.2)',
                            color: '#25D366',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            padding: '0.4rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(37,211,102,0.25)';
                            e.currentTarget.style.borderColor = '#25D366';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(37,211,102,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(37,211,102,0.2)';
                          }}
                          title="Send Confirmation via WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#EF4444',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            padding: '0.4rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.25)';
                            e.currentTarget.style.borderColor = '#EF4444';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
                          }}
                          title="Delete Booking"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
