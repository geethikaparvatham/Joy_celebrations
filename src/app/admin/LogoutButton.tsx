"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh(); // force a full refresh to re-evaluate middleware
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
    >
      <LogOut size={16} /> Logout
    </button>
  );
}
