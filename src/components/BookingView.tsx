import React, { useState } from 'react';
import { Calendar, User, Clock, Check, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import GlassCard from './GlassCard';

interface BookingViewProps {
  onAddBooking: (bookingData: any) => Promise<any>;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export default function BookingView({
  onAddBooking,
  userId,
  userName = '',
  userEmail = '',
  userPhone = '',
}: BookingViewProps) {
  const [step, setStep] = useState(1);
  const [guestsCount, setGuestsCount] = useState(2);
  const [tablePreference, setTablePreference] = useState<'window' | 'alcove' | 'garden' | 'bar' | 'standard'>('standard');
  const [date, setDate] = useState('2026-06-08');
  const [time, setTime] = useState('14:30');
  const [occasion, setOccasion] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Personal Info form
  const [customerName, setCustomerName] = useState(userName);
  const [customerEmail, setCustomerEmail] = useState(userEmail);
  const [customerPhone, setCustomerPhone] = useState(userPhone);

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  const timeSlots = ['09:00', '11:00', '13:00', '14:30', '16:00', '18:00', '19:30', '21:00'];

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      alert('Please fill out all contact fields');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        customerName,
        customerEmail,
        customerPhone,
        date,
        time,
        guestsCount,
        tablePreference,
        occasion,
        specialNotes,
        userId
      };

      const result = await onAddBooking(data);
      setCreatedBooking(result.booking);
      setShowSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setGuestsCount(2);
    setTablePreference('standard');
    setOccasion('');
    setSpecialNotes('');
    setShowSuccess(false);
    setCreatedBooking(null);
  };

  return (
    <div id="booking-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-widest font-mono">
            / REAL-TIME SCHEDULING
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase text-cafe-charcoal">
            Reserve your Sanctuary Spot
          </h1>
          <p className="text-xs sm:text-sm text-cafe-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Choose your desired date, guest headcount, and visual table preference in our glass parlour. Instantly synced to Google Calendar.
          </p>
        </div>

        {/* Stepper Indication bar */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-10 text-xs font-mono uppercase tracking-wider relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cafe-smoky/10 z-0 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors ${
              step >= 1 ? 'bg-cafe-smoky text-white border-cafe-smoky' : 'bg-white text-cafe-cream border-cafe-smoky/10'
            }`}>
              1
            </div>
            <span className="text-[9px] mt-1 text-cafe-charcoal/60">Layout</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors ${
              step >= 2 ? 'bg-cafe-smoky text-white border-cafe-smoky' : 'bg-white text-cafe-cream border-cafe-smoky/10'
            }`}>
              2
            </div>
            <span className="text-[9px] mt-1 text-cafe-charcoal/60">Schedule</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors ${
              step >= 3 ? 'bg-cafe-smoky text-white border-cafe-smoky' : 'bg-white text-cafe-cream border-cafe-smoky/10'
            }`}>
              3
            </div>
            <span className="text-[9px] mt-1 text-cafe-charcoal/60">Details</span>
          </div>
        </div>

        {/* Booking Master Card */}
        <GlassCard theme="light" className="max-w-2xl mx-auto" hoverEffect={false}>
          
          {!showSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* ================= STEP 1: LAYOUT & HEADCOUNT ================= */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="font-serif text-lg font-bold text-cafe-charcoal uppercase tracking-wider pb-2 border-b border-cafe-smoky/5">
                    Step 1: Party headcount &amp; Table layout preference
                  </h3>

                  {/* Guest count */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal font-sans block">
                      Number of Guests
                    </label>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestsCount(num)}
                          className={`py-2 px-1 text-xs font-mono font-bold rounded-lg border transition-colors ${
                            guestsCount === num
                              ? 'bg-cafe-smoky text-white border-cafe-smoky'
                              : 'bg-white text-cafe-smoky hover:bg-cafe-gold/10 border-[#deb887]/20'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table locations */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal block">
                      Table Zone Preference
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {[
                        { id: 'standard', name: 'Standard Seating', desc: 'Central layout parlor and general tables.' },
                        { id: 'window', name: 'Soaring Window Panel', desc: 'Sip espresso beside wide botanical windows.' },
                        { id: 'alcove', name: 'Whispering Cove Corner', desc: 'Slightly dark, private corner for meetings.' },
                        { id: 'garden', name: 'Green Garden Greenhouse', desc: 'Dine under lush hanging monsteras.' },
                        { id: 'bar', name: 'Coffee Lab Barstool', desc: 'Front-row seat observing slow extractions.' }
                      ].map((zone) => (
                        <div
                          key={zone.id}
                          onClick={() => setTablePreference(zone.id as any)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                            tablePreference === zone.id
                              ? 'bg-cafe-smoky/10 border-cafe-smoky font-semibold scale-[1.01]'
                              : 'bg-white border-[#deb887]/20 hover:border-cafe-smoky/30'
                          }`}
                        >
                          <span className="font-bold text-cafe-charcoal block truncate">{zone.name}</span>
                          <span className="text-[10px] text-cafe-charcoal/60 leading-relaxed block mt-1">{zone.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-cafe-smoky text-white hover:bg-cafe-gold hover:text-cafe-charcoal text-xs uppercase font-bold tracking-widest rounded-full transition-colors flex items-center space-x-1.5"
                    >
                      <span>Choose Schedule</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: DATE & TIME SELECTOR ================= */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="font-serif text-lg font-bold text-cafe-charcoal uppercase tracking-wider pb-2 border-b border-cafe-smoky/5">
                    Step 2: Reserve date &amp; available time slot
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Date */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal block">
                        Desired Date
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky font-mono focus:outline-none focus:border-cafe-smoky"
                      />
                    </div>

                    {/* Occasions */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal block">
                        Special Occasion (Optional)
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky focus:outline-none focus:border-cafe-smoky"
                      >
                        <option value="">No Special Occasion</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Birthday">Birthday Reunion</option>
                        <option value="Business">Business Discussion</option>
                        <option value="Date">Aesthetic Coffee Date</option>
                      </select>
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal block">
                      Select Available Time Slot
                    </label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`py-3 px-1 text-xs font-mono font-bold rounded-xl border transition-colors ${
                            time === slot
                              ? 'bg-cafe-smoky text-white border-cafe-smoky'
                              : 'bg-white text-cafe-smoky hover:bg-cafe-gold/15 border-[#deb887]/20'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-3 bg-white hover:bg-cafe-cream/50 text-cafe-smoky border border-cafe-smoky/25 text-xs uppercase font-bold tracking-widest rounded-full transition-colors flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-cafe-smoky text-white hover:bg-cafe-gold hover:text-cafe-charcoal text-xs uppercase font-bold tracking-widest rounded-full transition-colors flex items-center space-x-1.5"
                    >
                      <span>Fill Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: CONTACT FORM & NOTES ================= */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="font-serif text-lg font-bold text-cafe-charcoal uppercase tracking-wider pb-2 border-b border-cafe-smoky/5">
                    Step 3: Confirm contact &amp; special instructions
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal block">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-white border border-[#deb887]/35 rounded-xl px-4 py-3 text-xs text-cafe-smoky focus:outline-none focus:border-cafe-smoky"
                          placeholder="Elena Rostova"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal block">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-white border border-[#deb887]/35 rounded-xl px-4 py-3 text-xs text-cafe-smoky focus:outline-none focus:border-cafe-smoky"
                          placeholder="+44 7911 123456"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/35 rounded-xl px-4 py-3 text-xs text-cafe-smoky focus:outline-none focus:border-cafe-smoky"
                        placeholder="elena@cafevista.com"
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold tracking-wider text-cafe-charcoal block">
                        Dietary notes &amp; special arrangements (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/35 rounded-xl px-4 py-3 text-xs text-cafe-smoky focus:outline-none focus:border-cafe-smoky resize-none"
                        placeholder="e.g. wheelchair access, severe nuts allergy, highchair for toddler..."
                      />
                    </div>
                  </div>

                  {/* Booking Summary Checklist */}
                  <div className="p-4 bg-cafe-smoky/5 border border-cafe-smoky/10 rounded-xl space-y-1 text-xs text-cafe-charcoal/70">
                    <span className="text-[10px] uppercase font-bold text-cafe-bronze block mb-1">Reservation outline:</span>
                    <div className="flex justify-between">
                      <span>Guests Headcount:</span>
                      <strong className="text-cafe-charcoal">{guestsCount} Persons</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Table Zone Selection:</span>
                      <strong className="text-cafe-charcoal uppercase">{tablePreference} Zone</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Schedule Time:</span>
                      <strong className="text-cafe-charcoal font-mono">{date} @ {time}</strong>
                    </div>
                    {occasion && (
                      <div className="flex justify-between">
                        <span>Occasion celebrating:</span>
                        <strong className="text-cafe-charcoal uppercase">{occasion}</strong>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-3 bg-white hover:bg-cafe-cream/50 text-cafe-smoky border border-cafe-smoky/25 text-xs uppercase font-bold tracking-widest rounded-full transition-colors flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-7 py-3 bg-cafe-smoky h-11 text-white hover:bg-cafe-gold hover:text-cafe-charcoal text-xs uppercase font-bold tracking-widest rounded-full transition-colors cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <span>Validating Slot...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-cafe-gold" />
                          <span>Finalize Reservation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          ) : (
            /* Booking Success Output Screen */
            <div className="py-8 text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-400/20 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-600 block leading-tight font-bold">
                  RESERVATION APPROVED SUCCESSFULLY
                </span>
                <h3 className="font-serif text-2xl font-bold text-cafe-smoky uppercase">
                  Your Table is Secured!
                </h3>
                <p className="text-xs text-cafe-charcoal/70 max-w-sm mx-auto leading-relaxed">
                  We have registered your parlour table code <span className="font-mono font-bold text-cafe-bronze">{createdBooking?.id}</span>. An active invite is updated on your Google Calendar index.
                </p>
              </div>

              {/* Visual Ticket item summary */}
              <div className="max-w-sm mx-auto bg-white border border-[#deb887]/30 rounded-2xl p-5 text-left text-xs uppercase font-mono tracking-tight space-y-2 relative">
                {/* Visual tickets notch indicators */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-cafe-cream border-r border-[#deb887]/30 rounded-full -translate-y-1/2"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-cafe-cream border-l border-[#deb887]/30 rounded-full -translate-y-1/2"></div>

                <div className="flex justify-between">
                  <span className="text-cafe-charcoal/40">GUEST IDENT:</span>
                  <span className="font-bold text-cafe-charcoal">{createdBooking?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-charcoal/40">HEADCOUNT:</span>
                  <span className="font-bold text-cafe-charcoal">{createdBooking?.guestsCount} PERSONS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-charcoal/40">HOURS TIME:</span>
                  <span className="font-bold text-cafe-charcoal">{createdBooking?.date} @ {createdBooking?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-charcoal/40">TABLE PREF:</span>
                  <span className="font-bold text-cafe-gold font-bold">{createdBooking?.tablePreference}</span>
                </div>
              </div>

              <span>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-cafe-smoky text-white hover:bg-cafe-gold hover:text-cafe-charcoal text-xs uppercase tracking-widest rounded-full transition-colors cursor-pointer"
                >
                  Book Another Table
                </button>
              </span>
            </div>
          )}

        </GlassCard>

      </div>
    </div>
  );
}
