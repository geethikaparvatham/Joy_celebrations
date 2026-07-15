
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

export default function ConditionalFooter() {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Hide footer on the gallery page
  if (pathname === '/gallery') {
    return null;
  }
  
  return <Footer />;
}
