import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Send, Check } from 'lucide-react';

// ─── Event Data ───────────────────────────────────────────────────────────────
const EVENTS = [
  {
    id: 'mehandi',
    name: 'Mehandi',
    day: 'Tuesday, 1st December',
    time: '6:30 PM',
    venue: 'Green Fusion',
    city: 'Surat',
    mapUrl: 'https://maps.app.goo.gl/qYU4dNTZMJW1jK9NA',
    image: '/MehandiNew.png',
  },
  {
    id: 'haldi',
    name: 'Haldi',
    day: 'Wednesday, 2nd December',
    time: '10:00 AM',
    venue: 'Green Fusion',
    city: 'Surat',
    mapUrl: 'https://maps.app.goo.gl/qYU4dNTZMJW1jK9NA',
    image: '/HaldiNew.png',
  },
  {
    id: 'sangeet',
    name: 'Sangeet',
    day: 'Wednesday, 2nd December',
    time: '6:30 PM',
    venue: 'Rosmarinus Restro',
    city: 'Surat',
    mapUrl: 'https://maps.app.goo.gl/CqVaW7Eth1DmjvWY9',
    image: '/SangeetNew.png',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    day: 'Thursday, 3rd December',
    time: '6:30 PM',
    venue: 'Euphoria The Fine Dine',
    city: 'Surat',
    mapUrl: 'https://maps.app.goo.gl/WRSubrsDHtAvMCx8A',
    image: '/ShadiNew.png',
  },
];

const WEDDING_ISO = '2026-12-03T18:30:00+05:30';

function useCountdown(isoDate: string) {
  const [time, setTime] = useState({ days: 0 });
  useEffect(() => {
    const target = new Date(isoDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      setTime({ days: Math.max(0, Math.floor(diff / 86400000)) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isoDate]);
  return time;
}

export default function App() {
  const countdown = useCountdown(WEDDING_ISO);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showExploreSurat, setShowExploreSurat] = useState(false);
  const [showTrip, setShowTrip] = useState(false);
  const [showVenues, setShowVenues] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  useEffect(() => {
    if (!showItinerary && !showExploreSurat && !showTrip && !showVenues && pendingSection) {
      document.getElementById(pendingSection)?.scrollIntoView({ behavior: 'smooth' });
      setPendingSection(null);
    }
  }, [showItinerary, showExploreSurat, showTrip, showVenues, pendingSection]);

  const handleSectionNavigation = (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    setSidebarOpen(false);

    if (sectionId === 'rsvp') return;

    if (showItinerary || showExploreSurat || showTrip || showVenues) {
      event.preventDefault();
      setPendingSection(sectionId);
      setShowItinerary(false);
      setShowExploreSurat(false);
      setShowTrip(false);
      setShowVenues(false);
    }
  };

  const openPlanPage = (page: 'venues' | 'itinerary' | 'exploreSurat' | 'trip') => {
    setShowVenues(page === 'venues');
    setShowItinerary(page === 'itinerary');
    setShowExploreSurat(page === 'exploreSurat');
    setShowTrip(page === 'trip');
    setPendingSection(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [rsvp, setRsvp] = useState({
    name: '', phone: '',
    attending: 'yes' as 'yes' | 'no',
    guestCount: '1',
    events: ['mehandi', 'haldi', 'sangeet', 'wedding'],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleEvent = (id: string) => {
    setRsvp(prev => ({
      ...prev,
      events: prev.events.includes(id) ? prev.events.filter(e => e !== id) : [...prev.events, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvp.name.trim() || !rsvp.phone.trim()) return;

    const formData = new FormData();
    formData.append('entry.1170899072', rsvp.name);
    formData.append('entry.1348479287', rsvp.phone);
    formData.append('entry.1158806466', rsvp.attending === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline');
    formData.append('entry.1241236990', rsvp.guestCount);
    
    rsvp.events.forEach(eventId => {
      const eventName = EVENTS.find(ev => ev.id === eventId)?.name;
      if (eventName) formData.append('entry.460240215', eventName);
    });
    
    formData.append('entry.907231286', rsvp.message);

    try {
      await fetch(
        'https://docs.google.com/forms/d/1NgU9yuf4jEs7gxdSRx6sHWA8z7_8nkjpzc-OD4jx604/formResponse',
        { method: 'POST', body: formData, mode: 'no-cors' }
      );
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbe1be]" style={{
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%'
    }}>
      <style>{`
        /* ─── SIDEBAR ─── */
        .sidebar {
          position: fixed;
          left: 0;
          top: 70px;
          width: 280px;
          height: calc(100vh - 70px);
          background: linear-gradient(to bottom, #fbe1be 0%, #f0dcc8 100%);
          box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 99;
          overflow-y: auto;
          border-right: 2px solid #d4af37;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 2rem 0;
        }

        .sidebar-item {
          padding: 1rem 2rem;
          color: #8b3a3a;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
          cursor: pointer;
        }

        .sidebar-item:hover {
          background: rgba(212, 175, 55, 0.1);
          border-left-color: #d4af37;
          padding-left: 2.5rem;
          color: #d4af37;
        }

        .sidebar-overlay {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 98;
        }

        .sidebar-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* ─── NAVBAR ─── */
        .navbar {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          background: linear-gradient(to bottom, #fbe1be 0%, #f0dcc8 100%);
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 
            0 4px 15px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(212, 175, 55, 0.2),
            0 -2px 0 #d4af37;
          border-bottom: 2px solid #d4af37;
          height: 70px;
          gap: 2rem;
          width: 100%;
          max-width: 600px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
        }

        .navbar-menu {
          font-size: 1.5rem;
          color: #8b3a3a;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .navbar-menu:hover {
          color: #d4af37;
          transform: scale(1.1);
        }

        .navbar-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, #d4af37, transparent);
          flex-shrink: 0;
        }

        .navbar-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          flex: 1;
          height: 70px;
          min-width: 0;
        }

        .navbar-swastik {
          height: 70px;
          width: auto;
          max-width: 150px;
          object-fit: contain;
          opacity: 1;
          filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.15));
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .navbar-swastik:hover {
          transform: scale(1.05);
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          justify-content: flex-end;
        }

        .navbar-rsvp {
          padding: 0.6rem 1.8rem;
          border: none;
          color: white;
          background: linear-gradient(135deg, #8b3a3a 0%, #a44d4d 100%);
          border-radius: 25px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          box-shadow: 
            0 6px 20px rgba(139, 58, 58, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .navbar-rsvp:hover {
          background: linear-gradient(135deg, #a44d4d 0%, #b85c5c 100%);
          transform: translateY(-2px);
          box-shadow: 
            0 10px 30px rgba(139, 58, 58, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .navbar-rsvp:active {
          transform: translateY(0);
          box-shadow: 
            0 4px 15px rgba(139, 58, 58, 0.2),
            inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* ─── HERO CONTAINER ─── */
        .hero {
          position: relative;
          width: 100%;
          aspect-ratio: 887 / 1580;
          margin-top: 70px;
          overflow: hidden;
          background: #fbe1be;
        }

        /* ─── LAYER 0: ARCHITECTURE BACKGROUND ─── */
        .hero-architecture {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          z-index: 0;
        }
      `}</style>

      {/* ─── SIDEBAR OVERLAY ─── */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* ─── SIDEBAR ─── */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-menu">
          <a href="#home" className="sidebar-item" onClick={handleSectionNavigation('home')}>Home</a>
          <a href="#itinerary" className="sidebar-item" onClick={(event) => { event.preventDefault(); setShowItinerary(true); setShowExploreSurat(false); setShowTrip(false); setShowVenues(false); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Detailed Itinerary</a>
          <a href="#our-venues" className="sidebar-item" onClick={(event) => { event.preventDefault(); setShowItinerary(false); setShowExploreSurat(false); setShowTrip(false); setShowVenues(true); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Our Venues</a>
          <a href="#explore-surat" className="sidebar-item" onClick={(event) => { event.preventDefault(); setShowItinerary(false); setShowExploreSurat(true); setShowTrip(false); setShowVenues(false); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Explore Surat</a>
          <a href="#trip" className="sidebar-item" onClick={(event) => { event.preventDefault(); setShowItinerary(false); setShowExploreSurat(false); setShowTrip(true); setShowVenues(false); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Trip</a>
          <a href="#rsvp" className="sidebar-item" onClick={handleSectionNavigation('rsvp')}>RSVP</a>
        </nav>
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</div>
          <div className="navbar-divider"></div>
        </div>

        <div className="navbar-center">
          <img src="/Swastik.png" alt="Swastik" className="navbar-swastik" />
        </div>

        <div className="navbar-right">
          <a href="#rsvp" className="navbar-rsvp" onClick={handleSectionNavigation('rsvp')}>RSVP</a>
        </div>
      </nav>

      {showVenues ? (
        <main id="our-venues" style={{ marginTop: '70px' }}>
          <section style={{ position: 'relative', width: '100%', height: 'auto' }}>
            <img src="/OurVenues.png" alt="Our Venues" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <a href="https://maps.app.goo.gl/xZ8vkBGj8LJy5gjy9" target="_blank" rel="noopener noreferrer" aria-label="View Green Fusion on Google Maps" style={{ position: 'absolute', top: '25.8%', right: '3%', width: '21%', height: '2.8%' }} />
            <a href="https://maps.app.goo.gl/nP8uULEpJWJ7Hqj4A" target="_blank" rel="noopener noreferrer" aria-label="View Rosmarinus on Google Maps" style={{ position: 'absolute', top: '42.8%', right: '3%', width: '21%', height: '2.8%' }} />
            <a href="https://maps.app.goo.gl/o3NyfACKD7yFngys6" target="_blank" rel="noopener noreferrer" aria-label="View Euphoria on Google Maps" style={{ position: 'absolute', top: '59.6%', right: '3%', width: '21%', height: '2.8%' }} />
          </section>
        </main>
      ) : showTrip ? (
        <main style={{ marginTop: '70px' }}>
          <img
            src="/Trip.png"
            alt="Trip information"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </main>
      ) : showExploreSurat ? (
        <main style={{ marginTop: '70px' }}>
          <img
            src="/Explore%20Surat.png"
            alt="Explore Surat local guide"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </main>
      ) : showItinerary ? (
        <main style={{ marginTop: '70px' }}>
          <img
            src="/Detailed%20Itinerary.png"
            alt="Detailed wedding itinerary"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </main>
      ) : (
      <main id="home">
      {/* ─── HERO SECTION ─── */}
      <section className="hero">
        {/* Layer 0: Architecture Background */}
        <img src="/02_euphoria_architecture.png" alt="Architecture" className="hero-architecture" />
      </section>

      {/* ─── SECTION 2 ─── */}
      <section id="story" style={{ width: '100%', height: 'auto' }}>
        <img src="/Section2.png" alt="Section 2" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </section>

      </main>
      )}

      {!showVenues && !showTrip && !showExploreSurat && !showItinerary && (
      <section style={{ position: 'relative', width: '100%', height: 'auto' }}>
        <img
          src="/PlanDays.png"
          alt="Wedding plans by day"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {[
          { label: 'View venues', page: 'venues' as const, left: '7.8%', width: '16.5%' },
          { label: 'View itinerary', page: 'itinerary' as const, left: '30.3%', width: '17%' },
          { label: 'Explore Surat', page: 'exploreSurat' as const, left: '52.5%', width: '17%' },
          { label: 'Explore trips', page: 'trip' as const, left: '75.2%', width: '17%' },
        ].map(button => (
          <button
            key={button.page}
            type="button"
            aria-label={button.label}
            onClick={() => openPlanPage(button.page)}
            style={{
              position: 'absolute',
              top: '67.2%',
              left: button.left,
              width: button.width,
              height: '5.4%',
              padding: 0,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          />
        ))}
      </section>
      )}

      {/* ─── RSVP ─── */}
      <section id="rsvp" className="relative py-4 px-4 flex items-center justify-center" style={{
        backgroundImage: 'url(/RSVP%20Background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-xl">
          {/* ─── RSVP CARD ─── */}
          <div className="relative rounded-2xl" style={{
            borderStyle: 'solid',
            borderWidth: 'clamp(84px, 22vw, 130px) clamp(16px, 4vw, 24px) clamp(96px, 25vw, 150px)',
            borderImageSource: 'url(/Form%20Border%20Frame.png)',
            borderImageSlice: '190 30 230 30 fill',
            borderImageRepeat: 'stretch',
            backgroundColor: 'transparent',
            aspectRatio: 'auto',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '24px 10% 28px',
            overflow: 'hidden'
          }}>

            {/* ─── INNER CONTENT WRAPPER ─── */}
            <div className="relative z-10">

            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-[#f0e6d3] border-2 border-[#d4af37] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="text-2xl text-[#8b3a3a] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Thank You!
                </h3>
                <p className="text-sm text-[#6b5844]">
                  Your RSVP has been received. We look forward to celebrating with you.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs uppercase tracking-widest border border-[#d4af37] text-[#d4af37] rounded px-6 py-2 hover:bg-[#f0e6d3] transition-colors">
                  Edit Response
                </button>
              </div>
            ) : (
              <>
                {/* ─── HEADER ─── */}
                <h2 className="text-5xl text-center text-[#8b3a3a] mb-2 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  RSVP
                </h2>
                <p className="text-xs text-center uppercase tracking-[0.2em] text-[#8b3a3a] font-medium mb-1">We can't wait to celebrate</p>
                <p className="text-xs text-center uppercase tracking-[0.2em] text-[#8b3a3a] font-medium mb-6">with you!</p>
                
                <p className="text-center text-sm text-[#6b5844] mb-8">
                  Please let us know if you'll be joining us for our wedding celebrations.
                </p>

                {/* ─── FORM ─── */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NAME INPUT */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-2 font-semibold">Your Name *</label>
                    <div className="relative">
                      <img src="/user.svg" alt="user" className="absolute left-3 top-3.5 w-5 h-5" />
                      <input 
                        type="text" 
                        required 
                        value={rsvp.name} 
                        onChange={e => setRsvp({ ...rsvp, name: e.target.value })} 
                        placeholder="Full name" 
                        className="w-full pl-10 pr-4 py-2 border-1 border-[#d4af37] rounded-lg bg-[#fdfaf7] text-[#8b4513] focus:outline-none focus:border-[#8b3a3a] transition-colors placeholder-[#b8860b]"
                      />
                    </div>
                  </div>

                  {/* PHONE INPUT */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-2 font-semibold">Phone *</label>
                    <div className="relative">
                      <img src="/phone.svg" alt="phone" className="absolute left-3 top-3.5 w-5 h-5" />
                      <input 
                        type="tel" 
                        required 
                        value={rsvp.phone} 
                        onChange={e => setRsvp({ ...rsvp, phone: e.target.value })} 
                        placeholder="+91 98765 43210" 
                        className="w-full pl-10 pr-4 py-2 border-1 border-[#d4af37] rounded-lg bg-[#fdfaf7] text-[#8b4513] focus:outline-none focus:border-[#8b3a3a] transition-colors placeholder-[#b8860b]"
                      />
                    </div>
                  </div>

                  {/* ATTENDANCE BUTTONS */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-3 font-semibold">Will You Attend?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setRsvp({ ...rsvp, attending: 'yes' })}
                        className={`py-3 rounded-lg text-xs uppercase tracking-wider font-semibold border-1 transition-all flex items-center justify-center gap-2 ${
                          rsvp.attending === 'yes' 
                            ? 'bg-[#c9a96e] text-white border-[#c9a96e]' 
                            : 'bg-white text-[#8b4513] border-[#d4af37] hover:border-[#c9a96e]'
                        }`}
                      >
                        ✓ Joyfully Accept
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setRsvp({ ...rsvp, attending: 'no' })}
                        className={`py-3 rounded-lg text-xs uppercase tracking-wider font-semibold border-1 transition-all flex items-center justify-center gap-2 ${
                          rsvp.attending === 'no' 
                            ? 'bg-[#c9a96e] text-white border-[#c9a96e]' 
                            : 'bg-white text-[#8b4513] border-[#d4af37] hover:border-[#c9a96e]'
                        }`}
                      >
                        ✗ Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvp.attending === 'yes' && (
                    <>
                      {/* NUMBER OF GUESTS */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-2 font-semibold">Number of Guests</label>
                        <div className="relative">
                          <img src="/guest.svg" alt="guest" className="absolute left-3 top-3.5 w-5 h-5" />
                          <select 
                            value={rsvp.guestCount} 
                            onChange={e => setRsvp({ ...rsvp, guestCount: e.target.value })} 
                            className="w-full pl-10 pr-4 py-2 border-1 border-[#d4af37] rounded-lg bg-[#fdfaf7] text-[#8b4513] focus:outline-none focus:border-[#8b3a3a] transition-colors appearance-none cursor-pointer"
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                          </select>
                          <span className="absolute right-3 top-3.5 pointer-events-none text-[#d4af37]">▼</span>
                        </div>
                      </div>

                      {/* EVENTS CHECKBOXES */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-3 font-semibold">Events You'll Attend</label>
                        <div className="grid grid-cols-2 gap-3">
                          {EVENTS.map((ev, idx) => {
                            const iconFiles = ['mehandi.svg', 'haldi.svg', 'sangeet.svg', 'wedding.svg'];
                            return (
                              <label key={ev.id} className="flex items-center gap-2 p-3 border-1 border-[#d4af37] rounded-lg bg-white cursor-pointer hover:border-[#c9a96e] transition-colors">
                                <input 
                                  type="checkbox" 
                                  checked={rsvp.events.includes(ev.id)} 
                                  onChange={() => toggleEvent(ev.id)} 
                                  className="accent-[#c9a96e] w-4 h-4" 
                                />
                                <img src={`/${iconFiles[idx]}`} alt={ev.name} className="w-5 h-5" />
                                <span className="text-xs text-[#8b4513] font-medium">{ev.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* WISHES TEXTAREA */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-2 font-semibold">Wishes for the Couple</label>
                    <div className="relative">
                      <img src="/heart.svg" alt="heart" className="absolute left-3 top-3 w-5 h-5" />
                      <textarea 
                        rows={3} 
                        value={rsvp.message} 
                        onChange={e => setRsvp({ ...rsvp, message: e.target.value })} 
                        placeholder="Share your warmest wishes…" 
                        className="w-full pl-10 pr-4 py-2 border-1 border-[#d4af37] rounded-lg bg-[#fdfaf7] text-[#8b4513] resize-none focus:outline-none focus:border-[#8b3a3a] transition-colors placeholder-[#b8860b]"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-gradient-to-r from-[#b8956a] to-[#a67c52] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-lg hover:from-[#a67c52] hover:to-[#8b6a47] transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                  >
                    <img src="/plane.svg" alt="plane" className="w-4 h-4" />
                    Confirm RSVP
                  </button>
                </form>
              </>
            )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        backgroundImage: 'url(/Footer.png)',
        backgroundSize: '100% auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: 'transparent',
        minHeight: '230px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '32px',
        paddingBottom: '12px'
      }} className="text-[#8b3a3a] text-center border-t border-[#d4af37]">
        <div className="max-w-md mx-auto space-y-2">
          <Heart className="w-4 h-4 text-[#d4af37] fill-[#d4af37] mx-auto" />
          <h3 className="text-2xl text-[#8b3a3a] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Aulick & Rishi</h3>
          <p className="text-xs uppercase tracking-[0.12em] text-[#8b3a3a] font-medium">1st - 3rd December 2026 · Surat</p>
          <p className="text-xs text-[#8b3a3a] opacity-70">Made with love for our family &amp; friends</p>
        </div>
      </footer>
    </div>
  );
}
