import type { ReactNode } from 'react';

interface ScreenHeadingProps {
  children: ReactNode;
  className?: string;
}

// Headings sit directly over the time-of-day sky gradient, which ranges from
// pale dawn pink to near-black night — dark text alone fails contrast at
// night, and light text alone fails at midday. A translucent card behind the
// text keeps it WCAG-AA legible against every sky state.
export function ScreenHeading({ children, className = '' }: ScreenHeadingProps) {
  return (
    <h1
      className={`inline-block rounded-2xl bg-white/90 px-5 py-2 font-display text-2xl font-bold text-slate-900 shadow-sm ${className}`}
    >
      {children}
    </h1>
  );
}
