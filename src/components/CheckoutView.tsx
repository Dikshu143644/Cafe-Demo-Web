import React, { useState } from 'react';
import { CreditCard, MapPin, Check, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';
import { MenuItem, DiningType } from '../types';
import GlassCard from './GlassCard';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CheckoutViewProps {
  cartItems: CartItem[];
  diningType: DiningType;
  couponCode: string;
  onPlaceOrder: (orderData: any) => Promise<any>;
  onNavigate: (page: string) => void;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onClearCart: () => void;
}

export default function CheckoutView({
  cartItems,
  diningType: initialDiningType,
  couponCode,
  onPlaceOrder,
  onNavigate,
  userId,
  userName = '',
  userEmail = '',
  userPhone = '',
  onClearCart,
}: CheckoutViewProps) {
  const [diningType, setDiningType] = useState<DiningType>(initialDiningType);
  const [customerName, setCustomerName] = useState(userName);
  const [customerEmail, setCustomerEmail] = useState(userEmail);
  const [customerPhone, setCustomerPhone] = useState(userPhone);

  const [paymentTab, setPaymentTab] = useState<'card' | 'upi' | 'wallet'>('card');
  const [cardHolder, setCardHolder] = useState(userName);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  
  // Compute coupon info
  let discountPercentage = 0;
  if (couponCode === 'VISTA20') discountPercentage = 20;
  else if (couponCode === 'WELCOME10') discountPercentage = 10;
  else if (couponCode === 'LATTEPOINTS') discountPercentage = 15;

  const discountAmount = subtotal * (discountPercentage / 100);
  const taxAndFee = subtotal > 0 ? 3.50 : 0;
  const total = subtotal - discountAmount + taxAndFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerName || !customerEmail || !customerPhone) {
      alert('Please fill out all billing details');
      return;
    }

    setIsProcessing(true);
    
    // Simulate Razorpay Gateway API verification delay
    setTimeout(async () => {
      try {
        const payload = {
          customerName,
          customerEmail,
          customerPhone,
          items: cartItems.map(c => ({
            menuItemId: c.item.id,
            name: c.item.name,
            price: c.item.price,
            quantity: c.quantity
          })),
          subtotal,
          discount: discountAmount,
          total,
          diningType,
          userId,
          paymentMethod: paymentTab
        };

        const result = await onPlaceOrder(payload);
        setCreatedOrder(result.order);
        onClearCart();
        setShowSuccess(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div id="checkout-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header navigation back */}
        <button
          onClick={() => onNavigate('menu')}
          className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-cafe-bronze font-bold hover:text-cafe-smoky mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to menu</span>
        </button>

        {!showSuccess ? (
          <div>
            <div className="mb-8">
              <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight text-cafe-charcoal">
                Finalize your order
              </h1>
              <p className="text-xs text-cafe-charcoal/60 mt-1">Review your selections and process payment securely.</p>
            </div>

            {cartItems.length === 0 ? (
              <GlassCard theme="light" className="text-center py-16 bg-white/60">
                <ShoppingBag className="w-12 h-12 text-cafe-cream/40 mx-auto mb-4 animate-bounce" />
                <h3 className="font-serif text-lg font-bold text-cafe-charcoal uppercase mb-2">Your cart is dry</h3>
                <p className="text-xs text-cafe-charcoal/60 max-w-xs mx-auto mb-6">Explore our fresh menu categories and select an item first.</p>
                <button
                  onClick={() => onNavigate('menu')}
                  className="px-6 py-3 bg-cafe-smoky text-white hover:bg-cafe-gold hover:text-cafe-charcoal text-xs uppercase font-bold tracking-widest rounded-full transition-colors"
                >
                  Browse Menu
                </button>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Billing/Payment Column */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
                  
                  {/* Dining option & contact info */}
                  <GlassCard theme="light" className="bg-white/60 space-y-4" hoverEffect={false}>
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-cafe-charcoal border-b border-cafe-smoky/5 pb-2">
                      1. Contact details &amp; dining method
                    </h3>

                    {/* Dining toggle card */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-cafe-smoky/5 rounded-full border border-cafe-smoky/10 text-center text-xs">
                      <button
                        type="button"
                        onClick={() => setDiningType('dine-in')}
                        className={`py-2 px-1 uppercase font-bold tracking-wider rounded-full transition-all duration-300 ${
                          diningType === 'dine-in'
                            ? 'bg-cafe-smoky text-white'
                            : 'text-cafe-charcoal/60 hover:text-cafe-smoky'
                        }`}
                      >
                        Dine-In Parlor
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiningType('pickup')}
                        className={`py-2 px-1 uppercase font-bold tracking-wider rounded-full transition-all duration-300 ${
                          diningType === 'pickup'
                            ? 'bg-cafe-smoky text-white'
                            : 'text-cafe-charcoal/60 hover:text-cafe-smoky'
                        }`}
                      >
                        Quick Pickup
                      </button>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Name</label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky"
                            placeholder="Elena Rostova"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky"
                            placeholder="+44 7911 123456"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Email</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky"
                          placeholder="elena@cafevista.com"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Simulated payment systems */}
                  <GlassCard theme="light" className="bg-white/60 space-y-4" hoverEffect={false}>
                    <div className="flex items-center justify-between border-b border-cafe-smoky/5 pb-2">
                      <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-cafe-charcoal">
                        2. Simulated Razorpay checkout gateway
                      </h3>
                      <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-[9px] font-mono tracking-widest uppercase rounded-md font-bold">
                        TEST MODE ONLY
                      </span>
                    </div>

                    {/* Tabs */}
                    <div className="grid grid-cols-3 gap-2 border-b border-cafe-smoky/5 pb-3 text-center text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentTab('card')}
                        className={`pb-2 outline-none uppercase font-bold tracking-widest border-b-2 transition-all ${
                          paymentTab === 'card' ? 'border-cafe-smoky text-cafe-charcoal' : 'border-transparent text-cafe-charcoal/40'
                        }`}
                      >
                        Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentTab('upi')}
                        className={`pb-2 outline-none uppercase font-bold tracking-widest border-b-2 transition-all ${
                          paymentTab === 'upi' ? 'border-cafe-smoky text-cafe-charcoal' : 'border-transparent text-cafe-charcoal/40'
                        }`}
                      >
                        UPI GPAY / UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentTab('wallet')}
                        className={`pb-2 outline-none uppercase font-bold tracking-widest border-b-2 transition-all ${
                          paymentTab === 'wallet' ? 'border-cafe-smoky text-cafe-charcoal' : 'border-transparent text-cafe-charcoal/40'
                        }`}
                      >
                        Net Wallet
                      </button>
                    </div>

                    {/* Card input states */}
                    {paymentTab === 'card' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none"
                            placeholder="Elena Rostova"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky font-mono"
                            placeholder="4111 2222 3333 4444"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Expiry Date</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky font-mono"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-cafe-charcoal">CVV Code</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky font-mono"
                              placeholder="***"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentTab === 'upi' && (
                      <div className="py-6 text-center space-y-3 animate-fadeIn">
                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 text-indigo-500 rounded-full flex items-center justify-center mx-auto shadow">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-cafe-charcoal/70">
                          Simply complete payment in the Razorpay overlay popup. Any registered UPI handle (e.g. <span className="font-mono text-cafe-bronze font-bold">elena@okhdfcbank</span>) is approved during test phases.
                        </p>
                      </div>
                    )}

                    {paymentTab === 'wallet' && (
                      <div className="py-6 text-center space-y-3 animate-fadeIn">
                        <p className="text-xs text-cafe-charcoal/70">
                          Process order utilizing pre-loaded test credit networks. Fast, zero-fee collection channels.
                        </p>
                      </div>
                    )}

                    {/* Pay button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky h-14 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <span>Verifying Payment Signature via Razorpay...</span>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-cafe-gold" />
                            <span>Authorize &amp; Pay ${total.toFixed(2)}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </GlassCard>

                </form>

                {/* Summary Column */}
                <div className="lg:col-span-5 space-y-6">
                  <GlassCard theme="light" className="bg-white/60 space-y-4" hoverEffect={false}>
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-cafe-charcoal border-b border-cafe-smoky/5 pb-2">
                      Review Items summary
                    </h3>

                    <div className="space-y-4.5 max-h-[220px] overflow-y-auto pr-2">
                      {cartItems.map(({ item, quantity }) => (
                        <div key={item.id} className="flex items-center space-x-3 text-xs">
                          <img
                            referrerPolicy="no-referrer"
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-cafe-smoky shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-cafe-charcoal block truncate">{item.name}</span>
                            <span className="text-[10px] text-cafe-charcoal/50 block">Quantity: {quantity} x ${item.price.toFixed(2)}</span>
                          </div>
                          <span className="font-mono font-bold text-cafe-charcoal shrink-0">
                            ${(item.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Calculations */}
                    <div className="border-t border-cafe-smoky/5 pt-4 space-y-2 text-xs text-cafe-charcoal/70">
                      <div className="flex justify-between">
                        <span>Items subtotal</span>
                        <span className="font-mono text-cafe-smoky">${subtotal.toFixed(2)}</span>
                      </div>
                      {couponCode && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Discount Applied ({couponCode})</span>
                          <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax &amp; Setup Service charges</span>
                        <span className="font-mono text-cafe-smoky">${taxAndFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-serif text-sm font-bold text-cafe-charcoal pt-3 border-t border-cafe-smoky/5 uppercase tracking-wider">
                        <span>Estimated Total value</span>
                        <span className="font-mono text-cafe-bronze">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-cafe-gold/10 border border-cafe-gold/20 text-cafe-bronze text-[10px] rounded-xl flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Earn <strong>{Math.floor(total * 10)} VISTA loyalty points</strong> on this order checkout!</span>
                    </div>
                  </GlassCard>
                </div>

              </div>
            )}
          </div>
        ) : (
          /* Checkout Payment Success Screen */
          <div className="py-12 text-center space-y-8 animate-scaleUp max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-400/20 text-emerald-600 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-emerald-600 block">
                ORDER SUCCESSFUL &amp; PAID
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-cafe-charcoal font-bold uppercase tracking-tight">
                Your order is brewing!
              </h2>
              <p className="text-xs text-cafe-charcoal/70 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-cafe-smoky">{createdOrder?.customerName}</strong>. Our baristas have received your order ticket code <span className="font-mono text-cafe-bronze font-bold text-sm bg-white border border-[#deb887]/30 px-2 py-0.5 rounded-md shadow-sm ml-1">{createdOrder?.id}</span>.
              </p>
            </div>

            {/* Loyalty point banner info */}
            <div className="glass-light border border-emerald-500/20 max-w-sm mx-auto p-4 rounded-xl flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-cafe-charcoal uppercase block leading-none">Redemption loyalty credits awarded</span>
                <span className="text-[10px] text-cafe-charcoal/50 block mt-1">
                  +{Math.floor(total * 10)} credits loaded into account. Track progress inside your dashboard metrics!
                </span>
              </div>
            </div>

            {/* Delivery indicators summary */}
            <div className="bg-white border border-[#deb887]/35 rounded-2xl max-w-md mx-auto p-6 text-left space-y-4 font-mono uppercase text-xs">
              <span className="text-[10px] uppercase tracking-wider font-bold text-cafe-bronze block">Collection Specifications:</span>
              <div className="flex justify-between">
                <span className="text-cafe-charcoal/40">CUSTOMER REF:</span>
                <span className="font-bold text-cafe-smoky">{createdOrder?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cafe-charcoal/40">COLLECTION METHOD:</span>
                <span className="font-bold text-cafe-gold">{createdOrder?.diningType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cafe-charcoal/40">PAID TOTAL:</span>
                <span className="font-bold text-cafe-smoky">${createdOrder?.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cafe-charcoal/40">STATUS METRIC:</span>
                <span className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded text-[10px] font-bold">PREPARING AT KITCHEN</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex items-center justify-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 bg-cafe-smoky text-white hover:bg-cafe-gold hover:text-cafe-charcoal text-xs uppercase font-bold tracking-widest rounded-full transition-colors cursor-pointer"
              >
                Track on Dashboard
              </button>
              <button
                onClick={() => { onNavigate('home'); }}
                className="px-6 py-3 bg-white text-cafe-smoky border border-cafe-smoky/10 hover:bg-cafe-cream/40 text-xs uppercase font-bold tracking-widest rounded-full transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
