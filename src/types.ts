export interface Moon {
  name: string;
  radiusKm: number;
  discoveryYear?: number;
  discoverer?: string;
}

export interface Planet {
  id: string;
  name: string;
  color: string;      // Tailwind color (e.g. 'text-blue-400')
  glowColor: string;  // CSS drop shadow color (e.g. '#60a5fa')
  gradientId: string; // SVG gradient ID
  gradientStops: { offset: string; color: string }[];
  radius: number;     // Visual representation size (not to scale)
  orbitRadius: number; // Visual orbit distance from center (not to scale)
  orbitalPeriodDays: number; // Real physical orbital period (for current position calculation)
  distanceFromSunAU: number;
  diameterKm: number;
  dayLengthHours: number;
  tempC: string;
  description: string;
  funFact: string;
  moons: Moon[];
  totalMoonsCount: number;
  atmosphere: string;
  surface: string;
  discoveryYear?: string | number;
  discoverer?: string;
  imagePath: string;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
}

export interface SunData {
  name: string;
  color: string;
  glowColor: string;
  gradientId: string;
  gradientStops: { offset: string; color: string }[];
  radius: number;
  diameterKm: number;
  tempC: string;
  description: string;
  funFact: string;
  mass: string;
  atmosphere: string;
  surface: string;
  discoveryYear?: string | number;
  discoverer?: string;
  imagePath: string;
}
