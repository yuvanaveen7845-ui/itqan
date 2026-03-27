'use client';

import { useEffect, useState } from 'react';

export default function MistBackground() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate 15-20 scent particles with random positions and timings
    const newParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.floor(Math.random() * 300) + 200}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 10 + 15}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 scent-mist-container z-0 opacity-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className="scent-mist-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
