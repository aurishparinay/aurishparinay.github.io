import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Calendar, MapPin, Music, Pause, Play, Sparkles, Send, 
  Clock, Check, X, Users, ChevronRight, Volume2, VolumeX, Mail, 
  ExternalLink, Image as ImageIcon, Camera, Compass, Gift, Star
} from 'lucide-react';

const EVENT_DETAILS = {
  couple: {
    groom: "Rishi",
    bride: "Aulick",
    tagline: "The Sacred Union of Two Souls",
    date: "December 03, 2026",
    isoDate: "2026-12-03T18:00:00+05:30",
    venueCity: "Surat, India"
  },
  timeline: [
    {
      year: "2022",
      title: "First Meeting",
      subtitle: "A Chance Encounter",
      desc: "Crossed paths at a serene coffee house in Indiranagar. A conversation over spices and stories that lasted until dusk.",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
    },
    {
      year: "2024",
      title: "The Proposal",
      subtitle: "Under a Canopy of Stars",
      desc: "An unforgettable twilight evening overlooking the hills of Nandi, sealed with an heirloom ring and endless promises.",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800"
    },
    {
      year: "2026",
      title: "The Parinay",
      subtitle: "Eternal Togetherness",
      desc: "We step into our new forever surrounded by sacred mantras, loved ones, and divine blessings.",
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800"
    }
  ],
  events: [
    {
      id: "haldi",
      name: "Phoolon Ki Haldi & Mehendi",
      date: "Friday, Dec 11, 2026",
      time: "10:30 AM IST",
      location: "The Tamarind Tree, Kanakapura Road",
      address: "Avaani, Royal Palms, Bengaluru, Karnataka",
      dressCode: "Sunlit Yellows, Floral Prints & Traditional Chic",
      mapUrl: "https://maps.google.com/?q=The+Tamarind+Tree+Bengaluru",
      icon: "✨",
      desc: "An auspicious morning filled with fresh marigolds, turmeric paste rituals, live henna artists, and folk music."
    },
    {
      id: "sangeet",
      name: "Royal Sangeet & Cocktail",
      date: "Friday, Dec 11, 2026",
      time: "07:00 PM IST",
      location: "Grand Ballroom, The Leela Palace",
      address: "23, HAL Old Airport Rd, Kodihalli, Bengaluru",
      dressCode: "Glitz & Glamour, Indo-Western Tuxedos & Heavy Lehengas",
      mapUrl: "https://maps.google.com/?q=The+Leela+Palace+Bengaluru",
      icon: "🎶",
      desc: "An evening of dazzling dance performances, lyrical melodies, signature royal cocktails, and celebratory toasts."
    },
    {
      id: "wedding",
      name: "The Sacred Parinay (Muhurtham)",
      date: "Saturday, Dec 12, 2026",
      time: "06:00 PM IST",
      location: "The Glass House, Taj West End",
      address: "25, Race Course Rd, Sampangi Rama Nagar, Bengaluru",
      dressCode: "Royal Ethnic / Heritage Silks & Kanjeevarams",
      mapUrl: "https://maps.google.com/?q=Taj+West+End+Bengaluru",
      icon: "💍",
      desc: "The holy Vedic wedding ceremony, exchange of varmalas, and saptapadi around the sacred fire."
    },
    {
      id: "reception",
      name: "Grand Reception",
      date: "Sunday, Dec 13, 2026",
      time: "07:30 PM IST",
      location: "JW Marriott Hotel",
      address: "24/1, Vittal Mallya Rd, Ashok Nagar, Bengaluru",
      dressCode: "Black Tie & Elegant Evening Gowns / Bandhgala",
      mapUrl: "https://maps.google.com/?q=JW+Marriott+Bengaluru",
      icon: "🥂",
      desc: "A lavish dinner feast celebrating our union with global culinary experiences and live orchestral melodies."
    }
  ],
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000",
      caption: "Moments of Joy",
      category: "engagement"
    },
    {
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000",
      caption: "Royal Grace",
      category: "rituals"
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000",
      caption: "Golden Sunset Walks",
      category: "prewedding"
    },
    {
      url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1000",
      caption: "Eternal Promises",
      category: "engagement"
    },
    {
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1000",
      caption: "Laughter & Warmth",
      category: "prewedding"
    },
    {
      url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=1000",
      caption: "Traditional Elegance",
      category: "rituals"
    }
  ]
};

export default function App() {
  // Navigation & UI States
  const [isUnveiled, setIsUnveiled] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');

  // RSVP Form state
  const [rsvpData, setRsvpData] = useState({
    name: '',
    phone: '',
    email: '',
    attending: 'yes',
    guestCount: '1',
    dietary: 'vegetarian',
    events: ['haldi', 'sangeet', 'wedding', 'reception'],
    message: ''
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Audio Reference
  const audioRef = useRef(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown calculation
  useEffect(() => {
    const target = new Date(EVENT_DETAILS.couple.isoDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Music Unveil
  const handleUnveil = () => {
    setIsUnveiled(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((err) => {
        console.log("Audio play blocked by browser:", err);
        setIsPlayingMusic(false);
      });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
        setIsPlayingMusic(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlayingMusic(true);
        }).catch(() => setIsPlayingMusic(false));
      }
    }
  };

  // RSVP Handler
  const handleRSVPSubmit = (e) => {
    e.preventDefault();
    if (!rsvpData.name || !rsvpData.phone) return;
    setRsvpSubmitted(true);
  };

  const handleEventCheck = (eventId) => {
    setRsvpData(prev => {
      const exists = prev.events.includes(eventId);
      return {
        ...prev,
        events: exists 
          ? prev.events.filter(id => id !== eventId)
          : [...prev.events, eventId]
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2C221E] font-serif relative overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#4A0E17]">
      
      {/* Background Ambient Audio */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-flute-112319.mp3" 
      />

      {/* Floating Music Control */}
      {isUnveiled && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#4A0E17] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
          title={isPlayingMusic ? "Mute Background Music" : "Play Background Music"}
        >
          {isPlayingMusic ? (
            <Volume2 className="w-5 h-5 animate-pulse text-[#F3E5AB]" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#D4AF37]" />
          )}
          <span className="absolute -top-10 right-0 bg-[#4A0E17] text-[#F3E5AB] text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#D4AF37]/30">
            {isPlayingMusic ? 'Mute Music' : 'Play Music'}
          </span>
        </button>
      )}

      {/* --- 1. ROYAL ENVELOPE / WAX SEAL UNVEIL OVERLAY --- */}
      {!isUnveiled && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#2B080D] via-[#4A0E17] to-[#1F0509] flex flex-col items-center justify-center p-6 text-center text-[#F3E5AB] transition-all duration-1000">
          
          {/* Decorative Corner Borders */}
          <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]/60 pointer-events-none" />
          <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37]/60 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37]/60 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]/60 pointer-events-none" />

          {/* Subtitle Header */}
          <div className="flex items-center gap-2 text-[#D4AF37] text-sm uppercase tracking-[0.3em] font-light mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Official Royal Invitation</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h1 className="font-serif italic text-4xl sm:text-6xl text-[#F3E5AB] mb-2 tracking-wide font-normal">
            Aurish Parinay
          </h1>
          <p className="text-xs sm:text-sm text-[#D4AF37]/80 uppercase tracking-[0.2em] max-w-md mb-8">
            Request the honor of your presence at the celebration of their matrimony
          </p>

          {/* Interactive Wax Seal Stamp */}
          <div className="relative group cursor-pointer" onClick={handleUnveil}>
            <div className="absolute -inset-4 rounded-full bg-[#D4AF37]/20 blur-md group-hover:bg-[#D4AF37]/40 transition-all duration-500 animate-pulse" />
            
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#997A15] to-[#594406] p-1 shadow-2xl flex items-center justify-center transform group-hover:scale-105 active:scale-95 transition-transform duration-300 border-2 border-[#F3E5AB]">
              <div className="w-full h-full rounded-full border border-[#FAF6EE]/40 flex flex-col items-center justify-center p-2 text-center bg-[#4A0E17]/30 backdrop-blur-sm">
                <Heart className="w-7 h-7 text-[#F3E5AB] fill-[#D4AF37] mb-1 animate-bounce" />
                <span className="text-[10px] font-bold text-[#F3E5AB] tracking-widest uppercase">
                  UNVEIL
                </span>
                <span className="text-[8px] text-[#D4AF37] tracking-wider">SEAL OF UNION</span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-[#D4AF37]/70 tracking-widest uppercase font-light animate-pulse">
            Tap the wax seal to open the invitation
          </p>
        </div>
      )}

      {}
      {/* --- 2. STICKY HEADER NAV --- */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#4A0E17]">
              Aurish<span className="text-[#D4AF37] font-light italic ml-1">Parinay</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide uppercase text-[#2C221E]/80">
            <a href="#story" className="hover:text-[#4A0E17] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#4A0E17] transition-colors">Schedule</a>
            <a href="#gallery" className="hover:text-[#4A0E17] transition-colors">Gallery</a>
            <a href="#rsvp" className="hover:text-[#4A0E17] transition-colors">RSVP</a>
          </nav>

          <a 
            href="#rsvp" 
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#4A0E17] text-[#F3E5AB] rounded-full border border-[#D4AF37] hover:bg-[#6D1522] transition-all shadow-md"
          >
            RSVP Now
          </a>
        </div>
      </header>

      {}
      {/* --- 3. HERO SECTION --- */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-[#FAF6EE] via-[#F5EEDC] to-[#FAF6EE] border-b border-[#D4AF37]/30 overflow-hidden">
        
        {/* Subtle Mandala Decorative Pattern BG */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A0E17]/5 border border-[#D4AF37]/40 text-[#4A0E17] text-xs uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Save The Date • December 12, 2026</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          <p className="text-sm sm:text-base text-[#D4AF37] font-semibold uppercase tracking-[0.3em] mb-2">
            {EVENT_DETAILS.couple.tagline}
          </p>

          <h1 className="font-serif italic text-5xl sm:text-7xl lg:text-8xl text-[#4A0E17] mb-4 font-normal leading-tight">
            {EVENT_DETAILS.couple.groom} <span className="text-[#D4AF37] font-light">&</span> {EVENT_DETAILS.couple.bride}
          </h1>

          <p className="text-base sm:text-lg text-[#2C221E]/80 max-w-xl mx-auto italic mb-8 font-serif">
            With joyous hearts and the blessings of our elders, we invite you to celebrate the beginning of our forever in {EVENT_DETAILS.couple.venueCity}.
          </p>

          {/* Live Countdown Timer */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mb-10">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Minutes', val: timeLeft.minutes },
              { label: 'Seconds', val: timeLeft.seconds }
            ].map((unit, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm border border-[#D4AF37]/40 rounded-xl p-3 sm:p-4 shadow-md flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-4xl font-bold text-[#4A0E17]">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#D4AF37] mt-1 font-sans">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#events" 
              className="px-6 py-3 rounded-full bg-[#4A0E17] text-[#F3E5AB] font-semibold text-xs sm:text-sm uppercase tracking-widest shadow-lg hover:bg-[#6D1522] transition-all flex items-center gap-2 border border-[#D4AF37]"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" /> View Schedule
            </a>
            <a 
              href="#rsvp" 
              className="px-6 py-3 rounded-full bg-white text-[#4A0E17] font-semibold text-xs sm:text-sm uppercase tracking-widest border border-[#D4AF37] shadow-sm hover:bg-[#FAF6EE] transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-[#4A0E17] fill-[#4A0E17]" /> Send Wishes
            </a>
          </div>
        </div>
      </section>

      {}
      {/* --- 4. OUR STORY TIMELINE --- */}
      <section id="story" className="py-20 px-4 max-w-5xl mx-auto border-b border-[#D4AF37]/20">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">The Beginning</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#4A0E17] mt-1">Our Journey of Love</h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
        </div>

        <div className="relative border-l-2 border-[#D4AF37]/40 ml-4 md:ml-1/2 space-y-12">
          {EVENT_DETAILS.timeline.map((item, idx) => (
            <div key={idx} className="relative pl-8 md:pl-0 flex flex-col md:flex-row items-center group">
              
              {/* Timeline Marker */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#4A0E17] border-2 border-[#D4AF37] group-hover:scale-125 transition-transform" />

              <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/30 shadow-md hover:shadow-xl transition-all">
                  <span className="inline-block px-3 py-1 bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold rounded-full mb-2">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-2xl text-[#4A0E17] font-bold">{item.title}</h3>
                  <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-sans font-semibold mb-3">{item.subtitle}</p>
                  
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover rounded-xl mb-3 border border-[#D4AF37]/20" 
                  />
                  
                  <p className="text-sm text-[#2C221E]/80 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {}
      {/* --- 5. EVENT SCHEDULE & LOCATIONS --- */}
      <section id="events" className="py-20 px-4 max-w-6xl mx-auto border-b border-[#D4AF37]/20">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Celebration Itinerary</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#4A0E17] mt-1">Wedding Ceremonies</h2>
          <p className="text-sm text-[#2C221E]/70 max-w-md mx-auto mt-2">
            Join us across two joyful days of music, vibrant colors, sacred rituals, and feast.
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EVENT_DETAILS.events.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-2xl border border-[#D4AF37]/30 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/20 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{event.icon}</span>
                  <span className="px-3 py-1 bg-[#FAF6EE] text-[#4A0E17] text-xs font-bold border border-[#D4AF37]/40 rounded-full">
                    {event.date}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#4A0E17] font-bold mb-2">{event.name}</h3>
                
                <p className="text-sm text-[#2C221E]/80 mb-6 font-sans leading-relaxed">
                  {event.desc}
                </p>

                <div className="space-y-2 text-xs font-sans text-[#2C221E]/90 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#4A0E17]">{event.location}</p>
                      <p className="text-[#2C221E]/60">{event.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#D4AF37]/15">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="italic text-[#4A0E17] font-serif">Dress Code: {event.dressCode}</span>
                  </div>
                </div>
              </div>

              <a 
                href={event.mapUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-[#D4AF37] text-[#4A0E17] hover:bg-[#4A0E17] hover:text-[#F3E5AB] font-semibold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" /> Open in Google Maps
              </a>
            </div>
          ))}
        </div>
      </section>

      {}
      {/* --- 6. PHOTO GALLERY & LIGHTBOX --- */}
      <section id="gallery" className="py-20 px-4 max-w-6xl mx-auto border-b border-[#D4AF37]/20">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Captured Memories</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#4A0E17] mt-1">Pre-Wedding Gallery</h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Moments' },
            { id: 'prewedding', label: 'Pre-Wedding' },
            { id: 'engagement', label: 'Engagement' },
            { id: 'rituals', label: 'Rituals' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#4A0E17] text-[#F3E5AB] shadow-md border border-[#D4AF37]' 
                  : 'bg-white text-[#2C221E]/70 border border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {EVENT_DETAILS.gallery
            .filter(item => activeTab === 'all' || item.category === activeTab)
            .map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedImage(img)}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-[#D4AF37]/30 shadow-md"
              >
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A0E17]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-serif text-lg">{img.caption}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] text-center" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-[#D4AF37]"
              >
                <X className="w-8 h-8" />
              </button>
              <img 
                src={selectedImage.url} 
                alt={selectedImage.caption} 
                className="max-h-[80vh] w-auto mx-auto rounded-xl border-2 border-[#D4AF37]" 
              />
              <p className="text-[#F3E5AB] font-serif text-xl mt-4">{selectedImage.caption}</p>
            </div>
          </div>
        )}
      </section>

      {}
      {/* --- 7. INTERACTIVE RSVP FORM --- */}
      <section id="rsvp" className="py-20 px-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">Your Presence Matters</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#4A0E17] mt-1">RSVP & Blessings</h2>
            <p className="text-sm text-[#2C221E]/70 mt-2">Please confirm your attendance by November 15, 2026</p>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          {rsvpSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-[#4A0E17]/10 text-[#4A0E17] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]">
                <Check className="w-8 h-8 text-[#4A0E17]" />
              </div>
              <h3 className="font-serif text-3xl text-[#4A0E17]">Thank You, {rsvpData.name}!</h3>
              <p className="text-sm text-[#2C221E]/80 max-w-md mx-auto">
                Your response has been recorded. We eagerly look forward to celebrating with you!
              </p>
              <button 
                onClick={() => setRsvpSubmitted(false)}
                className="mt-4 px-6 py-2 text-xs uppercase tracking-wider font-semibold border border-[#D4AF37] rounded-full text-[#4A0E17] hover:bg-[#FAF6EE]"
              >
                Edit Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleRSVPSubmit} className="space-y-6 font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A0E17] mb-1">Your Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={rsvpData.name}
                    onChange={e => setRsvpData({...rsvpData, name: e.target.value})}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 focus:border-[#4A0E17] focus:ring-1 focus:ring-[#4A0E17] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#4A0E17] mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={rsvpData.phone}
                    onChange={e => setRsvpData({...rsvpData, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 focus:border-[#4A0E17] focus:ring-1 focus:ring-[#4A0E17] outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A0E17] mb-1">Will You Attend?</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'yes', label: 'Joyfully Accept' },
                    { id: 'no', label: 'Regretfully Decline' }
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setRsvpData({...rsvpData, attending: opt.id})}
                      className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold border transition-all ${
                        rsvpData.attending === opt.id
                          ? 'bg-[#4A0E17] text-[#F3E5AB] border-[#D4AF37]'
                          : 'bg-white text-[#2C221E] border-[#D4AF37]/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {rsvpData.attending === 'yes' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#4A0E17] mb-1">Number of Guests</label>
                      <select 
                        value={rsvpData.guestCount}
                        onChange={e => setRsvpData({...rsvpData, guestCount: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 focus:border-[#4A0E17] outline-none text-sm"
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#4A0E17] mb-1">Dietary Preference</label>
                      <select 
                        value={rsvpData.dietary}
                        onChange={e => setRsvpData({...rsvpData, dietary: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 focus:border-[#4A0E17] outline-none text-sm"
                      >
                        <option value="vegetarian">Pure Vegetarian / Jain</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="vegan">Vegan / Gluten Free</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#4A0E17] mb-2">Events You Will Attend</label>
                    <div className="grid grid-cols-2 gap-2">
                      {EVENT_DETAILS.events.map(ev => (
                        <label key={ev.id} className="flex items-center gap-2 p-2 rounded-lg border border-[#D4AF37]/30 text-xs cursor-pointer hover:bg-[#FAF6EE]">
                          <input 
                            type="checkbox" 
                            checked={rsvpData.events.includes(ev.id)}
                            onChange={() => handleEventCheck(ev.id)}
                            className="accent-[#4A0E17]"
                          />
                          <span className="font-medium text-[#2C221E]">{ev.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A0E17] mb-1">Wishes & Notes for the Couple</label>
                <textarea 
                  rows="3"
                  value={rsvpData.message}
                  onChange={e => setRsvpData({...rsvpData, message: e.target.value})}
                  placeholder="Share a warm memory or your blessings..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 focus:border-[#4A0E17] outline-none text-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#4A0E17] text-[#F3E5AB] font-semibold text-xs uppercase tracking-widest rounded-xl border border-[#D4AF37] shadow-lg hover:bg-[#6D1522] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Confirm RSVP
              </button>
            </form>
          )}

        </div>
      </section>

      {}
      {/* --- 8. FOOTER --- */}
      <footer className="bg-[#4A0E17] text-[#F3E5AB] py-12 text-center border-t-2 border-[#D4AF37] px-4">
        <div className="max-w-md mx-auto space-y-4">
          <h3 className="font-serif italic text-3xl">Aurish Parinay</h3>
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            #AurishWedsAnanya • #AurishParinay2026
          </p>
          <div className="w-12 h-0.5 bg-[#D4AF37]/40 mx-auto" />
          <p className="text-xs text-[#F3E5AB]/70 font-sans">
            Created with love for our friends and family. See you in Bengaluru!
          </p>
        </div>
      </footer>

    </div>
  );
}