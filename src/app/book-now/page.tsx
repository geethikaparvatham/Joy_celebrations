"use client";

import { useState } from "react";
import { Check, CreditCard, Calendar } from "lucide-react";
import styles from "./page.module.css";
import { useBookingStore } from "@/lib/store";

const steps = ["Package", "Occasion", "Date & Time", "Addons", "Details", "Summary"];

const inputStyles = {
  width: '100%', 
  padding: '1rem', 
  background: 'rgba(255, 255, 255, 0.05)', 
  border: '1px solid rgba(212, 175, 55, 0.3)', 
  borderRadius: '8px',
  color: 'white',
  fontFamily: 'inherit',
  outline: 'none',
  fontSize: '1rem'
};

export default function BookNowPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} heading-luxury`}>
          Reserve Your <span className="gold-text">Experience</span>
        </h1>
      </div>

      <div className={`glass-panel ${styles.wizardContainer}`}>
        <div className={styles.stepIndicator}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div 
                key={index} 
                className={`${styles.step} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepCompleted : ''}`}
                title={step}
              >
                {isCompleted ? <Check size={20} /> : stepNumber}
              </div>
            );
          })}
        </div>

        <div className={styles.formContent}>
          <h2 className="heading-luxury" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{steps[currentStep - 1]}</h2>
          
          <div style={{ marginTop: '2rem' }}>
            {currentStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {['Plan 1', 'Plan 2', 'Plan 3', 'Midnight Special'].map(pkg => (
                  <button 
                    key={pkg}
                    className="btn-secondary"
                    onClick={() => {
                      useBookingStore.getState().setPackage(pkg);
                      setCurrentStep(2);
                    }}
                  >
                    Select {pkg}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {['Birthday', 'Anniversary', 'Surprise Party', 'Other'].map(occ => (
                  <button 
                    key={occ}
                    className="btn-secondary"
                    onClick={() => {
                      useBookingStore.getState().setOccasion(occ);
                      setCurrentStep(3);
                    }}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                  <input 
                    type="date" 
                    className={`${styles.inputField} ${styles.dateInput}`}
                    style={{ 
                      width: '100%', 
                      padding: '1rem 3rem 1rem 1rem', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid rgba(212, 175, 55, 0.3)', 
                      borderRadius: '8px',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none',
                      fontSize: '1rem',
                      position: 'relative',
                      zIndex: 2
                    }}
                  />
                  <Calendar 
                    size={20} 
                    style={{ 
                      position: 'absolute', 
                      right: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#d4af37',
                      pointerEvents: 'none'
                    }} 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button 
                    className="btn-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => setCurrentStep(4)}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {['Photography', 'Fog Entry', 'Rose Petal Pathway', 'Custom Cake', 'Cold Sparklers'].map(addon => (
                    <button 
                      key={addon}
                      className="btn-secondary"
                      style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                      onClick={(e) => {
                        e.currentTarget.classList.toggle('active-addon');
                        e.currentTarget.style.borderColor = e.currentTarget.classList.contains('active-addon') ? '#d4af37' : '';
                        e.currentTarget.style.color = e.currentTarget.classList.contains('active-addon') ? '#d4af37' : '';
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>{addon}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+ Add</span>
                    </button>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn-secondary" onClick={() => setCurrentStep(3)}>Previous</button>
                  <button className="btn-primary" onClick={() => setCurrentStep(5)}>Next Step</button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <input type="text" placeholder="Full Name" className={styles.inputField} style={inputStyles} />
                  <input type="tel" placeholder="Phone Number" className={styles.inputField} style={inputStyles} />
                  <input type="email" placeholder="Email Address" className={styles.inputField} style={inputStyles} />
                  <textarea placeholder="Any Special Requests?" rows={3} className={styles.inputField} style={{...inputStyles, resize: 'vertical'}}></textarea>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn-secondary" onClick={() => setCurrentStep(4)}>Previous</button>
                  <button className="btn-primary" onClick={() => setCurrentStep(6)}>Next Step</button>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                  <h3 className="heading-luxury text-xl mb-4 text-[var(--accent-gold)]" style={{ color: '#d4af37', fontSize: '1.5rem', marginBottom: '1rem' }}>Booking Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                    <p><strong>Package:</strong> {useBookingStore.getState().selectedPackage}</p>
                    <p><strong>Occasion:</strong> {useBookingStore.getState().selectedOccasion}</p>
                    <p style={{ borderTop: '1px solid rgba(212, 175, 55, 0.3)', paddingTop: '0.5rem', marginTop: '0.5rem', color: '#d4af37', fontSize: '1.2rem' }}>
                      <strong>Total Estimate:</strong> ₹{useBookingStore.getState().totalPrice || "1,500"}
                    </p>
                  </div>
                </div>

                <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Select Payment Method</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {['UPI / GPay / PhonePe', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'].map(method => (
                    <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <input type="radio" name="payment" value={method} defaultChecked={method === 'UPI / GPay / PhonePe'} />
                      <span style={{ fontSize: '0.9rem' }}>{method}</span>
                    </label>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn-secondary" onClick={() => setCurrentStep(5)}>Previous</button>
                  <button 
                    className="btn-primary"
                    onClick={() => alert("Booking Confirmed! Thank you for choosing JOY Celebrations.")}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <CreditCard size={18} /> Confirm & Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
