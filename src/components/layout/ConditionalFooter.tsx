"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on the gallery page
  if (pathname === '/gallery') {
    return null;
  }
  
  return <Footer />;
}
