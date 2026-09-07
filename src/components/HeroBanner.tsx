import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import heroAccessoriesImg from '../assets/images/tech_hero_accessories_1788669483676.jpg';
import redBlackCableImg from '../assets/images/red_black_cable_1788793385852.jpg';
import earphonesImg from '../assets/images/wired_earphones_1788669538273.jpg';
import powerBankImg from '../assets/images/power_bank_1788669551401.jpg';

interface HeroBannerProps {
  onShopNow: (categoryId?: string) => void;
}

interface SlideData {
  id: number;
  line1: string;
  line2: string;
  subtitle: string;
  features?: string[];
  categoryId?: string;
  image?: string;
  svgType?: string;
}

// Exactly 5 slides in the carousel:
// 1. Upgrade Your Tech Life
// 2. Power Up Faster (100W Super Fast Charging Cable)
// 3. Clear Sound, Everywhere
// 4. Power That Lasts
// 5. Protect Your Phone
const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    line1: 'Upgrade Your',
    line2: 'Tech Life',
    subtitle: 'Genuine Tech Accessories',
    image: heroAccessoriesImg,
  },
  {
    id: 2,
    line1: 'Power Up',
    line2: 'Faster',
    subtitle: '100W Super Fast Charging Cable',
    features: [
      '100W Fast Charging',
      '480Mbps Data Transfer',
      '1 Meter Cable',
      'Durable Nylon Braided',
    ],
    categoryId: 'cables',
    image: redBlackCableImg,
  },
  {
    id: 3,
    line1: 'Clear Sound,',
    line2: 'Everywhere',
    subtitle: 'Premium Earphones',
    categoryId: 'earphones',
    image: earphonesImg,
  },
  {
    id: 4,
    line1: 'Power That',
    line2: 'Lasts',
    subtitle: '10000mAh Power Banks',
    categoryId: 'power-banks',
    image: powerBankImg,
  },
  {
    id: 5,
    line1: 'Protect Your',
    line2: 'Phone',
    subtitle: 'Premium Mobile Cases',
    categoryId: 'cases',
    svgType: 'case',
  },
];

// Product Visuals for slides without image assets
const SlideProductVisual: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'case':
      return (
        <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 drop-shadow-xl">
          <ellipse cx="40" cy="74" rx="22" ry="4" fill="#000000" fillOpacity="0.3" />
          <rect x="20" y="8" width="40" height="60" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <rect x="24" y="12" width="32" height="52" rx="7" fill="#1e293b" />
          <path d="M19 18v-6a4 4 0 0 1 4-4h6" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M51 8h6a4 4 0 0 1 4 4v6" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M61 58v6a4 4 0 0 1-4 4h-6" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M29 68h-6a4 4 0 0 1-4-4v-6" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="25" y="14" width="13" height="16" rx="3.5" fill="#020617" stroke="#FF8C00" strokeWidth="1" />
          <circle cx="31.5" cy="18.5" r="2.8" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
          <circle cx="31.5" cy="25.5" r="2.8" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
          <circle cx="35.5" cy="22" r="1" fill="#FF8C00" />
          <circle cx="40" cy="42" r="9" stroke="#FF8C00" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.85" />
        </svg>
      );

    case 'car-charger':
      return (
        <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 drop-shadow-xl">
          <ellipse cx="40" cy="72" rx="20" ry="4" fill="#000000" fillOpacity="0.3" />
          <path
            d="M30 20h20l2.5 22h4.5a3 3 0 0 1 3 3v12a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V45a3 3 0 0 1 3-3h4.5l2.5-22z"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M36 12h8v8h-8z" fill="#FF8C00" />
          <circle cx="40" cy="12" r="3.5" fill="#FF8C00" />
          <rect x="23" y="30" width="3" height="8" rx="1.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
          <rect x="54" y="30" width="3" height="8" rx="1.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
          <rect x="30" y="47" width="9" height="5" rx="1.2" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
          <rect x="41" y="47" width="9" height="5" rx="1.2" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
          <circle cx="40" cy="56.5" r="1.8" fill="#FF8C00" />
        </svg>
      );

    case 'screen-protector':
      return (
        <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 drop-shadow-xl">
          <ellipse cx="40" cy="74" rx="20" ry="3.5" fill="#000000" fillOpacity="0.3" />
          <rect x="26" y="12" width="32" height="56" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <rect
            x="22"
            y="10"
            width="32"
            height="56"
            rx="7"
            fill="#ffffff"
            fillOpacity="0.9"
            stroke="#FF8C00"
            strokeWidth="2"
          />
          <path d="M33 14h10" stroke="#001f3f" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 56L46 16" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M46 38l6-3v6c0 4-3 7-6 8-3-1-6-4-6-8v-6l6 3z" fill="#FF8C00" stroke="#001f3f" strokeWidth="1" />
          <text x="46" y="46" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
            9H
          </text>
        </svg>
      );

    case 'memory-card':
      return (
        <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 drop-shadow-xl">
          <ellipse cx="40" cy="74" rx="20" ry="3.5" fill="#000000" fillOpacity="0.3" />
          <path
            d="M23 20a5 5 0 0 1 5-5h24a5 5 0 0 1 5 5v36a5 5 0 0 1-5 5H28a5 5 0 0 1-5-5V38l-3-3v-10l3-3v-2z"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
          />
          <rect x="29" y="17" width="3.2" height="7.5" rx="1" fill="#FF8C00" />
          <rect x="34" y="17" width="3.2" height="7.5" rx="1" fill="#FF8C00" />
          <rect x="39" y="17" width="3.2" height="7.5" rx="1" fill="#FF8C00" />
          <rect x="44" y="17" width="3.2" height="7.5" rx="1" fill="#FF8C00" />
          <rect x="49" y="19" width="3.2" height="5.5" rx="1" fill="#FF8C00" />
          <text x="39" y="38" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">
            MicroSD
          </text>
          <text x="39" y="48" textAnchor="middle" fill="#FF8C00" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">
            64 GB
          </text>
          <text x="39" y="55" textAnchor="middle" fill="#94a3b8" fontSize="5" fontWeight="bold" fontFamily="sans-serif">
            CLASS 10 U3
          </text>
        </svg>
      );

    case 'holder':
    default:
      return (
        <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 drop-shadow-xl">
          <ellipse cx="40" cy="72" rx="22" ry="5" fill="#000000" fillOpacity="0.3" />
          <ellipse cx="40" cy="67" rx="20" ry="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <path d="M40 46v21" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
          <circle cx="40" cy="42" r="6" fill="#FF8C00" stroke="#0f172a" strokeWidth="2" />
          <rect
            x="24"
            y="18"
            width="32"
            height="22"
            rx="4.5"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2"
          />
          <circle cx="40" cy="29" r="6.5" fill="#0f172a" stroke="#FF8C00" strokeWidth="1.5" />
          <circle cx="40" cy="29" r="2" fill="#FF8C00" />
          <path d="M19 29h5M56 29h5" stroke="#FF8C00" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
  }
};

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  
  // Touch swipe refs
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  // Auto-slide timer ref
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = HERO_SLIDES.length; // Exactly 10

  const nextSlide = useCallback(() => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    setSlideDirection(idx > currentSlide ? 'left' : 'right');
    setCurrentSlide(idx);
    resetAutoSlideTimer();
  };

  // Reset auto-slide timer whenever user manually swipes or taps
  const resetAutoSlideTimer = useCallback(() => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }
    autoSlideTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  }, [nextSlide]);

  // Set up auto-slide interval
  useEffect(() => {
    resetAutoSlideTimer();
    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [resetAutoSlideTimer]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwipingRef.current || touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartXRef.current - currentX;
    const diffY = touchStartYRef.current ? Math.abs(touchStartYRef.current - currentY) : 0;

    // Prevent vertical scrolling if horizontal swipe is intentional
    if (Math.abs(diffX) > 15 && Math.abs(diffX) > diffY) {
      // Intentional swipe
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwipingRef.current || touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartXRef.current - touchEndX;
    const deltaY = touchStartYRef.current !== null ? Math.abs(touchStartYRef.current - touchEndY) : 0;

    // Minimum swipe threshold 40px, and horizontal dominant
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        // Swipe Left -> Next slide
        nextSlide();
      } else {
        // Swipe Right -> Previous slide
        prevSlide();
      }
      resetAutoSlideTimer();
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isSwipingRef.current = false;
  };

  // Mouse drag handlers for desktop preview interactivity
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartXRef.current = e.clientX;
    isSwipingRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isSwipingRef.current || touchStartXRef.current === null) return;
    const deltaX = touchStartXRef.current - e.clientX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoSlideTimer();
    }
    touchStartXRef.current = null;
    isSwipingRef.current = false;
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="px-4 mt-2 shrink-0 select-none">
      {/* QukeBasket Hero Banner Container: Compact mobile hero carousel (h-[148px]) */}
      <div
        id="hero-banner-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-full h-[148px] rounded-2xl bg-[#001f3f] relative overflow-hidden text-white shadow-md cursor-grab active:cursor-grabbing"
      >
        {/* Subtle Background Geometric Glow Accents: QukeBasket Navy (#001f3f) + Orange (#FF8C00) Tech Branding */}
        <div className="absolute -right-4 top-0 bottom-0 w-48 pointer-events-none opacity-40 z-0">
          <svg viewBox="0 0 180 150" fill="none" className="w-full h-full">
            <circle cx="120" cy="75" r="65" fill="#FF8C00" fillOpacity="0.22" />
            <circle cx="155" cy="30" r="35" fill="#38bdf8" fillOpacity="0.18" />
            <rect x="65" y="18" width="85" height="114" rx="16" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Current Slide Content with Smooth Horizontal Sliding Transition */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: slideDirection === 'left' ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'left' ? -24 : 24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-0 px-4 py-3 flex items-center justify-between z-10"
          >
            {/* Left Column: Heading, Subtitle, Small Feature Points & Orange Shop Now Button */}
            <div className="flex flex-col justify-between h-full max-w-[60%] pr-2">
              <div>
                {/* 2-Line Hero Title */}
                <h2 className="text-white text-[18px] sm:text-xl font-black leading-[1.15] tracking-tight">
                  {activeSlide.line1}
                  <br />
                  <span className="text-white font-black">{activeSlide.line2}</span>
                </h2>

                {/* Subtitle */}
                <p className="text-[10.5px] sm:text-[11px] font-semibold text-orange-200/90 mt-0.5 leading-snug line-clamp-1">
                  {activeSlide.subtitle}
                </p>

                {/* Small Feature Points */}
                {activeSlide.features && activeSlide.features.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1.5">
                    {activeSlide.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 text-[9px] sm:text-[9.5px] font-medium text-slate-200 leading-tight"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C00] shrink-0 inline-block" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Orange SHOP NOW CTA Button */}
              <div className="pt-1">
                <button
                  type="button"
                  id="btn-hero-shop-now"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShopNow(activeSlide.categoryId);
                  }}
                  className="bg-[#FF8C00] text-white text-[11px] font-black px-4 py-1.5 rounded-lg hover:bg-orange-600 active:scale-95 transition-all uppercase tracking-wider cursor-pointer shadow-sm inline-flex items-center justify-center"
                >
                  SHOP NOW
                </button>
              </div>
            </div>

            {/* Right Column: Large Tech Product Visual (No extra products, no people) */}
            <div className="w-[125px] h-[125px] sm:w-[135px] sm:h-[135px] shrink-0 flex items-center justify-center relative">
              {activeSlide.image ? (
                <img
                  src={activeSlide.image}
                  alt={activeSlide.line2}
                  className="w-full h-full object-contain drop-shadow-2xl mix-blend-lighten"
                  loading="eager"
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <SlideProductVisual type={activeSlide.svgType || 'holder'} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Exactly 5 Small Pagination Dots at Bottom Center */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20"
          aria-label="Hero carousel pagination dots"
        >
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              id={`hero-dot-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                currentSlide === idx
                  ? 'w-4 h-1.5 bg-[#FF8C00]'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
