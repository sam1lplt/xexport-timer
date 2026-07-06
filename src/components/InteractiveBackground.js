'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, speed: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track Mouse
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Wave parameters - multiple layers to create depth (like draping fabric)
    const waveCount = 5;
    const waves = [];

    for (let i = 0; i < waveCount; i++) {
      const isRed = i % 2 === 0;
      const r = isRed ? 79 : 22;
      const g = isRed ? 13 : 22;
      const b = isRed ? 29 : 22;
      waves.push({
        y: height * (0.35 + i * 0.08), // slightly more compact distribution
        length: 0.0008 + Math.random() * 0.0015,
        amplitude: 25 + Math.random() * 35,
        speed: 0.003 + Math.random() * 0.007,
        phase: Math.random() * Math.PI * 2,
        color: `rgba(${r}, ${g}, ${b}, ${0.08 + (waveCount - i) * 0.04})`,
        glowColor: `rgba(${r}, ${g}, ${b}, ${0.12 + (waveCount - i) * 0.04})`,
      });
    }

    // Main animation loop
    const animate = (time) => {
      // Clear canvas with a slightly transparent overlay to create tail motion blur (very elegant) - matching Cream White
      ctx.fillStyle = 'rgba(255, 249, 238, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Lerp mouse coordinates for smooth lag effect (inertia)
      const mouse = mouseRef.current;
      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;
      mouse.x += dx * 0.05;
      mouse.y += dy * 0.05;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);

      // Draw each wave
      waves.forEach((wave, index) => {
        ctx.beginPath();
        
        // Dynamic amplitude change based on mouse speed (waves react to mouse movement)
        const activeAmplitude = wave.amplitude + Math.min(mouse.speed * 0.8, 80);
        
        for (let x = 0; x <= width; x += 2) {
          // Base wave formula
          let y = wave.y + Math.sin(x * wave.length + wave.phase) * activeAmplitude;

          // Mouse distortion: push silk threads away from or pull towards the cursor
          const distanceToMouse = Math.abs(x - mouse.x);
          const influenceRadius = 250;

          if (distanceToMouse < influenceRadius) {
            // Stronger effect closer to the cursor
            const force = (influenceRadius - distanceToMouse) / influenceRadius;
            const waveYAtMouse = wave.y + Math.sin(mouse.x * wave.length + wave.phase) * activeAmplitude;
            const verticalDiff = mouse.y - waveYAtMouse;
            
            // Warp the silk strand vertically based on cursor vertical distance
            y += verticalDiff * force * 0.3 * Math.sin(time * 0.002 + index);
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Draw style: thin, elegant paths
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.5 - index * 0.2;
        ctx.shadowColor = wave.glowColor;
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Increment wave phase for movement
        wave.phase += wave.speed;
      });

      // Subtle dust particles floating around for atmospheric texture
      ctx.shadowBlur = 0; // reset shadow blur
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // First frame trigger
    animationFrameId = requestAnimationFrame(animate);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#fff9ee',
      }}
    />
  );
}
