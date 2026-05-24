// Orbital constants relative to J2000 epoch (January 1, 2000, 12:00 UTC)
// L0: Mean Longitude at J2000 (degrees)
// n: Mean daily motion (degrees per Earth day)
interface OrbitalElements {
  L0: number;
  n: number;
}

const orbitalElementsMap: Record<string, OrbitalElements> = {
  mercury: { L0: 252.25, n: 4.0923 },
  venus: { L0: 181.98, n: 1.6021 },
  earth: { L0: 100.46, n: 0.9856 },
  mars: { L0: 355.45, n: 0.52402 },
  jupiter: { L0: 34.40, n: 0.08308 },
  saturn: { L0: 50.08, n: 0.03346 },
  uranus: { L0: 313.23, n: 0.01173 },
  neptune: { L0: 304.88, n: 0.00598 }
};

const J2000_EPOCH = Date.UTC(2000, 0, 1, 12, 0, 0);

/**
 * Calculates the heliocentric longitude (angle in degrees) of a planet for a specific date.
 * Returns a value between 0 and 360.
 */
export function getPlanetOrbitalAngle(planetId: string, date: Date = new Date()): number {
  const elements = orbitalElementsMap[planetId];
  if (!elements) return 0;

  const msDiff = date.getTime() - J2000_EPOCH;
  const daysDiff = msDiff / (1000 * 60 * 60 * 24);

  let angle = (elements.L0 + elements.n * daysDiff) % 360;
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
}

/**
 * Calculates the real-world days since a base epoch.
 * Used for animation speeds: if they are paused and resumed, we track elapsed animation time.
 */
export function getDaysSinceJ2000(date: Date = new Date()): number {
  return (date.getTime() - J2000_EPOCH) / (1000 * 60 * 60 * 24);
}
