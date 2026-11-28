import type { ReactNode } from 'react';
import { AirspaceCanvas } from './AirspaceCanvas';

interface SkyBackgroundProps {
  children?: ReactNode;
  calmMode?: boolean;
}

/**
 * Fixed cinematic airspace behind every screen (see AirspaceCanvas); page
 * content scrolls over it like looking out of a cockpit window.
 */
export function SkyBackground({ children, calmMode = false }: SkyBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#1d6fd1]">
      <AirspaceCanvas calm={calmMode} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
