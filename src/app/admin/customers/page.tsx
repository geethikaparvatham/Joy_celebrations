"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Users, Search, ChevronDown, ChevronUp, Calendar, Ticket, ShoppingBag, ArrowUpDown } from "lucide-react";
import styles from "../page.module.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNotifications from "../../../components/admin/AdminNotifications";
import LogoutButton from "../LogoutButton";

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

type Customer = {
  phone: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  bookings: Booking[];
};

export default function CustomersManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"spent" | "orders" | "name">("spent");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];
        setBookings(fetched);
      } else {
        setBookings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Process bookings to group by customer phone
  const processCustomers = (): Customer[] => {
    const customerMap: Record<string, Customer> = {};

    bookings.forEach((b) => {
      const phone = b.customerPhone || "N/A";
      const spentAmount = b.status === "Confirmed" ? (b.totalAmount || 0) : 0;
      
      if (!customerMap[phone]) {
        customerMap[phone] = {
          phone,
          name: b.customerName || "Customer",
          totalOrders: 0,
          totalSpent: 0,
          bookings: []
        };
      }

      // Update name to the latest booking's name if we have a valid timestamp
      const existingLatestBooking = customerMap[phone].bookings[0];
      if (!existingLatestBooking || new Date(b.createdAt || b.date).getTime() > new Date(existingLatestBooking.createdAt || existingLatestBooking.date).getTime()) {
        customerMap[phone].name = b.customerName || "Customer";
      }

      customerMap[phone].totalOrders += 1;
      customerMap[phone].totalSpent += spentAmount;
      customerMap[phone].bookings.push(b);
    });

    // Sort individual bookings within each customer by date desc
    Object.values(customerMap).forEach(c => {
      c.bookings.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
    });

    return Object.values(customerMap);
  };

  const customersList = processCustomers();

  // Filter list by search term
  const filteredCustomers = customersList.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  // Sort list
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === "spent") {
      return b.totalSpent - a.totalSpent;
    } else if (sortBy === "orders") {
      return b.totalOrders - a.totalOrders;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const toggleExpand = (phone: string) => {
    if (expandedCustomer === phone) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(phone);
    }
  };

  return (
    <div className={styles.container}>
      <AdminSidebar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className="heading-luxury text-2xl">Customers Directory</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">View customer order histories and purchase metrics.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AdminNotifications />
            <div className={styles.userProfile}>Admin User</div>
            <LogoutButton />
          </div>
        </header>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-gold)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Unique Customers</h3>
            <p className={styles.statValue}>{customersList.length}</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-gold)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Customer Orders</h3>
            <p className={styles.statValue}>{bookings.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input
              type="text"
              placeholder="Search by customer name or phone..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
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
              <option value="spent" style={{ background: '#111' }}>Total Spent (High to Low)</option>
              <option value="orders" style={{ background: '#111' }}>Total Orders (High to Low)</option>
              <option value="name" style={{ background: '#111' }}>Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Customers Table */}
        <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
          {sortedCustomers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Users size={48} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 1rem' }} />
              <p className="text-[var(--text-secondary)]">No customer records found matching search query.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Customer Name</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Phone Number</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem', textAlign: 'center' }}>Total Bookings</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>Total Spent (Confirmed)</th>
                  <th style={{ padding: '1rem', color: 'var(--accent-gold)', fontSize: '0.9rem', textAlign: 'right' }}>Booking History</th>
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((c) => {
                  const isExpanded = expandedCustomer === c.phone;
                  return (
                    <>
                      {/* Customer Row */}
                      <tr 
                        key={c.phone} 
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s' }}
                        onClick={() => toggleExpand(c.phone)}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 'bold', color: 'white' }}>{c.name}</td>
                        <td style={{ padding: '1.2rem 1rem', color: 'var(--text-secondary)' }}>{c.phone}</td>
                        <td style={{ padding: '1.2rem 1rem', textAlign: 'center', color: 'white' }}>{c.totalOrders}</td>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                          ₹{c.totalSpent.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '1.2rem 1rem', textAlign: 'right' }}>
                          <button
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--accent-gold)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.85rem'
                            }}
                          >
                            {isExpanded ? "Hide Details" : "View History"}
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Order Details Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} style={{ background: 'rgba(0,0,0,0.15)', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <ShoppingBag size={14} /> Purchase & Booking History
                              </h4>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                {c.bookings.map((booking) => (
                                  <div 
                                    key={booking.id} 
                                    className="glass-panel" 
                                    style={{ 
                                      padding: '1.2rem', 
                                      borderRadius: '8px', 
                                      border: '1px solid rgba(255,255,255,0.05)',
                                      background: 'rgba(255,255,255,0.02)',
                                      position: 'relative'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                      <div>
                                        <div style={{ fontWeight: 'bold', color: 'white', fontSize: '0.95rem' }}>{booking.packageName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{booking.occasion}</div>
                                      </div>
                                      <span style={{ 
                                        fontSize: '0.7rem', 
                                        fontWeight: 'bold',
                                        color: booking.status === 'Confirmed' ? '#22C55E' : booking.status === 'Pending' ? '#f5a623' : '#EF4444',
                                        background: booking.status === 'Confirmed' ? 'rgba(34,197,94,0.1)' : booking.status === 'Pending' ? 'rgba(245,166,35,0.1)' : 'rgba(239,68,68,0.1)',
                                        border: `1px solid ${booking.status === 'Confirmed' ? '#22C55E' : booking.status === 'Pending' ? '#f5a623' : '#EF4444'}`,
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '4px'
                                      }}>
                                        {booking.status}
                                      </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={12} style={{ color: 'var(--accent-gold)' }} />
                                        <span>{booking.date} | <span style={{ color: 'white' }}>{booking.timeSlot}</span></span>
                                      </div>
                                      
                                      {booking.addons && booking.addons.length > 0 && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', marginBottom: '0.2rem' }}>Add-ons:</div>
                                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                                            {booking.addons.map((add, i) => (
                                              <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                                                {add}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{ fontSize: '0.75rem' }}>Paid via: {booking.paymentMethod}</span>
                                        <span style={{ fontWeight: 'bold', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
