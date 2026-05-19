declare module 'canvas-confetti' {
  export interface Options {
    particleCount?: number;
    spread?: number;
    startVelocity?: number;
    ticks?: number;
    zIndex?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
  }

  export default function confetti(options?: Options): void;
}
