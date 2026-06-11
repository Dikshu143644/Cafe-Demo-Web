import React from 'react';
import { Sparkles, Calendar, Coffee, ChevronRight, Check, Star } from 'lucide-react';
import { MenuItem } from '../types';
import ScrollReveal from './ScrollReveal';
import SanctuaryCustomizer from './SanctuaryCustomizer';

interface HomeViewProps {
  onNavigate: (page: string) => void;
  featuredItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function HomeView({ onNavigate, featuredItems, onAddToCart }: HomeViewProps) {
  return (
    <div id="home-view" className="font-sans antialiased bg-cafe-cream">
      
      {/* ================= HERO SECTION ================= */}
      <section
        id="hero-banner"
        className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-24 overflow-hidden bg-cafe-cream"
      >
        {/* Ambient Background Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#EEDCC6]/45 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#D4C3B0]/35 rounded-full blur-[140px] pointer-events-none opacity-30"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left (Col-span-5) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center gap-6 text-left">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-cafe-gold block font-mono">
                  Experience the Aroma
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-serif leading-[0.95] font-light italic -ml-1 text-cafe-charcoal">
                  Purely <br/> 
                  <span className="font-extrabold not-italic text-cafe-charcoal">Artisan.</span>
                </h1>
              </div>
              <p className="text-cafe-charcoal/70 text-base sm:text-lg leading-relaxed max-w-sm font-sans">
                A human-crafted sanctuary of flavor and light. Explore our curated selection of single-origin roasts and handmade pastries.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
                <button
                  onClick={() => onNavigate('menu')}
                  className="h-14 px-8 bg-cafe-charcoal text-white hover:bg-cafe-gold hover:text-cafe-charcoal rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-[1.03] transition-all cursor-pointer"
                >
                  Explore Menu
                  <svg className="w-4 h-4 text-cafe-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button
                  onClick={() => onNavigate('booking')}
                  className="h-14 px-6 border-2 border-cafe-charcoal text-cafe-charcoal hover:bg-cafe-charcoal hover:text-white rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer"
                >
                  Reserve Table
                </button>
              </div>

              {/* Overlapping User Avatars requested by theme */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3 select-none">
                  <div className="w-10 h-10 rounded-full border-2 border-[#FDFBF7] bg-stone-300 overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#FDFBF7] bg-stone-400 overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#FDFBF7] bg-stone-500 overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#FDFBF7] bg-[#C4A484] text-[10px] text-white font-bold shadow-sm">
                    +2k
                  </div>
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-cafe-charcoal uppercase text-[10px] tracking-wider">Loved by 2,000+ patrons</span>
                  <span className="text-cafe-charcoal/60 text-[11px]">Across premium London glasshouses</span>
                </div>
              </div>
            </div>

            {/* Interactive Center (Col-span-7) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col sm:flex-row items-center justify-center gap-6 relative py-4 sm:pt-10">
              
              {/* Back Decorative Stats Badge */}
              <div className="absolute top-[-20px] right-10 w-44 h-44 rounded-full border border-cafe-charcoal/10 hidden xl:flex flex-col items-center justify-center space-y-1 opacity-60 scale-75 lg:scale-90 bg-white/20 backdrop-blur-sm">
                <span className="text-4xl font-serif font-light text-cafe-charcoal">4.9</span>
                <div className="flex gap-0.5 text-cafe-gold text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-cafe-charcoal/70">Trustpilot Score</span>
              </div>

              {/* 3D Folding Menu Card Mockup */}
              <div className="relative w-full max-w-72 h-[480px] glass-light rounded-3xl overflow-hidden p-6 flex flex-col hover:shadow-cafe-gold/25 hover:border-cafe-gold/50 transition-all duration-500 z-30 group select-none">
                <div className="w-full h-44 bg-cafe-smoky rounded-2xl mb-6 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-151097252790b-af4f42df8e40?q=80&w=600&auto=format&fit=crop"
                    alt="Smoked Velvet Latte"
                    className="w-full h-full object-cover opacity-85 group-hover:scale-115 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cafe-charcoal/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 text-cafe-gold block leading-none mb-1">Voted Best 2026</span>
                    <p className="font-serif text-lg italic text-[#FDFBF7]">Smoked Velvet Latte</p>
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-between">
                  {/* Card Details */}
                  <div className="space-y-3 text-left">
                    <div className="h-px bg-cafe-charcoal/10 w-full"></div>
                    <div className="flex justify-between items-center text-cafe-charcoal">
                      <span className="text-xs font-bold uppercase tracking-wider">Espresso Base</span>
                      <span className="text-xs font-serif italic text-cafe-gold font-bold">$6.50</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-cafe-charcoal/70">
                      A smooth blend of Ethiopian Yirgacheffe and Colombian beans, smoked with warm cherry wood.
                    </p>
                    
                    {/* Size Selector Mock Interaction */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button className="h-8 rounded-lg border border-cafe-charcoal/20 flex items-center justify-center text-[10px] font-bold text-cafe-charcoal hover:bg-cafe-charcoal hover:text-white transition-colors cursor-pointer">
                        SMALL
                      </button>
                      <button className="h-8 rounded-lg bg-cafe-charcoal hover:bg-cafe-gold text-white hover:text-cafe-charcoal flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer">
                        LARGE
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Trigger */}
                  <button
                    onClick={() => {
                      const gildItem: MenuItem = featuredItems.find(i => i.id === 'm1') || {
                        id: 'm1',
                        name: 'Gilded Espresso Crema',
                        description: 'Double shot of our house medium-roast single-origin premium beans, topped with a micro-sprinkle of food-grade edible gold dust.',
                        price: 6.50,
                        category: 'espresso',
                        image: 'https://images.unsplash.com/photo-151097252790b-af4f42df8e40?q=80&w=600&auto=format&fit=crop',
                        isVegan: true,
                        isGlutenFree: true,
                        isPopular: true,
                        rating: 4.9,
                        ingredients: ['Espresso', '24k Gold Flakes'],
                        calorieCount: 5
                      };
                      onAddToCart(gildItem);
                    }}
                    className="w-full py-3.5 mt-4 bg-cafe-gold hover:bg-cafe-charcoal text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>

              {/* Quick Booking Flow Overlay Card */}
              <div className="w-full max-w-72 glass-light rounded-[40px] p-7 flex flex-col justify-between text-left hover:scale-[1.02] transition-all duration-300 z-40 select-none col-span-12 sm:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif italic text-lg text-cafe-charcoal">Quick Booking</h3>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cafe-gold animate-ping"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cafe-charcoal/20"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cafe-charcoal/20"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-cafe-charcoal/50">Date & Time Target</span>
                    <div className="flex justify-between items-center bg-stone-50 border border-stone-100 p-3 rounded-xl">
                      <span className="text-xs font-bold text-cafe-charcoal">Today, Oct 24</span>
                      <span className="text-xs font-bold text-cafe-gold">04:30 PM</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-cafe-charcoal/50">Guests</span>
                      <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl text-center text-xs font-extrabold text-cafe-charcoal">02</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-cafe-charcoal/50">Table</span>
                      <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-xl text-center text-xs font-extrabold text-cafe-charcoal">Window</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full mt-4 py-2 bg-cafe-charcoal/5 hover:bg-cafe-charcoal hover:text-white rounded-lg text-[10px] font-bold text-cafe-charcoal uppercase tracking-wider transition-all cursor-pointer"
                >
                  Book Instant Room
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK TRAITS BANNER ================= */}
      <section className="bg-cafe-cream border-y border-[#deb887]/20 py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={50}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-cafe-bronze/10 flex items-center justify-center text-cafe-bronze border border-cafe-bronze/20">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-cafe-charcoal uppercase tracking-wider">Premium Extraction</h3>
                  <p className="text-xs text-cafe-charcoal/70 leading-relaxed mt-1">Slow-drips and espressos pulled strictly from 100% Arabica washed estate specialty beans.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-cafe-bronze/10 flex items-center justify-center text-cafe-bronze border border-cafe-bronze/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-cafe-charcoal uppercase tracking-wider">Glass Oasis Design</h3>
                  <p className="text-xs text-cafe-charcoal/70 leading-relaxed mt-1">Sip peacefully under modern, open-space glass structures nestled with lush green foliage.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-cafe-bronze/10 flex items-center justify-center text-cafe-bronze border border-cafe-bronze/20">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-cafe-charcoal uppercase tracking-wider">Rewards Integrated</h3>
                  <p className="text-xs text-cafe-charcoal/70 leading-relaxed mt-1">Earn 50 loyalty points per table booking and automatic multipliers on secure checkouts.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= INTERACTIVE ATMOSPHERE SYNTHESIZER ================= */}
      <section className="bg-cafe-cream py-16 border-b border-[#deb887]/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={50}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-widest font-mono block">
                  / LUXURY AMBIENT INTERACTIVITY
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-cafe-charcoal font-bold uppercase tracking-tight">
                  Design Your <br />
                  <span className="italic font-light">Sanctuary Vibe</span>
                </h2>
                <p className="text-xs sm:text-sm text-cafe-charcoal/70 leading-relaxed max-w-md">
                  Crafting a beautiful physical visit requires attention to sensory precision. Utilize our organic scent-to-sound synthesizer to experience the dynamic moisture levels, coffee steam thickness, and peaceful breeze melodies that exist inside our glasshouse domes in real-time. Unmute to listen to the live-generated synthesized sanctuary hum!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('booking')}
                    className="h-12 px-6 bg-cafe-charcoal hover:bg-cafe-gold text-white hover:text-cafe-charcoal text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <span>Pre-Book Your Table Seat</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <SanctuaryCustomizer />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= BRAND STORY TEASER ================= */}
      <section id="about-teaser" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <ScrollReveal direction="left" delay={50} className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 select-none">
              <img
                src="https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop"
                alt="Café interior"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cafe-charcoal to-transparent opacity-35"></div>
            </div>
            {/* Overlay statistics sticker */}
            <div className="absolute -bottom-6 -right-6 glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl max-w-[190px]">
              <span className="text-4xl font-serif text-cafe-gold font-bold block">100%</span>
              <span className="text-[10px] text-cafe-cream/80 uppercase tracking-widest font-mono mt-1 block leading-relaxed">
                Organic washed specialty estates
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150} className="lg:col-span-7 space-y-6">
            <span className="text-[10px] tracking-widest text-cafe-bronze uppercase font-bold block font-mono">
              / ARTISANAL PATH
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cafe-smoky">
              Crafting Safe Refuges for the Slow-Washed Generation
            </h2>
            <p className="text-xs sm:text-sm text-cafe-charcoal/85 leading-relaxed font-sans">
              Founded in 2022 on a simple belief: the world moves too quickly, but coffee should never be rushed. At Dikshu's Cafe, we pair classic French lamination methods with meticulously measured double-shot espresso extractions. 
            </p>
            <p className="text-xs sm:text-sm text-cafe-charcoal/85 leading-relaxed font-sans">
              Under our soaring glasshouse architectures, we invite you to disconnect from digital clutter, watch the natural daylight shift across raw concrete wood tables, and experience authentic human craftsmanship in progress.
            </p>
            
            <div className="pt-4">
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center space-x-1.5 px-6 py-3 border border-cafe-bronze text-cafe-bronze hover:bg-cafe-bronze hover:text-cafe-cream text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300"
              >
                <span>Read Our Journey</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-cafe-smoky text-cafe-cream py-24 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] text-cafe-gold uppercase tracking-widest font-mono font-bold">
              / COMMUNITY PRAISE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-tight uppercase">
              Heard in our Glass Parlours
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The Velvet Lavender Honey Latte is sheer sensory magic. Watching the steam drift up toward the glass ceiling of the cafe makes this my favorite morning ritual.",
                author: "Aurelia Sterling",
                role: "Brand Director"
              },
              {
                text: "Dikshu's Cafe is an architectural masterclass! The 3D folding pastry options are out of this world, and my table booking is synced with Google Calendar instantly. Exceptional service.",
                author: "Marcus Vance",
                role: "Editorial Architect"
              },
              {
                text: "Their smart AI assistant answered every dietary question about the truffle mushrooms precisely. The order was ready for dynamic pickup. I'm a customer forever.",
                author: "Dr. Elena Rostova",
                role: "Senior Biologist"
              }
            ].map((test, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 150} className="h-full">
                <div className="glass-dark p-8 rounded-2xl border border-white/5 flex flex-col justify-between h-full hover:border-cafe-gold/30 hover:scale-[1.02] transition-all duration-300">
                  <div>
                    <div className="flex items-center space-x-1 mb-4 text-cafe-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-cafe-cream/80 italic leading-relaxed font-serif">
                      "{test.text}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">{test.author}</span>
                    <span className="text-[9px] text-cafe-gold font-mono uppercase tracking-widest">{test.role}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ORDER PROMO BANNER ================= */}
      <section className="py-20 bg-cafe-cream relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cafe-smoky uppercase">
            Sip on Premium Comfort Today
          </h2>
          <p className="text-xs sm:text-sm text-cafe-charcoal/70 max-w-xl mx-auto">
            Order ahead for a quick pickup, collect reward points on your digital loyalty card, and secure your afternoon window seating in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('menu')}
              className="px-8 py-4 bg-cafe-smoky text-cafe-cream hover:bg-cafe-gold hover:text-cafe-charcoal text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl"
            >
              Order Online Now
            </button>
            <button
              onClick={() => onNavigate('booking')}
              className="px-8 py-4 bg-white hover:bg-cafe-cream text-cafe-charcoal border border-cafe-smoky/10 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300"
            >
              Reserve a Spot
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
