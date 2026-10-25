import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Send, Check, Phone } from 'lucide-react';

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

  const returnToHome = () => {
    setShowVenues(false);
    setShowItinerary(false);
    setShowExploreSurat(false);
    setShowTrip(false);
    setSidebarOpen(false);
    setPendingSection('home');
  };

  const handleHomeNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    returnToHome();
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
          margin-top: 0;
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
          <button
            type="button"
            className="navbar-menu"
            aria-label="Open navigation menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ border: 0, padding: 0, background: 'transparent' }}
          >
            ☰
          </button>
          <div className="navbar-divider"></div>
        </div>

        <div className="navbar-center">
          <a href="#home" aria-label="Go to home page" onClick={handleHomeNavigation}>
            <img src="/Swastik.png" alt="Swastik" className="navbar-swastik" />
          </a>
        </div>

        <div className="navbar-right">
          <a href="#rsvp" className="navbar-rsvp" onClick={handleSectionNavigation('rsvp')}>RSVP</a>
        </div>
      </nav>

      {showVenues ? (
        <main id="our-venues" style={{ marginTop: '70px' }}>
          <section style={{ position: 'relative', width: '100%', height: 'auto' }}>
            <img src="/OurVenues-Updated.png" alt="Our Venues" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <a href="https://maps.app.goo.gl/xZ8vkBGj8LJy5gjy9" target="_blank" rel="noopener noreferrer" aria-label="View Green Fusion on Google Maps" style={{ position: 'absolute', top: '33.5%', right: '3%', width: '21%', height: '2.8%' }} />
            <a href="https://maps.app.goo.gl/nP8uULEpJWJ7Hqj4A" target="_blank" rel="noopener noreferrer" aria-label="View Rosmarinus on Google Maps" style={{ position: 'absolute', top: '43.6%', right: '3%', width: '21%', height: '2.8%' }} />
            <a href="https://maps.app.goo.gl/o3NyfACKD7yFngys6" target="_blank" rel="noopener noreferrer" aria-label="View Euphoria on Google Maps" style={{ position: 'absolute', top: '53.8%', right: '3%', width: '21%', height: '2.8%' }} />
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
        <main style={{ position: 'relative', marginTop: '70px', width: '100%', aspectRatio: '3236 / 5760' }}>
          <img
            src="/Detailed%20Itinerary.png"
            alt="Detailed wedding itinerary"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
          />
          <a
            href="https://www.instagram.com/harshpatel.music/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Harsh Patel on Instagram"
            style={{ position: 'absolute', top: '28.7%', left: '17.5%', width: '15%', height: '1.25%' }}
          />
          <a
            href="https://www.youtube.com/@SingerHarshPatel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch Singer Harsh Patel on YouTube"
            style={{ position: 'absolute', top: '28.7%', left: '33.5%', width: '15%', height: '1.25%' }}
          />
          <a
            href="https://www.instagram.com/mirchirjaditya/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit RJ Aditya Hore on Instagram from the Haldi section"
            style={{ position: 'absolute', top: '52%', left: '16.5%', width: '24%', height: '2.5%', zIndex: 1, cursor: 'pointer', background: 'rgba(0, 0, 0, 0)' }}
          />
          <a
            href="https://www.instagram.com/mirchirjaditya/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit RJ Aditya Hore on Instagram from the Sangeet section"
            style={{ position: 'absolute', top: '73%', left: '16.5%', width: '24%', height: '2.5%', zIndex: 1, cursor: 'pointer', background: 'rgba(0, 0, 0, 0)' }}
          />
          <a
            href="https://www.instagram.com/devani_live/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Devani Live on Instagram"
            style={{ position: 'absolute', top: '94.3%', left: '17.6%', width: '11%', height: '1.5%' }}
          />
          <a
            href="https://www.youtube.com/@DevaniLive"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch Devani Live on YouTube"
            style={{ position: 'absolute', top: '94.3%', left: '32.4%', width: '13%', height: '1.5%' }}
          />
        </main>
      ) : (
      <main id="home" style={{ paddingTop: '70px' }}>
      {/* ─── HERO SECTION ─── */}
      <section className="hero">
        {/* Layer 0: Architecture Background */}
        <img src="/02_euphoria_architecture.png" alt="Architecture" className="hero-architecture" />
      </section>

      {/* ─── SECTION 2 ─── */}
      <section id="story" style={{ position: 'relative', width: '100%', height: 'auto' }}>
        <img src="/Section2.png" alt="A celebration of love, family, and wedding festivities" style={{ width: '100%', height: 'auto', display: 'block' }} />
        {[
          { event: 'Mehendi', top: '49.4%' },
          { event: 'Haldi', top: '63.3%' },
          { event: 'Sangeet', top: '75.4%' },
          { event: 'Wedding', top: '88.7%' },
        ].map(({ event, top }) => (
          <button
            key={event}
            type="button"
            aria-label={`View ${event} details`}
            onClick={() => openPlanPage('itinerary')}
            style={{
              position: 'absolute',
              top,
              left: '53.5%',
              width: '22%',
              height: '1.8%',
              padding: 0,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          />
        ))}
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
        backgroundAttachment: 'fixed',
        backgroundColor: '#FFF4E3'
      }}>
        <div className="absolute inset-0 bg-[#F9E3DC]/90 pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-lg">
          {/* ─── RSVP CARD ─── */}
          <div className="relative rounded-2xl" style={{
            borderStyle: 'solid',
            borderWidth: 'clamp(76px, 19vw, 112px) clamp(14px, 3.8vw, 22px) clamp(86px, 22vw, 130px)',
            borderImageSource: 'url(/Form%20Border%20Frame.png)',
            borderImageSlice: '190 30 230 30 fill',
            borderImageRepeat: 'stretch',
            backgroundColor: 'transparent',
            aspectRatio: 'auto',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '16px 8% 20px',
            overflow: 'hidden'
          }}>

            {/* ─── INNER CONTENT WRAPPER ─── */}
            <div className="relative z-10">

            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-[#f0e6d3] border-2 border-[#D9A441] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-[#D9A441]" />
                </div>
                <h3 className="text-2xl text-[#8F2438] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Thank You!
                </h3>
                <p className="text-sm text-[#8F2438]">
                  Your RSVP has been received. We look forward to celebrating with you.
                </p>
                <p className="text-sm text-[#8F2438]">
                  You can optionally join our wedding{' '}
                  <a
                    href="https://chat.whatsapp.com/D1SV2yVQ2v2F9qmbllZ7fH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-[#761B2C]"
                  >
                    WhatsApp group
                  </a>{' '}
                  for event updates and important announcements!
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs uppercase tracking-widest border border-[#D9A441] text-[#D9A441] rounded px-6 py-2 hover:bg-[#f0e6d3] transition-colors">
                  Edit Response
                </button>
              </div>
            ) : (
              <>
                {/* ─── HEADER ─── */}
                <h2 className="text-4xl text-center text-[#8F2438] mb-1 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  RSVP
                </h2>
                <p className="text-[11px] text-center uppercase tracking-[0.2em] text-[#8F2438] font-medium mb-0.5">We can't wait to celebrate</p>
                <p className="text-[11px] text-center uppercase tracking-[0.2em] text-[#8F2438] font-medium mb-4">with you!</p>
                
                <p className="text-center text-sm text-[#8F2438]/80 mb-5">
                  Please let us know if you'll be joining us for our wedding celebrations.
                </p>

                {/* ─── FORM ─── */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* NAME INPUT */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8F2438] mb-2 font-semibold">Your Name *</label>
                    <div className="relative">
                      <img src="/user.svg" alt="user" className="absolute left-3 top-3.5 w-5 h-5" />
                      <input 
                        type="text" 
                        required 
                        value={rsvp.name} 
                        onChange={e => setRsvp({ ...rsvp, name: e.target.value })} 
                        placeholder="Full name" 
                        className="w-full pl-10 pr-4 py-2 border border-[#D9A441] rounded-lg bg-[#FFF4E3] text-[#8F2438] focus:outline-none focus:border-[#8F2438] transition-colors placeholder-[#A66A50]"
                      />
                    </div>
                  </div>

                  {/* PHONE INPUT */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8F2438] mb-2 font-semibold">Phone *</label>
                    <div className="relative">
                      <img src="/phone.svg" alt="phone" className="absolute left-3 top-3.5 w-5 h-5" />
                      <input 
                        type="tel" 
                        required 
                        value={rsvp.phone} 
                        onChange={e => setRsvp({ ...rsvp, phone: e.target.value })} 
                        placeholder="+91 98765 43210" 
                        className="w-full pl-10 pr-4 py-2 border border-[#D9A441] rounded-lg bg-[#FFF4E3] text-[#8F2438] focus:outline-none focus:border-[#8F2438] transition-colors placeholder-[#A66A50]"
                      />
                    </div>
                  </div>

                  {/* ATTENDANCE BUTTONS */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8F2438] mb-3 font-semibold">Will You Attend?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setRsvp({ ...rsvp, attending: 'yes' })}
                        className={`py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-semibold border-1 transition-all flex items-center justify-center gap-2 ${
                          rsvp.attending === 'yes' 
                            ? 'bg-[#E88D91] text-white border-[#E88D91]' 
                            : 'bg-white text-[#8F2438] border-[#D9A441] hover:border-[#E88D91]'
                        }`}
                      >
                        ✓ Joyfully Accept
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setRsvp({ ...rsvp, attending: 'no' })}
                        className={`py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-semibold border-1 transition-all flex items-center justify-center gap-2 ${
                          rsvp.attending === 'no' 
                            ? 'bg-[#E88D91] text-white border-[#E88D91]' 
                            : 'bg-white text-[#8F2438] border-[#D9A441] hover:border-[#E88D91]'
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
                        <label className="block text-xs uppercase tracking-[0.15em] text-[#8F2438] mb-2 font-semibold">Number of Guests</label>
                        <div className="relative">
                          <img src="/guest.svg" alt="guest" className="absolute left-3 top-3.5 w-5 h-5" />
                          <select 
                            value={rsvp.guestCount} 
                            onChange={e => setRsvp({ ...rsvp, guestCount: e.target.value })} 
                            className="w-full pl-10 pr-4 py-2 border border-[#D9A441] rounded-lg bg-[#FFF4E3] text-[#8F2438] focus:outline-none focus:border-[#8F2438] transition-colors appearance-none cursor-pointer"
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                          </select>
                          <span className="absolute right-3 top-3.5 pointer-events-none text-[#D9A441]">▼</span>
                        </div>
                      </div>

                      {/* EVENTS CHECKBOXES */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-[#8F2438] mb-3 font-semibold">Events You'll Attend</label>
                        <div className="grid grid-cols-2 gap-3">
                          {EVENTS.map((ev, idx) => {
                            const iconFiles = ['mehandi.svg', 'haldi.svg', 'sangeet.svg', 'wedding.svg'];
                            return (
                              <label key={ev.id} className="flex items-center gap-2 p-2.5 border border-[#D9A441] rounded-lg bg-[#FFF4E3] cursor-pointer hover:border-[#E88D91] transition-colors">
                                <input 
                                  type="checkbox" 
                                  checked={rsvp.events.includes(ev.id)} 
                                  onChange={() => toggleEvent(ev.id)} 
                                  className="accent-[#E88D91] w-4 h-4" 
                                />
                                <img src={`/${iconFiles[idx]}`} alt={ev.name} className="w-5 h-5" />
                                <span className="text-xs text-[#8F2438] font-medium">{ev.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* WISHES TEXTAREA */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8F2438] mb-2 font-semibold">Wishes, Requests &amp; Ideas</label>
                    <div className="relative">
                      <textarea 
                        rows={3} 
                        value={rsvp.message} 
                        onChange={e => setRsvp({ ...rsvp, message: e.target.value })} 
                        placeholder={'💌  Anything we can help with?\nFrom food preferences and makeup artists to dance choreography and fun celebration ideas, tell us what you need!'} 
                        className="w-full px-4 py-2 border border-[#D9A441] rounded-lg bg-[#FFF4E3] text-[#8F2438] resize-none focus:outline-none focus:border-[#8F2438] transition-colors placeholder:text-xs placeholder-[#A66A50]"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-[#8F2438] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-lg hover:bg-[#761B2C] transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
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
          <div className="flex items-center justify-center gap-5 pt-2 text-[#8F2438]" aria-label="Social media and contact icons">
            <a href="https://wa.me/917349081610" target="_blank" rel="noopener noreferrer" aria-label="Message us on WhatsApp" className="inline-flex text-inherit hover:opacity-70 transition-opacity">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4Z" />
                <path d="M9 8.5c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .7.5.8 1.2 1.5 2.1 1.9.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.2.7-2 .6-1-.1-2.3-.7-3.7-1.9-1.1-1-2-2.4-2.2-3.4-.2-.9.1-1.7.6-2.5Z" />
              </svg>
            </a>
            <a href="tel:+917349081610" aria-label="Call +91 73490 81610" className="inline-flex text-inherit hover:opacity-70 transition-opacity">
              <Phone className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
