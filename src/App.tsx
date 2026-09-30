import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Send, Check, Sparkles } from 'lucide-react';

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
    accent: '#7a9e7a',
    accentLight: '#eef3ee',
    accentMid: '#a8bfa8',
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
    accent: '#7a9e7a',
    accentLight: '#eef3ee',
    accentMid: '#a8bfa8',
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
    accent: '#7a9e7a',
    accentLight: '#eef3ee',
    accentMid: '#a8bfa8',
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
    accent: '#7a9e7a',
    accentLight: '#eef3ee',
    accentMid: '#a8bfa8',
    image: '/ShadiNew.png',
  },
];

const WEDDING_ISO = '2026-12-03T18:30:00+05:30';

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(isoDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(isoDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isoDate]);
  return time;
}

// ─── SVG Illustrations removed — using image files instead ────────────────────

// ─── Shared decorations ───────────────────────────────────────────────────────
const FloralDivider = () => (
  <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#a8bfa8]" />
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="3" fill="#a8bfa8" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <ellipse key={i} cx="14" cy="14" rx="2.5" ry="5.5" fill="#c8dac8" opacity="0.8"
          transform={`rotate(${deg} 14 14) translate(0 -7)`} />
      ))}
    </svg>
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#a8bfa8]" />
  </div>
);

const LeafLeft = () => (
  <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M50 5 C20 10, 5 30, 10 70 C20 55, 35 40, 50 5Z" fill="#c8dac8" opacity="0.6" />
    <path d="M50 5 C30 15, 15 35, 10 70" stroke="#a8bfa8" strokeWidth="1" fill="none" />
    <path d="M10 70 C18 55, 28 42, 38 28" stroke="#a8bfa8" strokeWidth="0.7" fill="none" opacity="0.5" />
    <path d="M10 70 C22 52, 34 36, 44 20" stroke="#a8bfa8" strokeWidth="0.7" fill="none" opacity="0.5" />
  </svg>
);

const LeafRight = () => (
  <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}>
    <path d="M50 5 C20 10, 5 30, 10 70 C20 55, 35 40, 50 5Z" fill="#c8dac8" opacity="0.6" />
    <path d="M50 5 C30 15, 15 35, 10 70" stroke="#a8bfa8" strokeWidth="1" fill="none" />
    <path d="M10 70 C18 55, 28 42, 38 28" stroke="#a8bfa8" strokeWidth="0.7" fill="none" opacity="0.5" />
    <path d="M10 70 C22 52, 34 36, 44 20" stroke="#a8bfa8" strokeWidth="0.7" fill="none" opacity="0.5" />
  </svg>
);

const CornerFloral = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const transforms: Record<string, string> = { tl: '', tr: 'scaleX(-1)', bl: 'scaleY(-1)', br: 'scale(-1,-1)' };
  return (
    <svg width="110" height="110" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" style={{ transform: transforms[position] }}>
      <path d="M5 85 C5 50, 20 20, 85 5" stroke="#a8bfa8" strokeWidth="1.2" fill="none" />
      <ellipse cx="25" cy="60" rx="8" ry="12" fill="#d0ddd0" opacity="0.7" transform="rotate(-40 25 60)" />
      <ellipse cx="45" cy="38" rx="7" ry="11" fill="#c8dac8" opacity="0.6" transform="rotate(-55 45 38)" />
      <ellipse cx="62" cy="22" rx="6" ry="9" fill="#d0ddd0" opacity="0.55" transform="rotate(-65 62 22)" />
      <circle cx="20" cy="68" r="3" fill="#e8b89a" opacity="0.6" />
      <circle cx="52" cy="30" r="2.5" fill="#e8b89a" opacity="0.5" />
      <circle cx="70" cy="14" r="2" fill="#e8b89a" opacity="0.45" />
    </svg>
  );
};

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'fade';
};

function Reveal({ children, className = '', delay = 0, direction = 'up' }: RevealProps) {
  const { ref, visible } = useReveal(0.12);

  const base = 'transition-all duration-700 ease-out';
  const hiddenStyles: Record<string, React.CSSProperties> = {
    up:    { opacity: 0, transform: 'translateY(36px)' },
    left:  { opacity: 0, transform: 'translateX(-36px)' },
    right: { opacity: 0, transform: 'translateX(36px)' },
    fade:  { opacity: 0, transform: 'none' },
  };
  const visibleStyle: React.CSSProperties = { opacity: 1, transform: 'none', transitionDelay: `${delay}ms` };
  const hiddenStyle: React.CSSProperties = { ...hiddenStyles[direction], transitionDelay: `${delay}ms` };

  return (
    <div ref={ref} className={`${base} ${className}`} style={visible ? visibleStyle : hiddenStyle}>
      {children}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const countdown = useCountdown(WEDDING_ISO);

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
    
    // For checkboxes, append each selected event separately with the same entry ID
    rsvp.events.forEach(eventId => {
      const eventName = EVENTS.find(ev => ev.id === eventId)?.name;
      if (eventName) {
        formData.append('entry.460240215', eventName);
      }
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
    <div className="min-h-screen floral-bg text-[#3d2b1f] overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#faf7f2]/90 backdrop-blur-md border-b border-[#d0ddd0]">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <a href="#hero" className="font-script text-2xl text-[#5a7e5a] tracking-wide">
            Aurish Parinay
          </a>
          <nav className="hidden md:flex gap-7 text-xs font-medium tracking-[0.12em] uppercase text-[#5a7e5a]">
            <a href="#events" className="hover:text-[#3d2b1f] transition-colors">Schedule</a>
            <a href="#rsvp" className="hover:text-[#3d2b1f] transition-colors">RSVP</a>
          </nav>
          <a href="#rsvp"
            className="px-4 py-1.5 text-xs font-medium uppercase tracking-widest border border-[#a8bfa8] text-[#5a7e5a] rounded-full hover:bg-[#eef3ee] transition-colors">
            RSVP
          </a>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-13" />

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-5 py-20 pt-16">
        <div className="absolute top-0 left-0 pointer-events-none"><CornerFloral position="tl" /></div>
        <div className="absolute top-0 right-0 pointer-events-none"><CornerFloral position="tr" /></div>
        <div className="absolute bottom-0 left-0 pointer-events-none"><CornerFloral position="bl" /></div>
        <div className="absolute bottom-0 right-0 pointer-events-none"><CornerFloral position="br" /></div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">

          {/* Ganesha Image */}
          <div
            className="mb-8"
            style={{ animation: 'heroFadeUp 0.8s 0s ease both' }}
          >
            <img src="/GaneshaNew.png" alt="Ganesha" className="w-24 h-24 object-contain" />
          </div>

          {/* Script title */}
          <h1
            className="font-script text-6xl sm:text-8xl text-[#5a7e5a] mb-1 leading-none"
            style={{ animation: 'heroFadeUp 0.9s 0.1s ease both' }}
          >
            Aurish Parinay
          </h1>

          {/* Names with Parents */}
          <div
            className="text-center"
            style={{ animation: 'heroFadeUp 0.9s 0.2s ease both' }}
          >
            <p
              className="text-3xl sm:text-4xl text-[#3d2b1f] tracking-wide font-normal"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
              }}
            >
              Aulick
            </p>
            <p className="text-xs text-[#7a9e7a] mt-1 mb-3 tracking-widest uppercase font-medium">
              d/o Sneh Lata &amp; Vijay Prasad
            </p>

            <p className="text-sm text-[#5d4a3a] mt-4 mb-4 italic font-serif">
              with
            </p>

            <p
              className="text-3xl sm:text-4xl text-[#3d2b1f] tracking-wide font-normal"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
              }}
            >
              Rishi
            </p>
            <p className="text-xs text-[#7a9e7a] mt-1 tracking-widest uppercase font-medium">
              s/o Suman Verma &amp; Shiv Kumar Verma
            </p>
          </div>

          <div style={{ animation: 'heroFadeUp 0.9s 0.3s ease both' }}>
            <FloralDivider />
          </div>

          {/* Date — UPDATED */}
          <p
            className="text-xs uppercase tracking-[0.25em] text-[#7a9e7a] mt-1 mb-10"
            style={{ animation: 'heroFadeUp 0.9s 0.35s ease both' }}
          >
            3rd December 2026 &nbsp;·&nbsp; Surat, India
          </p>

          {/* Countdown — Single Line */}
          <div
            className="text-center mb-10"
            aria-label="Days until wedding"
            style={{ animation: 'heroFadeUp 0.9s 0.45s ease both' }}
          >
            <p className="text-4xl sm:text-5xl font-light text-[#3d2b1f]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {countdown.days} <span className="text-xs uppercase tracking-[0.2em] text-[#7a9e7a] font-medium ml-2">Days to Go</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center" style={{ animation: 'heroFadeUp 0.9s 0.55s ease both' }}>
            <a href="#events"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5a7e5a] text-white text-xs uppercase tracking-widest font-medium shadow-md hover:bg-[#4a6e4a] transition-colors">
              <Calendar className="w-3.5 h-3.5" /> View Schedule
            </a>
            <a href="#rsvp"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#a8bfa8] text-[#5a7e5a] text-xs uppercase tracking-widest font-medium hover:bg-[#eef3ee] transition-colors">
              <Heart className="w-3.5 h-3.5" /> RSVP
            </a>
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" className="py-20 px-5 bg-[#f5efe6]/40 border-y border-[#d0ddd0]">
        <div className="max-w-5xl mx-auto">

          <Reveal className="text-center mb-14" direction="fade">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#7a9e7a] mb-2">Join Us</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#3d2b1f]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300 }}>
              The Celebrations
            </h2>
            <FloralDivider />
            <p className="text-sm text-[#5d4a3a]/70 max-w-sm mx-auto mt-1">
              Four beautiful ceremonies over three days in Surat
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EVENTS.map((ev, idx) => (
              <Reveal
                key={ev.id}
                direction={idx % 2 === 0 ? 'left' : 'right'}
                delay={idx * 80}
              >
                <div className="bg-white rounded-3xl border border-[#e8ddd0] shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Event Image */}
                  <div className="w-full bg-gray-100" style={{ height: '176px', overflow: 'hidden' }}>
                    <img src={ev.image} alt={ev.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Top accent bar */}
                  <div className="h-1 w-full" style={{ backgroundColor: ev.accent }} />

                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl text-[#3d2b1f]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 400 }}>
                        {ev.name}
                      </h3>
                      <span className="text-xs font-medium px-3 py-1 rounded-full border"
                        style={{ backgroundColor: ev.accentLight, borderColor: ev.accentMid, color: '#3d2b1f' }}>
                        {ev.city}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-sm text-[#5d4a3a] mb-6">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 shrink-0 text-[#a8bfa8]" />
                        <span>{ev.day}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 shrink-0 text-[#a8bfa8]" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 shrink-0 text-[#a8bfa8] mt-0.5" />
                        <span className="font-medium text-[#3d2b1f]">{ev.venue}, {ev.city}</span>
                      </div>
                    </div>

                    <a href={ev.mapUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs uppercase tracking-wider font-medium border transition-colors"
                      style={{ borderColor: ev.accentMid, color: '#3d2b1f' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ev.accentLight; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ''; }}
                    >
                      <MapPin className="w-3.5 h-3.5" /> Open in Maps
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section id="rsvp" className="py-20 px-5">
        <div className="max-w-xl mx-auto">

          <Reveal direction="fade" className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#7a9e7a] mb-2">Your Presence</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#3d2b1f]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300 }}>
              RSVP
            </h2>
            <FloralDivider />
          </Reveal>

          <Reveal direction="up" delay={100}>
            <div className="bg-white rounded-3xl border border-[#e8ddd0] shadow-md p-7 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-40 pointer-events-none"><LeafRight /></div>
              <div className="absolute bottom-0 left-0 opacity-30 pointer-events-none" style={{ transform: 'rotate(180deg)' }}><LeafLeft /></div>

              {submitted ? (
                <div className="relative z-10 text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#eef3ee] border border-[#a8bfa8] flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7 text-[#5a7e5a]" />
                  </div>
                  <h3 className="text-3xl text-[#3d2b1f]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
                    Thank you, {rsvp.name}!
                  </h3>
                  <p className="text-sm text-[#5d4a3a]/80">
                    We've noted your response and can't wait to celebrate with you.
                  </p>
                  <button onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs uppercase tracking-widest border border-[#a8bfa8] text-[#5a7e5a] rounded-full px-5 py-1.5 hover:bg-[#eef3ee] transition-colors">
                    Edit Response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-[#7a9e7a] mb-1.5 font-medium">Your Name *</label>
                      <input type="text" required value={rsvp.name}
                        onChange={e => setRsvp({ ...rsvp, name: e.target.value })}
                        placeholder="Full name"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d0ddd0] bg-[#fafaf8] text-sm focus:outline-none focus:border-[#a8bfa8] focus:ring-1 focus:ring-[#a8bfa8] transition" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-[#7a9e7a] mb-1.5 font-medium">Phone *</label>
                      <input type="tel" required value={rsvp.phone}
                        onChange={e => setRsvp({ ...rsvp, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d0ddd0] bg-[#fafaf8] text-sm focus:outline-none focus:border-[#a8bfa8] focus:ring-1 focus:ring-[#a8bfa8] transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-[#7a9e7a] mb-2 font-medium">Will You Attend?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ id: 'yes', label: 'Joyfully Accept' }, { id: 'no', label: 'Regretfully Decline' }].map(opt => (
                        <button type="button" key={opt.id}
                          onClick={() => setRsvp({ ...rsvp, attending: opt.id as 'yes' | 'no' })}
                          className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium border transition-all ${
                            rsvp.attending === opt.id
                              ? 'bg-[#5a7e5a] text-white border-[#5a7e5a] shadow-sm'
                              : 'bg-white text-[#3d2b1f] border-[#d0ddd0] hover:border-[#a8bfa8]'
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {rsvp.attending === 'yes' && (
                    <>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-[#7a9e7a] mb-1.5 font-medium">Number of Guests</label>
                        <select value={rsvp.guestCount} onChange={e => setRsvp({ ...rsvp, guestCount: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d0ddd0] bg-[#fafaf8] text-sm focus:outline-none focus:border-[#a8bfa8] transition">
                          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.15em] text-[#7a9e7a] mb-2 font-medium">Events You'll Attend</label>
                        <div className="grid grid-cols-2 gap-2">
                          {EVENTS.map(ev => (
                            <label key={ev.id}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#e8ddd0] cursor-pointer hover:border-[#a8bfa8] hover:bg-[#f5f9f5] transition">
                              <input type="checkbox" checked={rsvp.events.includes(ev.id)}
                                onChange={() => toggleEvent(ev.id)} className="accent-[#5a7e5a] w-3.5 h-3.5" />
                              <span className="text-xs text-[#3d2b1f] font-medium leading-tight">{ev.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] text-[#7a9e7a] mb-1.5 font-medium">Wishes for the Couple</label>
                    <textarea rows={3} value={rsvp.message}
                      onChange={e => setRsvp({ ...rsvp, message: e.target.value })}
                      placeholder="Share your warmest wishes…"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d0ddd0] bg-[#fafaf8] text-sm focus:outline-none focus:border-[#a8bfa8] focus:ring-1 focus:ring-[#a8bfa8] transition resize-none" />
                  </div>

                  <button type="submit"
                    className="w-full py-3 bg-[#5a7e5a] text-white text-xs uppercase tracking-widest font-medium rounded-xl shadow-sm hover:bg-[#4a6e4a] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <Send className="w-3.5 h-3.5" /> Confirm RSVP
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#3d2b1f] text-[#f5efe6] py-12 text-center border-t border-[#5d4a3a]">
        <div className="max-w-md mx-auto space-y-3 px-5">
          <div className="flex justify-center gap-3 mb-2" aria-hidden="true">
            <LeafLeft />
            <div className="flex flex-col items-center justify-center">
              <Heart className="w-5 h-5 text-[#e8b89a] fill-[#e8b89a]" />
            </div>
            <LeafRight />
          </div>
          <h3 className="font-script text-4xl text-[#e8b89a]">Aurish Parinay</h3>
          <p className="text-xs uppercase tracking-[0.2em] text-[#a8bfa8]">
            Aulick &amp; Rishi · 3rd December 2026 · Surat
          </p>
          <div className="w-10 h-px bg-[#5d4a3a] mx-auto" />
          <p className="text-xs text-[#f5efe6]/50 font-light">Made with love for our family &amp; friends</p>
        </div>
      </footer>

      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
