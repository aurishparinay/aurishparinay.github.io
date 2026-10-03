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
    <div className="min-h-screen bg-[#f5e6d3]">
      <style>{`
        /* ─── SIDEBAR ─── */
        .sidebar {
          position: fixed;
          left: 0;
          top: 70px;
          width: 280px;
          height: calc(100vh - 70px);
          background: linear-gradient(to bottom, #f5e6d3 0%, #f0dcc8 100%);
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
          left: 0;
          right: 0;
          z-index: 100;
          background: linear-gradient(to bottom, #f5e6d3 0%, #f0dcc8 100%);
          padding: 0.5rem 2rem;
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
          height: calc(100vh - 70px);
          margin-top: 70px;
          overflow: hidden;
          background: #f5e6d3;
        }

        /* ─── LAYER 0: ARCHITECTURE BACKGROUND ─── */
        .hero-architecture {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
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
          <a href="#home" className="sidebar-item" onClick={() => setSidebarOpen(false)}>Home</a>
          <a href="#story" className="sidebar-item" onClick={() => setSidebarOpen(false)}>Our Story</a>
          <a href="#events" className="sidebar-item" onClick={() => setSidebarOpen(false)}>Events</a>
          <a href="#travel" className="sidebar-item" onClick={() => setSidebarOpen(false)}>Travel & Stay</a>
          <a href="#rsvp" className="sidebar-item" onClick={() => setSidebarOpen(false)}>RSVP</a>
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
          <a href="#rsvp" className="navbar-rsvp">RSVP</a>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="hero">
        {/* Layer 0: Architecture Background */}
        <img src="/02_euphoria_architecture.png" alt="Architecture" className="hero-architecture" />
      </section>

      {/* ─── SECTION 2 ─── */}
      <section id="story" style={{ width: '100%', height: 'auto' }}>
        <img src="/Section2.png" alt="Section 2" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </section>

      {/* ─── GAP SPACING ─── */}
      <div style={{ height: '40px', background: '#f5e6d3' }}></div>

      {/* ─── FESTIVITES SECTION ─── */}
      <section id="events" style={{ width: '100%', height: 'auto' }}>
        <img src="/Festivities.png" alt="Festivities" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </section>

      {/* ─── GAP SPACING ─── */}
      <div style={{ height: '40px', background: '#f5e6d3' }}></div>

      {/* ─── OUR VENUES SECTION ─── */}
      <section id="travel" style={{ width: '100%', height: 'auto' }}>
        <img src="/OurVenues.png" alt="Our Venues" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </section>

      {/* ─── RSVP ─── */}
      <section id="rsvp" className="py-20 px-6 bg-[#faf6f1]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl text-center text-[#8b3a3a] mb-12 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            RSVP
          </h2>

          <div className="bg-white rounded-lg shadow-lg p-10">
            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-[#f0e6d3] border-2 border-[#c9a96e] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-[#c9a96e]" />
                </div>
                <h3 className="text-3xl text-[#8b3a3a] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Thank You, {rsvp.name}!
                </h3>
                <p className="text-sm text-[#6b5844]">
                  Your response has been received. We look forward to celebrating with you.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs uppercase tracking-widest border border-[#c9a96e] text-[#c9a96e] rounded px-6 py-2 hover:bg-[#f0e6d3] transition-colors">
                  Edit Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-2 font-medium">Your Name *</label>
                    <input type="text" required value={rsvp.name} onChange={e => setRsvp({ ...rsvp, name: e.target.value })} placeholder="Full name" className="w-full px-4 py-3 border border-[#d9b59f] rounded bg-[#fdfaf7] focus:outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-2 font-medium">Phone *</label>
                    <input type="tel" required value={rsvp.phone} onChange={e => setRsvp({ ...rsvp, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-[#d9b59f] rounded bg-[#fdfaf7] focus:outline-none focus:border-[#c9a96e]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-3 font-medium">Will You Attend?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ id: 'yes', label: 'Joyfully Accept' }, { id: 'no', label: 'Regretfully Decline' }].map(opt => (
                      <button type="button" key={opt.id} onClick={() => setRsvp({ ...rsvp, attending: opt.id as 'yes' | 'no' })} className={`py-3 rounded text-xs uppercase tracking-wider font-medium border transition-all ${rsvp.attending === opt.id ? 'bg-[#c9a96e] text-white border-[#c9a96e]' : 'bg-white text-[#8b4513] border-[#d9b59f] hover:border-[#c9a96e]'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {rsvp.attending === 'yes' && (
                  <>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-2 font-medium">Number of Guests</label>
                      <select value={rsvp.guestCount} onChange={e => setRsvp({ ...rsvp, guestCount: e.target.value })} className="w-full px-4 py-3 border border-[#d9b59f] rounded bg-[#fdfaf7] focus:outline-none focus:border-[#c9a96e]">
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-3 font-medium">Events You'll Attend</label>
                      <div className="grid grid-cols-2 gap-3">
                        {EVENTS.map(ev => (
                          <label key={ev.id} className="flex items-center gap-2.5 p-3 border border-[#d9b59f] rounded bg-white cursor-pointer hover:border-[#c9a96e] transition-colors">
                            <input type="checkbox" checked={rsvp.events.includes(ev.id)} onChange={() => toggleEvent(ev.id)} className="accent-[#c9a96e] w-4 h-4" />
                            <span className="text-xs text-[#8b4513] font-medium">{ev.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#8b4513] mb-2 font-medium">Wishes for the Couple</label>
                  <textarea rows={3} value={rsvp.message} onChange={e => setRsvp({ ...rsvp, message: e.target.value })} placeholder="Share your warmest wishes…" className="w-full px-4 py-3 border border-[#d9b59f] rounded bg-[#fdfaf7] resize-none focus:outline-none focus:border-[#c9a96e]" />
                </div>

                <button type="submit" className="w-full py-3 bg-[#c9a96e] text-white text-xs uppercase tracking-widest font-medium rounded hover:bg-[#b8924a] transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Confirm RSVP
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gradient-to-b from-[#f0dcc8] to-[#e8d0ba] text-[#8b3a3a] py-16 text-center border-t border-[#d4af37]">
        <div className="max-w-md mx-auto space-y-4">
          <Heart className="w-6 h-6 text-[#d4af37] fill-[#d4af37] mx-auto" />
          <h3 className="text-3xl text-[#8b3a3a] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Aulick and Rishi</h3>
          <p className="text-xs uppercase tracking-[0.15em] text-[#8b3a3a] font-medium">3rd December 2026 · Surat</p>
          <p className="text-xs text-[#8b3a3a] opacity-70">Made with love for our family &amp; friends</p>
        </div>
      </footer>
    </div>
  );
}
