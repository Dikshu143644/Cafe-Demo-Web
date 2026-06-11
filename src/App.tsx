import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import OpeningSlider from './components/OpeningSlider';

// Routing Views
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import MenuView from './components/MenuView';
import BookingView from './components/BookingView';
import CheckoutView from './components/CheckoutView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import ManagerView from './components/ManagerView';
import AssistantView from './components/AssistantView';
import ContactView from './components/ContactView';

import { MenuItem, DiningType, UserRole } from './types';
import { MENU_ITEMS } from './data/mockData';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  favorites: string[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [diningType, setDiningType] = useState<DiningType>('dine-in');
  const [couponCode, setCouponCode] = useState<string>('');

  // Loaded database state lists
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);

  // Authenticated context
  const [user, setUser] = useState<User | null>(null);

  // Sync state data lists with the Express backend
  const syncServerData = async () => {
    try {
      const resMenu = await fetch('/api/menu');
      if (resMenu.ok) {
        const data = await resMenu.json();
        if (data.menuItems) setMenuList(data.menuItems);
      }

      const resBookings = await fetch('/api/bookings');
      if (resBookings.ok) {
        const data = await resBookings.json();
        if (data.bookings) setBookingsList(data.bookings);
      }

      const resOrders = await fetch('/api/orders');
      if (resOrders.ok) {
        const data = await resOrders.json();
        if (data.orders) setOrdersList(data.orders);
      }

      const resMessages = await fetch('/api/contact');
      if (resMessages.ok) {
        const data = await resMessages.json();
        if (data.messages) setMessagesList(data.messages);
      }
    } catch (e) {
      console.warn("Express synchronization offline/fallback active:", e);
    }
  };

  useEffect(() => {
    syncServerData();
  }, []);

  // Periodic poll to fetch updated preparing tickets or bookings status updates
  useEffect(() => {
    const timer = setInterval(() => {
      syncServerData();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Back to top scroll alignment upon navigation
  const handleNavigate = (page: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 450);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  // Auth: Log In Action Handler
  const handleLogin = async (email: string, pass: string, role: UserRole) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, role }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Verification failure');
    }

    setUser(result.user);
    return result;
  };

  // Auth: Registration Sign up Handler
  const handleSignup = async (name: string, email: string, phone: string, pass: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password: pass }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Sourcing registration rejection');
    }

    return result;
  };

  // Auth: Verify OTP Action Handler
  const handleVerifyOtp = async (email: string, otp: string) => {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'OTP key validation failed');
    }

    setUser(result.user);
    return result;
  };

  // Action Logout
  const handleLogout = () => {
    setUser(null);
    handleNavigate('home');
  };

  // Booking Scheduler Handler (Step 3 Submit)
  const handleAddBooking = async (bookingData: any) => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Reservation scheduling failure');
    }

    // Refresh lists
    await syncServerData();
    return result;
  };

  // Secure checkout submit order Handler
  const handlePlaceOrder = async (orderPayload: any) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Order processing error');
    }

    // Accumulate user points locally
    if (user && user.email.toLowerCase() === orderPayload.customerEmail.toLowerCase()) {
      setUser((prev: any) => prev ? {
        ...prev,
        loyaltyPoints: prev.loyaltyPoints + Math.floor(orderPayload.total * 10)
      } : null);
    }

    await syncServerData();
    return result;
  };

  // Customer support inquiries handler
  const handleSendMessage = async (name: string, email: string, text: string) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message: text }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Message dispatch rejection');
    }

    await syncServerData();
    return result;
  };

  // AI assistant conversational post proxy
  const handleSendMessageToAi = async (prompt: string, history: any[]) => {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Bot offline');
    }

    return result.response;
  };

  // Toggle Favorite
  const handleToggleFavorite = (itemId: string) => {
    if (!user) {
      handleNavigate('login');
      return;
    }

    setUser((prev: any) => {
      if (!prev) return null;
      const isFav = prev.favorites.includes(itemId);
      const updatedFavs = isFav
        ? prev.favorites.filter((f: string) => f !== itemId)
        : [...prev.favorites, itemId];
      return { ...prev, favorites: updatedFavs };
    });
  };

  // Remove Favorite from dashboard view
  const handleRemoveFavorite = (itemId: string) => {
    setUser((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        favorites: prev.favorites.filter((f: string) => f !== itemId)
      };
    });
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    // Visual trigger to slide drawer
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.item.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== id));
  };

  const handleNavigateToCheckout = (type: DiningType, coupon: string) => {
    setDiningType(type);
    setCouponCode(coupon);
    handleNavigate('checkout');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Manager: Update pending table reserve state
  const handleUpdateBookingStatus = async (id: string, status: 'approved' | 'cancelled') => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await syncServerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manager: Update food preparation progress status
  const handleUpdateOrderStatus = async (id: string, status: 'preparing' | 'ready' | 'completed') => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await syncServerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const featuredItems = menuList.filter(item => item.isPopular).slice(0, 4);

  return (
    <div id="cafe-vista-root" className="min-h-screen bg-cafe-cream relative flex flex-col justify-between overflow-x-hidden">
      
      {/* Cinematic Opening Slider Loader on first entry */}
      <OpeningSlider />

      {/* Slide Transition Curtain for active tab navigation */}
      <div 
        className={`fixed inset-0 z-[9998] bg-[#1e1a17] pointer-events-none transition-all duration-[750ms] cubic-bezier(0.85, 0, 0.15, 1) flex flex-col items-center justify-center ${
          isTransitioning ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-cafe-gold animate-pulse">Sourcing Sanctuary</span>
          <h2 className="font-serif italic text-3xl font-extrabold text-[#FDFBF7]">Café Vista</h2>
          <div className="w-12 h-[1px] bg-cafe-gold/30 mx-auto mt-2"></div>
        </div>
      </div>
      
      {/* Floating Glass Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        user={user}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Slide-In Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onNavigateToCheckout={handleNavigateToCheckout}
      />

      {/* Main Core View Router */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            featuredItems={featuredItems}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'about' && <AboutView />}

        {currentPage === 'menu' && (
          <MenuView
            menuItems={menuList}
            onAddToCart={handleAddToCart}
            favorites={user ? user.favorites : []}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'booking' && (
          <BookingView
            onAddBooking={handleAddBooking}
            userId={user?.id}
            userName={user?.name}
            userEmail={user?.email}
            userPhone={user?.phone}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutView
            cartItems={cart}
            diningType={diningType}
            couponCode={couponCode}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
            userId={user?.id}
            userName={user?.name}
            userEmail={user?.email}
            userPhone={user?.phone}
            onClearCart={handleClearCart}
          />
        )}

        {currentPage === 'login' && (
          <AuthView
            onLogin={handleLogin}
            onSignup={handleSignup}
            onVerifyOtp={handleVerifyOtp}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardView
            user={user}
            orders={ordersList}
            bookings={bookingsList}
            menuItems={menuList}
            onRemoveFavorite={handleRemoveFavorite}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'manager' && (
          <ManagerView
            user={user}
            bookings={bookingsList}
            orders={ordersList}
            messages={messagesList}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'assistant' && (
          <AssistantView onSendMessage={handleSendMessageToAi} />
        )}

        {currentPage === 'contact' && (
          <ContactView onSendMessage={handleSendMessage} />
        )}
      </main>

      {/* Page Elegant Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
