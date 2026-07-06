'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);

    // Fake loading progress animation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
      setProgress(currentProgress);
    }, 60);

    // Target Date: July 11, 2026 13:00 UTC+3 (Europe/Istanbul time)
    const targetDate = new Date('2026-07-11T13:00:00+03:00').getTime();

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

    return () => {
      clearInterval(progressInterval);
      clearInterval(timer);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 15,
      },
    },
  };

  const timeUnits = [
    { label: 'GÜN', value: timeLeft.days, key: 'days' },
    { label: 'SAAT', value: timeLeft.hours, key: 'hours' },
    { label: 'DAKİKA', value: timeLeft.minutes, key: 'minutes' },
    { label: 'SANİYE', value: timeLeft.seconds, key: 'seconds' },
  ];

  return (
    <>
      {/* Custom Interactive Cursor */}
      <CustomCursor />

      {/* Preloader Screen */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              y: '-100vh',
              transition: { ease: [0.76, 0, 0.24, 1], duration: 1.0 }
            }}
            className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-[#161616]"
          >
            <div className="flex flex-col items-center gap-6">
              {/* Pulsing Logo */}
              <motion.img
                src="/logo.png"
                alt="Loading..."
                className="w-16 h-16 object-contain"
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
              
              {/* Percentage */}
              <span className="text-xs tracking-[0.4em] text-neutral-300 font-mono pl-[0.4em]">
                {String(progress).padStart(2, '0')}%
              </span>

              {/* Progress Bar */}
              <div className="w-32 h-[1px] bg-white/10 overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-[#d97c8d]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-6 py-12 select-none bg-cover bg-[position:73%_58%] md:bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.55)), url('/bg.jpg')",
          backgroundColor: '#161616',
        }}
      >

        {/* Main Content Area */}
        <main className="w-full flex-1 flex flex-col justify-center items-center text-center z-10 max-w-4xl mx-auto my-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={!loading ? "visible" : "hidden"}
            className="flex flex-col gap-10 items-center"
          >
            {/* 1. GERİ SAYIM BAŞLADI */}
            <motion.span
              variants={itemVariants}
              className="text-[10px] sm:text-xs tracking-[0.45em] font-medium text-[#d97c8d] font-sans"
              style={{
                textShadow: '0 2px 10px rgba(79, 13, 29, 0.4)',
              }}
            >
              GERİ SAYIM BAŞLADI.
            </motion.span>

            {/* 2. Static Target Date 11.07.2026 */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl font-sans font-light tracking-[0.25em] text-white leading-none pl-[0.25em]"
            >
              11.07.2026
            </motion.h1>

            {/* 3. Live Countdown Timer */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 sm:gap-8 items-center justify-center py-2 px-6 rounded-full bg-black/30 border border-white/5 backdrop-blur-md"
            >
              {timeUnits.map(({ label, value, key }, index) => (
                <div key={key} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[45px] sm:min-w-[70px]">
                    {isClient ? (
                      <div className="h-[36px] sm:h-[48px] overflow-hidden relative w-full flex items-center justify-center">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={value}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                            className="absolute text-xl sm:text-3xl font-light text-white font-mono"
                          >
                            {value}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    ) : (
                      <span className="text-xl sm:text-3xl font-light text-white/40 font-mono">--</span>
                    )}
                    <span className="text-[7px] sm:text-[8px] tracking-[0.25em] font-semibold text-[#d97c8d] mt-1 font-sans pl-[0.25em]">
                      {label}
                    </span>
                  </div>
                  {index < 3 && (
                    <span className="text-lg sm:text-2xl font-light text-white/20 sm:ml-4 sm:mr-0 ml-2 mr-2">:</span>
                  )}
                </div>
              ))}
            </motion.div>

            {/* 4. SANA GÖSTERMEMİZ GEREKEN BİR ŞEYLER VAR */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-1.5 text-center font-sans tracking-[0.3em] font-medium"
            >
              <span className="text-xs sm:text-sm text-neutral-300">
                SANA GÖSTERMEMİZ GEREKEN
              </span>
              <span className="text-xs sm:text-sm text-[#4f0d1d]" style={{ color: '#d97c8d', textShadow: '0 2px 10px rgba(79, 13, 29, 0.4)' }}>
                BİR ŞEYLER VAR.
              </span>
            </motion.div>

            {/* 5. Logo X Symbol PNG (moved from footer) */}
            <motion.div
              variants={itemVariants}
              className="mt-4"
            >
              <img
                src="/logo.png"
                alt="XEXPORT Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </motion.div>
          </motion.div>
        </main>

        {/* Footer watermark */}
        <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-max text-[9px] sm:text-[10px] tracking-[0.25em] font-light text-white/30 hover:text-white/60 transition-all duration-300 font-sans">
          <a
            href="https://themedya.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5"
          >
            <span>DIGITAL TAILORING BY</span>
            <img
              src="/themedya.png"
              alt="The Medya"
              className="h-2.5 sm:h-3 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity duration-300"
            />
          </a>
        </footer>
      </div>
    </>
  );
}
