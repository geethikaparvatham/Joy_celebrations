import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ConditionalFooter from './components/layout/ConditionalFooter';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Packages from './pages/Packages';
import Themes from './pages/Themes';
import Gallery from './pages/Gallery';
import AddOns from './pages/AddOns';
import Blog from './pages/Blog';
import BlogBlogPost from './pages/BlogBlogPost';
import FAQ from './pages/Faq';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import BookNow from './pages/BookNow';
import Receipt from './pages/Receipt';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/Admin';
import AdminBookings from './pages/admin/Bookings';
import AdminCustomers from './pages/admin/Customers';
import AdminPackages from './pages/admin/Packages';
import AdminSettings from './pages/admin/Settings';

import WhatsAppButton from './components/ui/WhatsAppButton';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/add-ons" element={<AddOns />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogBlogPost />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-now" element={<BookNow />} />
          <Route path="/receipt" element={<Receipt />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </main>
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <ConditionalFooter />}
    </>
  );
}

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppLayout />
      </Router>
    </HelmetProvider>
  );
}

export default App;
