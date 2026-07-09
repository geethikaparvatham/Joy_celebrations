import { create } from 'zustand';

interface BookingState {
  selectedPackage: string | null;
  selectedOccasion: string | null;
  date: string | null;
  timeSlot: string | null;
  addons: string[];
  customerDetails: {
    name: string;
    phone: string;
    email: string;
    celebrationName: string;
    specialInstructions: string;
  } | null;
  totalPrice: number;
  
  // Actions
  setPackage: (pkg: string) => void;
  setOccasion: (occ: string) => void;
  setDateTime: (date: string, time: string) => void;
  toggleAddon: (addon: string, price: number) => void;
  setCustomerDetails: (details: any) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedPackage: null,
  selectedOccasion: null,
  date: null,
  timeSlot: null,
  addons: [],
  customerDetails: null,
  totalPrice: 0,
  
  setPackage: (pkg) => set({ selectedPackage: pkg }),
  setOccasion: (occ) => set({ selectedOccasion: occ }),
  setDateTime: (date, time) => set({ date, timeSlot: time }),
  toggleAddon: (addon, price) => set((state) => {
    const exists = state.addons.includes(addon);
    return {
      addons: exists 
        ? state.addons.filter(a => a !== addon) 
        : [...state.addons, addon],
      totalPrice: exists 
        ? state.totalPrice - price 
        : state.totalPrice + price
    };
  }),
  setCustomerDetails: (details) => set({ customerDetails: details }),
  resetBooking: () => set({
    selectedPackage: null,
    selectedOccasion: null,
    date: null,
    timeSlot: null,
    addons: [],
    customerDetails: null,
    totalPrice: 0,
  }),
}));
