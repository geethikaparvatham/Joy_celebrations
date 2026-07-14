"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Plus, Edit2, Trash2, X, Check, Clock, Users } from "lucide-react";
import styles from "../page.module.css";
import frontendStyles from "../../packages/page.module.css";

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  members: string;
  features: string[];
  timings: string[];
  bookedSlots?: string[];
  isPopular?: boolean;
  isMidnight?: boolean;
};

export default function PackagesManager() {
  const defaultPlans = [
    {
      id: "default-1",
      name: "PLAN 1",
      price: 599,
      duration: "1 Hour",
      members: "Up to 4 Members",
      features: ["Perfect for Private Movie Experience", "Large Screen Projection", "Premium Sound System"],
      timings: [
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", 
        "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", 
        "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM", 
        "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM", "12:00 AM - 01:00 AM", 
        "01:00 AM - 02:00 AM"
      ],
      bookedSlots: ["12:00 PM - 01:00 PM", "06:00 PM - 07:00 PM"],
      isPopular: false,
      isMidnight: false
    },
    {
      id: "default-2",
      name: "PLAN 2",
      price: 1300,
      duration: "1 Hour",
      members: "Up to 4 Members",
      features: ["Premium Decoration", "Customized Name Board", "LED Letters", "1 Kg Cake OR Half Kg Cool Cake"],
      timings: [
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", 
        "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", 
        "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM", 
        "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM", "12:00 AM - 01:00 AM", 
        "01:00 AM - 02:00 AM"
      ],
      bookedSlots: ["02:00 PM - 03:00 PM", "08:00 PM - 09:00 PM"],
      isPopular: true,
      isMidnight: false
    },
    {
      id: "default-3",
      name: "PLAN 3",
      price: 2500,
      duration: "2 Hours",
      members: "Up to 10 Members",
      features: ["Premium Decoration", "Birthday Video", "Fog Effect", "LED Letters & Name Board"],
      timings: [
        "09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM", "03:00 PM - 05:00 PM", 
        "05:00 PM - 07:00 PM", "07:00 PM - 09:00 PM", "09:00 PM - 11:00 PM", "11:00 PM - 01:00 AM", 
        "12:00 AM - 02:00 AM"
      ],
      bookedSlots: ["07:00 PM - 09:00 PM"],
      isPopular: false,
      isMidnight: false
    },
    {
      id: "default-4",
      name: "Midnight Special",
      price: 2500,
      duration: "1 Hour",
      members: "Up to 10 Members",
      features: ["Exclusive Midnight Slot", "Premium Decoration", "Birthday Video", "Fog Effect", "LED Letters", "Special Cake"],
      timings: ["11:00 PM - 12:00 AM", "12:00 AM - 01:00 AM", "01:00 AM - 02:00 AM"],
      bookedSlots: [],
      isPopular: false,
      isMidnight: true
    }
  ];

  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [members, setMembers] = useState("");
  
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const [timings, setTimings] = useState<string[]>([]);
  const [newTiming, setNewTiming] = useState("");
  
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [newBookedSlot, setNewBookedSlot] = useState("");
  
  const [isPopular, setIsPopular] = useState(false);
  const [isMidnight, setIsMidnight] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "plans"), (snapshot) => {
      const fetchedPlans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Plan[];
      setPlans(fetchedPlans);
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDuration("");
    setMembers("");
    setFeatures([]);
    setNewFeature("");
    setTimings([]);
    setNewTiming("");
    setBookedSlots([]);
    setNewBookedSlot("");
    setIsPopular(false);
    setIsMidnight(false);
    setEditingPlan(null);
  };

  const openModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setName(plan.name);
      setPrice(plan.price.toString());
      setDuration(plan.duration || "");
      setMembers(plan.members || "");
      setFeatures(plan.features || []);
      setTimings(plan.timings || []);
      setBookedSlots(plan.bookedSlots || []);
      setIsPopular(plan.isPopular || false);
      setIsMidnight(plan.isMidnight || false);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFeatures(features.filter(f => f !== featureToRemove));
  };

  const handleAddTiming = () => {
    if (newTiming.trim() && !timings.includes(newTiming.trim())) {
      setTimings([...timings, newTiming.trim()]);
      setNewTiming("");
    }
  };

  const handleRemoveTiming = (timingToRemove: string) => {
    setTimings(timings.filter(t => t !== timingToRemove));
  };

  const handleAddBookedSlot = () => {
    if (newBookedSlot.trim() && !bookedSlots.includes(newBookedSlot.trim())) {
      setBookedSlots([...bookedSlots, newBookedSlot.trim()]);
      setNewBookedSlot("");
    }
  };

  const handleRemoveBookedSlot = (slotToRemove: string) => {
    setBookedSlots(bookedSlots.filter(s => s !== slotToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const planData = {
      name,
      price: Number(price),
      duration,
      members,
      features,
      timings,
      bookedSlots,
      isPopular,
      isMidnight
    };

    try {
      if (editingPlan) {
        await updateDoc(doc(db, "plans", editingPlan.id), planData);
      } else {
        await addDoc(collection(db, "plans"), planData);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Failed to save plan. Please check your permissions and try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      try {
        await deleteDoc(doc(db, "plans", id));
      } catch (error) {
        console.error("Error deleting plan:", error);
        alert("Failed to delete plan.");
      }
    }
  };

  const handleSeed = async () => {
    // Disabled since we hardcoded defaultPlans into state
  };

  useEffect(() => {
    // Disabled auto-seeding to database to prevent errors since it's disabled.
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => openModal()} className="btn-primary" style={{ padding: '0.6rem 1.2rem', gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <Plus size={18} /> Add New Plan
        </button>
      </div>

      <div className={frontendStyles.grid} style={{ marginTop: '2rem' }}>
        {plans.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', gridColumn: '1 / -1' }}>
            <p className="text-[var(--text-secondary)]">No plans found. Add one to get started.</p>
          </div>
        ) : (
          plans.map(plan => (
            <div key={plan.id} className={`${frontendStyles.card} ${plan.isMidnight ? frontendStyles.midnightCard : ''} ${plan.isPopular ? frontendStyles.popularCard : ''}`} style={{ position: 'relative' }}>
              {plan.isMidnight && <div className={frontendStyles.midnightBadge}>MIDNIGHT</div>}
              
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                <button onClick={() => openModal(plan)} style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', borderRadius: '4px', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Edit Plan">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(plan.id)} style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Delete Plan">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h2 className={frontendStyles.planName} style={{ marginTop: plan.isMidnight ? '1rem' : '0' }}>{plan.name}</h2>
              <div className={frontendStyles.price}>
                <span>₹</span>{plan.price}
              </div>
              
              <ul className={frontendStyles.features}>
                <li>
                  <Clock size={18} className={frontendStyles.featureIcon} />
                  {plan.duration}
                </li>
                <li>
                  <Users size={18} className={frontendStyles.featureIcon} />
                  {plan.members}
                </li>
                {plan.features?.map((feature, i) => (
                  <li key={i}>
                    <Check size={16} className={frontendStyles.featureIconCheck} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {((plan.timings && plan.timings.length > 0) || (plan.bookedSlots && plan.bookedSlots.length > 0)) && (
                <div style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '8px',
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}>
                  {plan.timings && plan.timings.filter(t => !plan.bookedSlots?.includes(t)).length > 0 && (
                    <>
                      <p className="text-sm font-bold mb-3" style={{ color: 'var(--accent-gold)' }}>Choose Your Slot -</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: plan.bookedSlots && plan.bookedSlots.length > 0 ? '1rem' : '0' }}>
                        {plan.timings.filter(t => !plan.bookedSlots?.includes(t)).map((time, idx) => (
                          <span key={`avail-${idx}`} style={{ 
                            background: 'rgba(212,175,55,0.1)', 
                            border: '1px solid rgba(212,175,55,0.3)', 
                            padding: '0.6rem 0.8rem', 
                            borderRadius: '6px', 
                            fontSize: '0.8rem', 
                            color: 'var(--text-primary)', 
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}>
                            {time}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {plan.bookedSlots && plan.bookedSlots.length > 0 && (
                    <>
                      <p className="text-sm font-bold mb-3 mt-2" style={{ color: '#EF4444' }}>Booked Slots -</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                        {plan.bookedSlots.map((time, idx) => (
                          <span key={`booked-${idx}`} style={{ 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            padding: '0.6rem 0.8rem', 
                            borderRadius: '6px', 
                            fontSize: '0.8rem', 
                            color: '#666', 
                            textAlign: 'center',
                            textDecoration: 'line-through',
                            opacity: 0.6,
                            whiteSpace: 'nowrap'
                          }}>
                            {time}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <button className={`btn-primary ${frontendStyles.bookBtn}`} style={{ cursor: 'default' }}>
                BOOK NOW
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h2 className="heading-luxury text-2xl text-[var(--accent-gold)] mb-6">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Plan Name</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Couple Plan" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Price (₹)</label>
                  <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 599" min="0" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Duration</label>
                  <input required type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g., 1 Hour" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Members</label>
                  <input required type="text" value={members} onChange={e => setMembers(e.target.value)} placeholder="e.g., Up to 4 Members" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} />
                  Mark as Popular
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={isMidnight} onChange={e => setIsMidnight(e.target.checked)} />
                  Mark as Midnight Special
                </label>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Features</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }} placeholder="e.g., Premium Decoration" style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                  <button type="button" onClick={handleAddFeature} className="btn-secondary" style={{ padding: '0 1rem' }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {features.map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {feature}
                      <button type="button" onClick={() => handleRemoveFeature(feature)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Timings</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input type="text" value={newTiming} onChange={e => setNewTiming(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTiming(); } }} placeholder="e.g., 10:00 AM - 01:00 PM" style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                  <button type="button" onClick={handleAddTiming} className="btn-secondary" style={{ padding: '0 1rem' }}>Add</button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {timings.map((time, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--accent-gold)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {time}
                      <button type="button" onClick={() => handleRemoveTiming(time)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {timings.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No timings added yet.</p>}
                </div>

                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Booked Slots</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input type="text" value={newBookedSlot} onChange={e => setNewBookedSlot(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddBookedSlot(); } }} placeholder="e.g., 10:00 AM - 01:00 PM" style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                  <button type="button" onClick={handleAddBookedSlot} className="btn-secondary" style={{ padding: '0 1rem' }}>Add</button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {bookedSlots.map((time, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', color: '#EF4444' }}>
                      <span style={{ textDecoration: 'line-through' }}>{time}</span>
                      <button type="button" onClick={() => handleRemoveBookedSlot(time)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {bookedSlots.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No booked slots added yet.</p>}
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.8rem 1.5rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
