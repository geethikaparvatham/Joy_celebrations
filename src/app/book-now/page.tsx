"use client";

import { useState, useRef } from "react";
import { Check, CreditCard, Calendar, Clock, Users, Share2, Camera, MessageCircle, Upload } from "lucide-react";
import styles from "./page.module.css";
import { useBookingStore } from "@/lib/store";
import Tesseract from "tesseract.js";

const steps = ["Package", "Occasion", "Date & Time", "Addons", "Details", "Summary"];

const ADDONS_LIST = [
  { name: 'Professional Photography (1 Hour)', price: 1500, image: '/addon_photography.jpg', note: '• Unlimited Photos' },
  { name: 'Cinematic Reel', price: 1500, image: '/addon_cinematic_reel.jpg' },
  { name: 'Fog Effect', price: 799, image: '/addon_fog.jpg' },
  { name: 'Bubble Entry', price: 299, image: '/addon_bubble_entry.jpg' },
  { name: 'Rose Petals Entry', price: 699, image: '/addon_rose_petals.jpg' },
  { name: 'Custom Cake', price: 'On Request', image: '/addon_custom_cake.jpg' }
];

const PACKAGES_LIST = [
  { 
    name: 'Plan 1', 
    price: 599, 
    people: 'Up to 4 Members', 
    duration: '1 Hour',
    features: ['Perfect for Private Movie Experience', 'Large Screen Projection', 'Premium Sound System']
  },
  { 
    name: 'Plan 2', 
    price: 1300, 
    people: 'Up to 4 Members', 
    duration: '1 Hour',
    features: ['Premium Decoration', 'Customized Name Board', 'LED Letters', '1 Kg Cake OR Half Kg Cool Cake']
  },
  { 
    name: 'Plan 3', 
    price: 2500, 
    people: 'Up to 10 Members', 
    duration: '2 Hours',
    features: ['Premium Decoration', 'Birthday Video', 'Fog Effect', 'LED Letters & Name Board']
  },
  { 
    name: 'Midnight Special', 
    price: 2500, 
    people: 'Up to 10 Members', 
    duration: '1 Hour',
    features: ['Exclusive Midnight Slot', 'Premium Decoration', 'Birthday Video', 'Fog Effect']
  }
];

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
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay / PhonePe');
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'share'>('pending');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanSuccess, setScanSuccess] = useState(false);

  // Dynamic pricing calculation
  const selectedPackage = useBookingStore(state => state.selectedPackage);
  const selectedOccasion = useBookingStore(state => state.selectedOccasion);
  const date = useBookingStore(state => state.date);
  const timeSlot = useBookingStore(state => state.timeSlot);
  const selectedPackageData = PACKAGES_LIST.find(p => p.name === selectedPackage);
  const basePrice = selectedPackageData?.price || 599;
  const addonTotal = selectedAddons.reduce((sum, addonName) => {
    const addonInfo = ADDONS_LIST.find(a => a.name === addonName);
    const price = typeof addonInfo?.price === 'number' ? addonInfo.price : 0;
    return sum + price;
  }, 0);
  const currentTotal = basePrice + addonTotal;

  const generateReceiptUrl = () => {
    const store = useBookingStore.getState();
    const receiptData = {
      n: customerName || "Customer",
      p: customerPhone,
      pk: store.selectedPackage,
      o: store.selectedOccasion,
      d: store.date || 'TBD',
      t: store.timeSlot || 'TBD',
      a: selectedAddons,
      tm: currentTotal,
      pm: paymentMethod,
      id: Math.random().toString(36).substr(2, 9).toUpperCase()
    };
    
    // Force public link even when testing on localhost
    let baseUrl = window.location.origin;
    if (baseUrl.includes('localhost')) {
      baseUrl = 'https://joy-celebrations-private-theatre.vercel.app';
    }
    
    return `${baseUrl}/receipt?d=${btoa(JSON.stringify(receiptData))}`;
  };

  const handleFinalSubmit = () => {
    const store = useBookingStore.getState();
    const whatsappNumber = "919618681267";
    const name = customerName || "Customer";
    
    let msg = `*New Booking Request!*%0A%0A`;
    msg += `*Name:* ${name}%0A`;
    if (customerPhone) msg += `*Phone:* ${customerPhone}%0A`;
    msg += `*Package:* ${store.selectedPackage}%0A`;
    msg += `*Occasion:* ${store.selectedOccasion}%0A`;
    msg += `*Date/Time:* ${store.date || 'TBD'} | ${store.timeSlot || 'TBD'}%0A`;
    
    if (selectedAddons.length > 0) {
      msg += `*Addons:* ${selectedAddons.join(', ')}%0A`;
    }
    
    msg += `*Total Amount:* ₹ ${currentTotal.toLocaleString('en-IN')}%0A`;
    msg += `*Payment Method:* ${paymentMethod}%0A%0A`;
    msg += `*Receipt Link:* ${generateReceiptUrl()}`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${msg}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleCustomerShare = (platform: string) => {
    const url = generateReceiptUrl();
    if (platform === 'whatsapp') {
      const msg = `Hey! I just booked a private theatre experience at JOY Celebrations. Check out my receipt here: ${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(url);
      alert('Receipt link copied to clipboard! Opening Instagram so you can paste it in DMs.');
      window.open('https://www.instagram.com/joy.celebrations/', '_blank');
    }
  };

  const handleConfirmPay = () => {
    setShowUpiModal(true);
    if (paymentMethod === 'UPI / GPay / PhonePe') {
      setSelectedUpiApp(null);
      setPaymentStatus('pending');
      setScanError('');
      setScanSuccess(false);
    } else {
      // Skip QR code for other methods and show success directly
      setSelectedUpiApp('Direct');
      setPaymentStatus('success');
      setTimeout(() => {
        setPaymentStatus('share');
      }, 1000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError('');
    setScanSuccess(false);

    try {
      const result = await Tesseract.recognize(file, 'eng');
      
      // Clean up the text: remove commas, spaces, decimals to find the raw number
      const text = result.data.text.replace(/,/g, '');
      const targetAmount = currentTotal.toString();
      
      if (text.includes(targetAmount)) {
        // Match found!
        setIsScanning(false);
        setScanSuccess(true);
      } else {
        setIsScanning(false);
        setScanError(`Verification Failed: We could not detect a payment of ₹${currentTotal} in this screenshot. Please upload a clearer image.`);
      }
    } catch (error) {
      console.error(error);
      setIsScanning(false);
      setScanError("Failed to process the image. Please try again.");
    }
  };

  // --- Dynamic Slot Generation ---
  const generateSlots = () => {
    const isTwoHours = selectedPackageData?.duration.includes('2');
    const duration = isTwoHours ? 2 : 1;
    const slots = [];
    const endOperatingHour = 26; // 2 AM next day
    
    for (let currentHour = 9; currentHour <= endOperatingHour - duration; currentHour += duration) {
      const getAmPm = (h: number) => h >= 12 && h < 24 ? 'PM' : 'AM';
      const getDisplayHour = (h: number) => {
        const mod = h % 12;
        return mod === 0 ? 12 : mod;
      };
      const startTime = `${getDisplayHour(currentHour)}:00 ${getAmPm(currentHour)}`;
      const endHour = currentHour + duration;
      const endTime = `${getDisplayHour(endHour)}:00 ${getAmPm(endHour)}`;
      slots.push(`${startTime} - ${endTime}`);
    }
    
    if (selectedPackage === 'Midnight Special') {
      return ["11:00 PM - 12:00 AM", "12:00 AM - 01:00 AM", "01:00 AM - 02:00 AM"];
    }
    return slots;
  };

  const getBookedSlots = (slots: string[], dateStr: string) => {
    if (!dateStr || slots.length === 0) return [];
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
      hash |= 0; 
    }
    const seed = Math.abs(hash);
    const bookedCount = 2 + (seed % 3); // Randomly 2 to 4 booked slots
    const booked: string[] = [];
    for(let i = 0; i < bookedCount; i++) {
      const index = (seed + i * 13) % slots.length;
      if (!booked.includes(slots[index])) {
         booked.push(slots[index]);
      }
    }
    return booked;
  };

  const allSlots = generateSlots();
  const bookedSlots = getBookedSlots(allSlots, date || '');
  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));
  // -------------------------------

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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {PACKAGES_LIST.map((pkg) => {
                  const isSelected = selectedPackage === pkg.name;
                  return (
                    <div 
                      key={pkg.name}
                      style={{ 
                        position: 'relative',
                        padding: '1.5rem 1.2rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-start', 
                        gap: '1.5rem',
                        textAlign: 'left',
                        height: '100%',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0', // Square edges like reference
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                      onClick={() => {
                        useBookingStore.getState().setPackage(pkg.name);
                        setCurrentStep(2);
                      }}
                    >
                      {/* Ribbon for Midnight Special */}
                      {pkg.name === 'Midnight Special' && (
                        <div style={{
                          position: 'absolute',
                          top: '20px',
                          right: '-35px',
                          background: '#d4af37',
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          padding: '5px 40px',
                          transform: 'rotate(45deg)',
                          letterSpacing: '1px'
                        }}>
                          MIDNIGHT
                        </div>
                      )}

                      <div style={{ width: '100%' }}>
                        <h3 style={{ color: '#d4af37', fontSize: '1.4rem', marginBottom: '0.5rem' }}>{pkg.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                          <span style={{ color: 'white', fontSize: '1rem', marginTop: '0.2rem', marginRight: '0.2rem' }}>₹</span>
                          <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>{pkg.price}</span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Clock size={18} color="#d4af37" /> {pkg.duration}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Users size={18} color="#d4af37" /> {pkg.people}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {pkg.features.map((feature, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                              <Check size={16} color="#d4af37" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button className="btn-primary" style={{ width: '100%', marginTop: '2rem', background: isSelected ? '#d4af37' : 'transparent', color: isSelected ? 'black' : '#d4af37', border: '1px solid #d4af37' }}>
                        {isSelected ? 'SELECTED' : 'SELECT'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', margin: '0 auto', maxWidth: '900px' }}>
                {[
                  { name: 'Birthday', img: '/images/occasion_birthday.jpg' },
                  { name: 'Anniversary', img: '/images/occasion_anniversary.jpg' },
                  { name: 'Surprise Party', img: '/images/occasion_surprise.jpg' },
                  { name: 'Other', img: '/images/occasion_other.jpg' }
                ].map(occ => {
                  const isSelected = selectedOccasion === occ.name;
                  return (
                    <div 
                      key={occ.name}
                      style={{ 
                        position: 'relative',
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #d4af37' : '2px solid transparent',
                        transition: 'all 0.3s ease',
                        boxShadow: isSelected ? '0 0 15px rgba(212,175,55,0.3)' : '0 4px 10px rgba(0,0,0,0.5)',
                        transform: isSelected ? 'translateY(-5px)' : 'none'
                      }}
                      onClick={() => {
                        useBookingStore.getState().setOccasion(occ.name);
                        setTimeout(() => setCurrentStep(3), 300); // Slight delay for animation
                      }}
                    >
                      <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                        <img 
                          src={occ.img} 
                          alt={occ.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{ 
                          position: 'absolute', inset: 0, 
                          background: isSelected ? 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' : 'rgba(0,0,0,0.5)', 
                          transition: 'all 0.3s ease' 
                        }} />
                      </div>
                      <div style={{ 
                        padding: '1.2rem', 
                        background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 2,
                        marginTop: '-10px',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <h4 style={{ 
                          color: isSelected ? '#d4af37' : 'white', 
                          margin: 0, fontSize: '1.2rem',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          letterSpacing: '1px'
                        }}>
                          {occ.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentStep === 3 && (
              <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                
                <div style={{ 
                  background: '#111', 
                  padding: '1.5rem 1rem 1rem', 
                  borderRadius: '12px', 
                  position: 'relative',
                  marginBottom: '2rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  maxWidth: '400px',
                  margin: '0 auto 2rem'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '-10px', 
                    left: '20px', 
                    background: '#111', 
                    padding: '0 10px', 
                    color: '#d4af37', 
                    fontSize: '0.8rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    Check Slot Availability
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="date" 
                      value={date || ''}
                      onChange={(e) => useBookingStore.setState({ date: e.target.value })}
                      ref={dateInputRef}
                      className={`${styles.inputField} ${styles.dateInput}`}
                      style={{ 
                        width: '100%', 
                        padding: '0.8rem', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        border: '1px solid rgba(212, 175, 55, 0.3)', 
                        borderRadius: '8px',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none',
                        fontSize: '1.1rem',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => e.currentTarget.showPicker()}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar 
                      size={20} 
                      onClick={() => dateInputRef.current?.showPicker()}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#d4af37', cursor: 'pointer' }} 
                    />
                  </div>
                </div>

                {date && (
                  <div style={{ animation: 'fadeIn 0.5s ease', marginBottom: '2rem', textAlign: 'left' }}>
                    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                      
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#d4af37' }}>Choose Your Slot ({selectedPackageData?.duration})</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                        {availableSlots.map(slot => {
                          const isSelected = timeSlot === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => useBookingStore.setState({ timeSlot: slot })}
                              style={{
                                padding: '0.8rem',
                                background: isSelected ? '#d4af37' : 'rgba(255,255,255,0.05)',
                                border: isSelected ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.2)',
                                color: isSelected ? 'black' : 'white',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {slot}
                            </button>
                          );
                        })}
                        {availableSlots.length === 0 && <p style={{color:'white'}}>No slots available.</p>}
                      </div>

                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#EF4444' }}>Booked Slots</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                        {bookedSlots.map(slot => (
                          <div
                            key={slot}
                            style={{
                              padding: '0.8rem',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#EF4444',
                              borderRadius: '8px',
                              cursor: 'not-allowed',
                              fontSize: '0.9rem',
                              textAlign: 'center',
                              opacity: 0.7
                            }}
                          >
                            {slot}
                          </div>
                        ))}
                        {bookedSlots.length === 0 && <p style={{color:'var(--text-secondary)'}}>No slots are booked yet.</p>}
                      </div>
                      
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn-secondary" onClick={() => setCurrentStep(2)}>Previous</button>
                  <button 
                    className="btn-primary"
                    disabled={!date || !timeSlot}
                    style={{ opacity: (!date || !timeSlot) ? 0.5 : 1 }}
                    onClick={() => setCurrentStep(4)}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div style={{ textAlign: 'center', width: '100%', margin: '0 auto' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                  gap: '1.5rem', 
                  marginBottom: '2rem',
                  justifyContent: 'center'
                }}>
                  {ADDONS_LIST.map(addon => {
                    const isSelected = selectedAddons.includes(addon.name);
                    return (
                      <div 
                        key={addon.name}
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          gap: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAddons(selectedAddons.filter(a => a !== addon.name));
                          } else {
                            setSelectedAddons([...selectedAddons, addon.name]);
                          }
                        }}
                      >
                        <div style={{ 
                          width: '120px', 
                          height: '120px', 
                          borderRadius: '50%', 
                          overflow: 'hidden',
                          border: isSelected ? '3px solid #d4af37' : '2px solid transparent',
                          boxShadow: isSelected ? '0 0 15px rgba(212,175,55,0.5)' : '0 4px 10px rgba(0,0,0,0.5)',
                          position: 'relative'
                        }}>
                          <img src={addon.image} alt={addon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {isSelected && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Check size={32} color="#d4af37" />
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <h4 style={{ fontSize: '0.9rem', color: isSelected ? '#d4af37' : 'white', marginBottom: '0.2rem', lineHeight: '1.2' }}>{addon.name}</h4>
                          <span style={{ fontSize: '0.85rem', color: isSelected ? '#d4af37' : 'var(--text-secondary)' }}>
                            {typeof addon.price === 'number' ? `₹ ${addon.price}` : addon.price}
                          </span>
                          {addon.note && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{addon.note}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn-secondary" onClick={() => setCurrentStep(3)}>Previous</button>
                  <button className="btn-primary" onClick={() => setCurrentStep(5)}>
                    Next Step (₹ {currentTotal.toLocaleString('en-IN')})
                  </button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <input type="text" placeholder="Full Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className={styles.inputField} style={inputStyles} />
                  <input type="tel" placeholder="Phone Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className={styles.inputField} style={inputStyles} />
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
                    {selectedAddons.length > 0 && (
                      <p><strong>Addons:</strong> {selectedAddons.join(', ')}</p>
                    )}
                    <p style={{ borderTop: '1px solid rgba(212, 175, 55, 0.3)', paddingTop: '0.5rem', marginTop: '0.5rem', color: '#d4af37', fontSize: '1.2rem' }}>
                      <strong>Total Estimate:</strong> ₹ {currentTotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Select Payment Method</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {['UPI / GPay / PhonePe', 'Net Banking'].map(method => {
                    const isSelected = paymentMethod === method;
                    return (
                      <label 
                        key={method} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)', 
                          padding: '1rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer', 
                          border: isSelected ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          color: isSelected ? '#d4af37' : 'white'
                        }}
                      >
                        <input 
                          type="radio" 
                          name="payment" 
                          value={method} 
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method)}
                          style={{ accentColor: '#d4af37', width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 'bold' : 'normal' }}>{method}</span>
                      </label>
                    );
                  })}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn-secondary" onClick={() => setCurrentStep(5)}>Previous</button>
                  <button 
                    className="btn-primary"
                    onClick={handleConfirmPay}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <CreditCard size={18} /> Confirm & Pay (₹ {currentTotal.toLocaleString('en-IN')})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* UPI Payment Modal */}
      {showUpiModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px',
            maxWidth: '450px', width: '90%', border: '1px solid #d4af37',
            textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ color: '#d4af37', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {paymentMethod === 'UPI / GPay / PhonePe' ? 'Complete UPI Payment' : 'Booking Confirmation'}
            </h3>
            
            {paymentStatus === 'pending' ? (
              <>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Select your preferred UPI App to scan the QR code.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {['GPay', 'PhonePe', 'Paytm'].map(app => (
                    <button 
                      key={app}
                      onClick={() => setSelectedUpiApp(app)}
                      style={{
                        padding: '0.8rem 0.5rem',
                        background: selectedUpiApp === app ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: selectedUpiApp === app ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                        color: selectedUpiApp === app ? '#d4af37' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {app}
                    </button>
                  ))}
                </div>
                
                {selectedUpiApp && (
                  <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
                    <p style={{ marginBottom: '1rem', color: '#d4af37' }}>Scan with {selectedUpiApp} to pay ₹ {currentTotal.toLocaleString('en-IN')}</p>
                    <img src="/upi_qr.jpg" alt="UPI QR Code" style={{ width: '200px', height: '200px', objectFit: 'contain', margin: '0 auto', borderRadius: '8px', background: 'white', padding: '0.5rem' }} />
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                  {scanSuccess ? (
                    <div style={{ marginTop: '0.5rem', width: '100%', animation: 'fadeIn 0.5s ease' }}>
                      <p style={{ color: '#22C55E', fontWeight: 'bold', marginBottom: '1rem' }}>✓ Payment Verified!</p>
                      <button 
                        className="btn-primary" 
                        style={{ width: '100%', background: '#22C55E', border: 'none', color: 'white', padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => {
                          setPaymentStatus('success');
                          setTimeout(() => {
                            setPaymentStatus('share');
                          }, 1000);
                        }}
                      >
                        PROCEED
                      </button>
                    </div>
                  ) : (
                    <>
                      {selectedUpiApp && (
                        <>
                          <label style={{
                            background: '#22C55E', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '8px',
                            cursor: isScanning ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            transition: 'all 0.3s', opacity: isScanning ? 0.7 : 1, width: '100%', justifyContent: 'center'
                          }}>
                            {isScanning ? (
                              <>Scanning Receipt... Please wait.</>
                            ) : (
                              <><Upload size={18} /> Upload Payment Screenshot</>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={handleFileUpload}
                              disabled={isScanning}
                            />
                          </label>
                          
                          {scanError && (
                            <p style={{ color: '#EF4444', fontSize: '0.9rem', maxWidth: '350px', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                              {scanError}
                            </p>
                          )}
                        </>
                      )}

                      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowUpiModal(false)}>Cancel</button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : paymentStatus === 'success' ? (
              <div style={{ padding: '2rem 0', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ width: '60px', height: '60px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Check size={32} color="white" />
                </div>
                <h4 style={{ color: '#25D366', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  Payment Confirmed!
                </h4>
              </div>
            ) : (
              <div style={{ padding: '1rem 0', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ width: '60px', height: '60px', background: '#d4af37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Check size={32} color="black" />
                </div>
                <h4 style={{ color: '#d4af37', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  Booking Successful!
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Send your booking details to our admin to confirm your slot, or share it with your friends!
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button 
                    className="btn-primary" 
                    onClick={handleFinalSubmit}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', border: 'none' }}
                  >
                    <MessageCircle size={20} /> Send Details to Admin (WhatsApp)
                  </button>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => handleCustomerShare('whatsapp')}
                      style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s' }}
                    >
                      <Share2 size={18} /> Share WhatsApp
                    </button>
                    <button 
                      onClick={() => handleCustomerShare('instagram')}
                      style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s' }}
                    >
                      <Camera size={18} /> Share Instagram
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setShowUpiModal(false);
                    window.location.href = generateReceiptUrl();
                  }}
                  style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: '#d4af37', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  View My Digital Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
