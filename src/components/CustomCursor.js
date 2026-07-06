'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInput, setIsInput] = useState(false);

  // Position of cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for cursor inertia
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Event listeners to detect hovers on interactive items
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isLink = target.tagName === 'A' || target.closest('a');
      const isButton = target.tagName === 'BUTTON' || target.closest('button') || target.getAttribute('role') === 'button';
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      if (isLink || isButton) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }

      if (isInputField) {
        setIsInput(true);
      } else {
        setIsInput(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 60 : isInput ? 40 : 32,
          height: isHovered ? 60 : isInput ? 40 : 32,
          borderRadius: '50%',
          border: isHovered 
            ? '1px solid #d97c8d' 
            : isInput 
            ? '1px dashed rgba(217, 124, 141, 0.4)' 
            : '1px solid rgba(217, 124, 141, 0.3)',
          backgroundColor: isHovered ? 'rgba(217, 124, 141, 0.05)' : 'rgba(0, 0, 0, 0)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'normal',
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      {/* Inner Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 8 : isInput ? 2 : 6,
          height: isHovered ? 8 : isInput ? 20 : 6,
          borderRadius: isInput ? '1px' : '50%',
          backgroundColor: '#ffffff',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      />
    </>
  );
}
