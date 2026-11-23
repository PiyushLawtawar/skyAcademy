export type SoundName =
  | 'tap'
  | 'correct'
  | 'almost'
  | 'starCollect'
  | 'levelUp'
  | 'jetFlyPast'
  | 'enginePing'
  | 'engineStartup'
  | 'radarPing'
  | 'cockpitBeep';

type Oscillators = 'sine' | 'triangle' | 'square' | 'sawtooth';

interface Tone {
  freq: number;
  duration: number;
  type?: Oscillators;
  gain?: number;
  slideTo?: number;
}

// All sound effects are synthesised at runtime (no audio files, no licensing
// concerns) and kept deliberately soft — nothing sudden or loud for kids.
// 'sonicBoom' and the ambient wind loop are noise-based and handled outside
// this tone-recipe table (see playSonicBoom / setAmbientWind below).
const SOUND_RECIPES: Record<SoundName, Tone[]> = {
  tap: [{ freq: 520, duration: 0.05, type: 'sine', gain: 0.12 }],
  correct: [
    { freq: 523.25, duration: 0.09, type: 'sine', gain: 0.16 },
    { freq: 659.25, duration: 0.09, type: 'sine', gain: 0.16 },
    { freq: 783.99, duration: 0.14, type: 'sine', gain: 0.18 },
  ],
  almost: [{ freq: 300, duration: 0.18, type: 'sine', gain: 0.12, slideTo: 260 }],
  starCollect: [
    { freq: 880, duration: 0.07, type: 'triangle', gain: 0.14 },
    { freq: 1174.66, duration: 0.1, type: 'triangle', gain: 0.14 },
  ],
  levelUp: [
    { freq: 523.25, duration: 0.1, type: 'triangle', gain: 0.16 },
    { freq: 659.25, duration: 0.1, type: 'triangle', gain: 0.16 },
    { freq: 783.99, duration: 0.1, type: 'triangle', gain: 0.16 },
    { freq: 1046.5, duration: 0.2, type: 'triangle', gain: 0.18 },
  ],
  jetFlyPast: [{ freq: 180, duration: 0.5, type: 'sawtooth', gain: 0.1, slideTo: 60 }],
  enginePing: [{ freq: 1200, duration: 0.04, type: 'sine', gain: 0.08 }],
  engineStartup: [
    { freq: 55, duration: 0.5, type: 'sawtooth', gain: 0.08, slideTo: 110 },
    { freq: 110, duration: 0.35, type: 'triangle', gain: 0.1 },
  ],
  radarPing: [
    { freq: 1400, duration: 0.08, type: 'sine', gain: 0.1 },
    { freq: 1400, duration: 0.06, type: 'sine', gain: 0.05 },
  ],
  cockpitBeep: [
    { freq: 1000, duration: 0.04, type: 'square', gain: 0.06 },
    { freq: 1000, duration: 0.04, type: 'square', gain: 0.06 },
  ],
};

class SoundManager {
  private ctx: AudioContext | null = null;
  private unlocked = false;
  private noiseBuffer: AudioBuffer | null = null;
  private windSource: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return null;
      this.ctx = new AudioCtor();
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer) {
      const length = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  /** Call this from the first user tap/click to satisfy the browser autoplay rule. */
  unlock(): void {
    if (this.unlocked) return;
    const ctx = this.getContext();
    if (ctx?.state === 'suspended') void ctx.resume();
    this.unlocked = true;
  }

  play(name: SoundName, { sfxEnabled }: { sfxEnabled: boolean }): void {
    if (!sfxEnabled || !this.unlocked) return;
    const ctx = this.getContext();
    if (!ctx) return;

    let startAt = ctx.currentTime;
    for (const tone of SOUND_RECIPES[name]) {
      this.playTone(ctx, tone, startAt);
      startAt += tone.duration * 0.6;
    }
  }

  /** A gentle, short sonic-boom ripple — noise-based, so it lives outside the tone table. */
  playSonicBoom({ sfxEnabled }: { sfxEnabled: boolean }): void {
    if (!sfxEnabled || !this.unlocked) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.45);

    const thump = ctx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(70, now);
    thump.frequency.exponentialRampToValueAtTime(35, now + 0.4);
    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(0.0001, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(now);
    thump.stop(now + 0.5);
  }

  /** Soft looping wind bed for the Play step. Fades in/out, never sudden. */
  setAmbientWind(enabled: boolean, { sfxEnabled }: { sfxEnabled: boolean }): void {
    if (!enabled || !sfxEnabled || !this.unlocked) {
      this.stopAmbientWind();
      return;
    }
    if (this.windSource) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const source = ctx.createBufferSource();
    source.buffer = this.getNoiseBuffer(ctx);
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 1);

    this.windSource = source;
    this.windGain = gain;
  }

  stopAmbientWind(): void {
    const ctx = this.ctx;
    if (!this.windSource || !this.windGain || !ctx) {
      this.windSource = null;
      this.windGain = null;
      return;
    }
    const source = this.windSource;
    this.windGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => {
      try {
        source.stop();
      } catch {
        // already stopped
      }
    }, 450);
    this.windSource = null;
    this.windGain = null;
  }

  private playTone(ctx: AudioContext, tone: Tone, startAt: number): void {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = tone.type ?? 'sine';
    osc.frequency.setValueAtTime(tone.freq, startAt);
    if (tone.slideTo) {
      osc.frequency.linearRampToValueAtTime(tone.slideTo, startAt + tone.duration);
    }

    const peakGain = tone.gain ?? 0.15;
    gainNode.gain.setValueAtTime(0, startAt);
    gainNode.gain.linearRampToValueAtTime(peakGain, startAt + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startAt + tone.duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + tone.duration + 0.02);
  }
}

export const soundManager = new SoundManager();
