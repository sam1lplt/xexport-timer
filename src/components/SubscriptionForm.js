'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (emailStr) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email.');
      return;
    }
    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      // Trigger luxurious gold & white confetti
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 10000 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 30 * (timeLeft / duration);
        // Gold and white confetti
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#c5a880', '#ffffff', '#e5c090'],
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#c5a880', '#ffffff', '#e5c090'],
          })
        );
      }, 250);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 px-4">
      <AnimatePresence mode="wait">
        {status !== 'success' ? (
          <motion.form
            key="subscribe-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            <div className="relative flex items-center bg-white/70 backdrop-blur-md rounded-full border border-neutral-200 focus-within:border-[#4f0d1d] transition-colors duration-300 overflow-hidden shadow-[0_4px_20px_rgba(79,13,29,0.02)]">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                disabled={status === 'loading'}
                placeholder="Enter your email to join the circle"
                className="w-full bg-transparent py-4 pl-6 pr-14 text-sm font-sans tracking-wide text-[#161616] placeholder-neutral-400 focus:outline-none"
                style={{
                  '--color-accent': 'var(--color-accent)',
                }}
              />
              
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-2 p-3 bg-[#4f0d1d] hover:bg-[#3c0814] text-white rounded-full transition-all duration-300 flex items-center justify-center shadow-md"
                aria-label="Notify Me"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-600 font-sans pl-6 mt-1 text-left"
                >
                  {errorMessage}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.form>
        ) : (
          /* Morphed success state */
          <motion.div
            key="success-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="bg-white/80 backdrop-blur-md border border-[#4f0d1d]/15 rounded-2xl p-6 text-center shadow-[0_8px_30px_rgba(79,13,29,0.04)] relative overflow-hidden"
            style={{
              borderColor: 'rgba(79, 13, 29, 0.15)',
            }}
          >
            {/* Soft background light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79, 13, 29, 0.04)_0%,transparent_70%)] pointer-events-none" />

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#4f0d1d]/30 flex items-center justify-center bg-[#4f0d1d]/5 text-[#4f0d1d] mb-2" style={{ color: 'var(--color-accent)', borderColor: 'rgba(79, 13, 29, 0.3)' }}>
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg tracking-widest text-[#4f0d1d]">YOU ARE IN THE CIRCLE</h3>
              <p className="font-sans text-xs tracking-wider text-[#5a5a5a] max-w-xs leading-relaxed">
                An invitation will be delivered to your inbox upon our launch. Welcome to XEXPORT.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
