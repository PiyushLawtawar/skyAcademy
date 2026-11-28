import { spriteUrl, type SpriteKind } from './aircraftSprites';

/** A detailed side-profile aircraft illustration (nose right), with optional afterburner glow. */
export function AircraftImg({ kind, width = 200, burner = false, flip = false, className = '' }: { kind: SpriteKind; width?: number; burner?: boolean; flip?: boolean; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`} style={{ width, height: width / 4, transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
      {burner && (
        <span
          className="anim-flame absolute rounded-full"
          style={{
            left: `${(kind === 'tejas' ? 74 : kind === 'su30' ? 34 : 42) / 4 - 6}%`,
            top: kind === 'su30' ? '62%' : '52%',
            width: width * 0.12,
            height: width * 0.035,
            transform: 'translate(-100%, -50%)',
            background: 'radial-gradient(ellipse at right, #fff7d6 0%, #ffb347 35%, rgba(255,120,40,0.4) 65%, transparent 75%)',
            filter: 'blur(0.5px)',
          }}
        />
      )}
      <img src={spriteUrl(kind)} alt="" draggable={false} className="block h-full w-full select-none" />
    </span>
  );
}
