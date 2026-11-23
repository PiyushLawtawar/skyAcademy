import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'night';

function timeOfDayNow(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'sunset';
  return 'night';
}

const GRADIENTS: Record<TimeOfDay, string> = {
  dawn: 'linear-gradient(180deg, #ffd6a5 0%, #ffe8c9 45%, #cfe8ff 100%)',
  day: 'linear-gradient(180deg, #4fb3ff 0%, #7ec8ff 55%, #cdeaff 100%)',
  sunset: 'linear-gradient(180deg, #ff9a5a 0%, #ff7a8a 45%, #8a6fd6 100%)',
  night: 'linear-gradient(180deg, #1b2347 0%, #10142b 60%, #05060f 100%)',
};

interface SkyBackgroundProps {
  children?: ReactNode;
  calmMode?: boolean;
}

export function SkyBackground({ children, calmMode = false }: SkyBackgroundProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(timeOfDayNow());

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(timeOfDayNow()), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isNight = timeOfDay === 'night';

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: GRADIENTS[timeOfDay] }}>
      {isNight && <Stars calmMode={calmMode} />}
      <CloudLayer calmMode={calmMode} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Stars({ calmMode }: { calmMode: boolean }) {
  const positions = Array.from({ length: 24 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 60}%`,
    delay: (i % 5) * 0.4,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{ left: pos.left, top: pos.top }}
          animate={calmMode ? undefined : { opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: pos.delay }}
        />
      ))}
    </div>
  );
}

function CloudLayer({ calmMode }: { calmMode: boolean }) {
  const clouds = [
    { top: '10%', scale: 1, duration: 60 },
    { top: '28%', scale: 1.4, duration: 90 },
    { top: '50%', scale: 0.8, duration: 75 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      {clouds.map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: cloud.top, left: '-20%' }}
          animate={calmMode ? undefined : { x: ['0vw', '140vw'] }}
          transition={{ duration: cloud.duration, repeat: Infinity, ease: 'linear', delay: i * 8 }}
        >
          <svg width={120 * cloud.scale} height={60 * cloud.scale} viewBox="0 0 120 60">
            <ellipse cx="40" cy="38" rx="32" ry="18" fill="white" opacity={0.85} />
            <ellipse cx="70" cy="28" rx="28" ry="22" fill="white" opacity={0.85} />
            <ellipse cx="95" cy="40" rx="22" ry="14" fill="white" opacity={0.85} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
