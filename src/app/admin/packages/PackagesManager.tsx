"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import styles from "../page.module.css";

type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  timings: string[];
};

export default function PackagesManager() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [timings, setTimings] = useState<string[]>([]);
  const [newTiming, setNewTiming] = useState("");

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
    setDescription("");
    setTimings([]);
    setNewTiming("");
    setEditingPlan(null);
  };

  const openModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setName(plan.name);
      setPrice(plan.price.toString());
      setDescription(plan.description);
      setTimings(plan.timings || []);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const planData = {
      name,
      price: Number(price),
      description,
      timings
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

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button onClick={() => openModal()} className="btn-primary" style={{ padding: '0.6rem 1.2rem', gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <Plus size={18} /> Add New Plan
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        {plans.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <p className="text-[var(--text-secondary)]">No plans found. Add one to get started.</p>
          </div>
        ) : (
          plans.map(plan => (
            <div key={plan.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openModal(plan)} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', padding: '0.5rem' }} aria-label="Edit Plan">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(plan.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '0.5rem' }} aria-label="Delete Plan">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h2 className="heading-luxury text-xl text-[var(--accent-gold)] mb-1">{plan.name}</h2>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>₹{plan.price}</p>
              <p className="text-[var(--text-secondary)] mb-4">{plan.description}</p>
              
              <div>
                <h3 className="heading-luxury" style={{ fontSize: '1rem', marginBottom: '0.8rem' }}>Available Timings:</h3>
                {plan.timings && plan.timings.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {plan.timings.map((time, idx) => (
                      <span key={idx} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--accent-gold)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {time}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-secondary)] text-sm">No timings added for this plan.</p>
                )}
              </div>
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Plan Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Couple Plan" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Price (₹)</label>
                <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 599" min="0" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the plan..." rows={3} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', resize: 'vertical' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Timings</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input type="text" value={newTiming} onChange={e => setNewTiming(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTiming(); } }} placeholder="e.g., 10:00 AM - 01:00 PM" style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                  <button type="button" onClick={handleAddTiming} className="btn-secondary" style={{ padding: '0 1rem' }}>Add</button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
