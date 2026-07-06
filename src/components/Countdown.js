'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Set opening date to September 1, 2026 00:00:00 UTC+3
    const targetDate = new Date('2026-09-01T00:00:00+03:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return { days: '00', hours: '00', minutes: '00', seconds: '00' };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Pad with leading zeros
      return {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days, key: 'days' },
    { label: 'HOURS', value: timeLeft.hours, key: 'hours' },
    { label: 'MINS', value: timeLeft.minutes, key: 'minutes' },
    { label: 'SECS', value: timeLeft.seconds, key: 'seconds' },
  ];

  if (!isClient) {
    // Return empty placeholders for SSR consistency to prevent hydration mismatch
    return (
      <div className="flex gap-4 sm:gap-8 justify-center items-center py-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-4xl sm:text-6xl md:text-7xl font-light text-neutral-800">--</div>
            <div className="text-[10px] sm:text-xs tracking-[0.2em] text-neutral-600 mt-2">...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 sm:gap-10 md:gap-12 justify-center items-center py-8">
      {timeUnits.map(({ label, value, key }) => (
        <div key={key} className="flex flex-col items-center min-w-[70px] sm:min-w-[100px] md:min-w-[120px]">
          {/* Inner glass panel with animate presence */}
          <div className="relative h-[80px] sm:h-[110px] md:h-[130px] w-full flex items-center justify-center overflow-hidden rounded-lg bg-white/70 border border-neutral-200/50 backdrop-blur-md shadow-[0_4px_20px_rgba(79,13,29,0.02)]">
            
            {/* Split background effect for premium look */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent pointer-events-none opacity-20" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-neutral-200/60 pointer-events-none" />

            <AnimatePresence>
              <motion.span
                key={value}
                initial={{ y: 35, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -35, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 15,
                }}
                className="absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl md:text-6xl font-light tracking-widest text-[#161616] font-serif"
                style={{
                  textShadow: '0 4px 20px rgba(22, 22, 22, 0.03)',
                }}
              >
                {value}
              </motion.span>
            </AnimatePresence>
          </div>
          
          <span className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] font-medium text-[#4f0d1d] mt-3 font-sans">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
