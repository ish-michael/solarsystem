import React, { useRef, useState, useEffect } from 'react';
import type { Planet, SunData } from '../types';
import { getPlanetOrbitalAngle } from '../utils/orbitalCalculations';

interface SolarSystemProps {
  planets: Planet[];
  sun: SunData;
  selectedPlanet: Planet | null;
  isMoonFocused: boolean;
  isLightTheme: boolean;
  showProbes: boolean;
  onSelectPlanet: (planet: Planet | null) => void;
}

export default function SolarSystem({
  planets,
  sun,
  selectedPlanet,
  isMoonFocused,
  isLightTheme,
  showProbes,
  onSelectPlanet
}: SolarSystemProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // State for driving space probe escape animations
  const [probeTime, setProbeTime] = useState(0);

  // Store the initial calculated angles for the current date once at mount
  const [initialAngles] = useState<Record<string, number>>(() => {
    const angles: Record<string, number> = {};
    planets.forEach(p => {
      angles[p.id] = getPlanetOrbitalAngle(p.id);
    });
    return angles;
  });

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Update loop for escaping space probes (loops after 800 frames)
  useEffect(() => {
    if (!showProbes) return;
    let frameId: number;
    const update = () => {
      setProbeTime(t => (t + 0.16) % 800);
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [showProbes]);

  const handleMouseEnter = (planetId: string) => {
    if (isMoonFocused) return; // Ignore hover pauses in focused view
    setHoveredPlanetId(planetId);
    setIsPaused(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (isMoonFocused) return;
    setHoveredPlanetId(null);
    
    // Start the 3-second delay before restarting animation
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  // Formula to scale moon sizes logarithmically/square-root so all are visible
  const getMoonRadius = (radiusKm: number) => {
    return Math.max(3.5, Math.min(9, 2.5 + Math.sqrt(radiusKm) * 0.11));
  };

  // Enlarge planet in moon focus mode
  const getPlanetScaleFactor = (planetId: string) => {
    if (planetId === 'jupiter' || planetId === 'saturn') return 1.8;
    return 2.5;
  };

  // Calculate coordinates for escaping probes in solar system view
  // Voyager 1
  const v1Time = probeTime;
  const v1R = 80 + v1Time * 0.52;
  const v1Angle = (0.2 + v1Time * 0.0028) * Math.PI;
  const v1X = v1R * Math.cos(v1Angle);
  const v1Y = v1R * Math.sin(v1Angle);

  // Voyager 2
  const v2Time = (probeTime + 200) % 800;
  const v2R = 100 + v2Time * 0.44;
  const v2Angle = (1.15 + v2Time * 0.002) * Math.PI;
  const v2X = v2R * Math.cos(v2Angle);
  const v2Y = v2R * Math.sin(v2Angle);

  // Pioneer 10
  const p10Time = (probeTime + 400) % 800;
  const p10R = 75 + p10Time * 0.55;
  const p10Angle = (3.1 + p10Time * 0.0024) * Math.PI;
  const p10X = p10R * Math.cos(p10Angle);
  const p10Y = p10R * Math.sin(p10Angle);

  // New Horizons
  const nhTime = (probeTime + 600) % 800;
  const nhR = 120 + nhTime * 0.4;
  const nhAngle = (4.7 + nhTime * 0.0016) * Math.PI;
  const nhX = nhR * Math.cos(nhAngle);
  const nhY = nhR * Math.sin(nhAngle);

  // Determine Focused Planet Moon variables
  let startOrbitRadius = 60;
  if (selectedPlanet) {
    const scaleFactor = getPlanetScaleFactor(selectedPlanet.id);
    const baseRadius = selectedPlanet.hasRings && selectedPlanet.ringOuterRadius 
      ? selectedPlanet.ringOuterRadius 
      : selectedPlanet.radius;
    startOrbitRadius = (baseRadius * scaleFactor) + 20;
  }

  return (
    <div className={`flex-1 relative flex items-center justify-center overflow-hidden transition-colors duration-300 ${
      isLightTheme 
        ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/30 via-stone-100/70 to-stone-50' 
        : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-gray-950'
    }`}>
      {/* 
        Dynamic play/pause notification at the top.
        Moved to top-28 (112px) to prevent overlapping the header title (top-4).
      */}
      <div className="absolute top-28 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            isPaused 
              ? 'bg-amber-500 animate-pulse' 
              : (isLightTheme ? 'bg-indigo-600 animate-ping' : 'bg-emerald-500 animate-ping')
          }`} />
          <span className={`text-xs font-bold tracking-widest uppercase ${isLightTheme ? 'text-stone-500' : 'text-slate-400'}`}>
            {isPaused 
              ? (hoveredPlanetId ? `Animation pausiert (Maus über ${planets.find(p => p.id === hoveredPlanetId)?.name})` : "Animation pausiert") 
              : "Animation aktiv"
            }
          </span>
        </div>
        {isPaused && hoveredPlanetId && (
          <span className={`text-[10px] italic font-semibold ${isLightTheme ? 'text-indigo-600' : 'text-amber-500/80'}`}>
            Startet 3 Sekunden nach Verlassen des Planeten wieder...
          </span>
        )}
      </div>

      <svg 
        viewBox="-500 -500 1000 1000" 
        className="w-full h-full max-h-[85vh] select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* SVG Glow Filter for Selected Orbit Lines */}
          <filter id="glow-orbit" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial Gradient for the Sun */}
          <radialGradient id={sun.gradientId} cx="35%" cy="35%" r="65%">
            {sun.gradientStops.map(stop => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </radialGradient>

          {/* Radial Gradients for each Planet */}
          {planets.map(planet => (
            <radialGradient key={planet.id} id={planet.gradientId} cx="30%" cy="30%" r="70%">
              {planet.gradientStops.map(stop => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </radialGradient>
          ))}

          {/* Moons shared radial gradient */}
          <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="60%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </radialGradient>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* LIGHT THEME CELESTIAL COORDINATE GRID */}
        {/* ------------------------------------------------------------- */}
        {isLightTheme && (
          <g opacity="0.3" pointerEvents="none">
            {/* Concentric coordinate gridlines */}
            <circle cx="0" cy="0" r="92" fill="none" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="172" fill="none" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="285" fill="none" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="400" fill="none" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.8" />
            
            {/* Axis coordinate lines */}
            <line x1="-480" y1="0" x2="480" y2="0" stroke="rgba(99, 102, 241, 0.06)" strokeWidth="1" />
            <line x1="0" y1="-480" x2="0" y2="480" stroke="rgba(99, 102, 241, 0.06)" strokeWidth="1" />
            <line x1="-340" y1="-340" x2="340" y2="340" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" strokeDasharray="1 3" />
            <line x1="-340" y1="340" x2="340" y2="-340" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" strokeDasharray="1 3" />
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ORBITS LAYER (Always visible, highlighted if selected) */}
        {/* ------------------------------------------------------------- */}
        <g>
          {planets.map(planet => {
            const isSelected = selectedPlanet?.id === planet.id;
            return (
              <circle
                key={`orbit-${planet.id}`}
                cx="0"
                cy="0"
                r={planet.orbitRadius}
                fill="none"
                stroke={isSelected 
                  ? (isLightTheme ? "rgba(79, 70, 229, 0.85)" : "rgba(129, 140, 248, 0.95)") 
                  : (isLightTheme ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.16)")}
                strokeWidth={isSelected ? 3.5 : 1.2}
                strokeDasharray={isSelected ? "none" : "4 4"}
                filter={isSelected ? "url(#glow-orbit)" : undefined}
                className="orbit-line transition-all duration-300"
              />
            );
          })}
        </g>

        {/* ------------------------------------------------------------- */}
        {/* CENTRAL SUN (Fades out when Moon focused) */}
        {/* ------------------------------------------------------------- */}
        <g 
          style={{ 
            opacity: isMoonFocused ? 0 : 1,
            pointerEvents: isMoonFocused ? 'none' : 'auto',
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)' 
          }}
        >
          <g 
            className="cursor-pointer"
            onClick={() => onSelectPlanet(null)}
          >
            {/* Solar outer corona glow effect */}
            <circle cx="0" cy="0" r={sun.radius + 15} fill="url(#sunGrad)" opacity={isLightTheme ? 0.08 : 0.15} className="animate-pulse" />
            <circle cx="0" cy="0" r={sun.radius + 6} fill="url(#sunGrad)" opacity={isLightTheme ? 0.25 : 0.35} />
            <circle cx="0" cy="0" r={sun.radius} fill={`url(#${sun.gradientId})`} className="glow-sun" />
          </g>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* PLANETS LAYER (Rotates & Slides) */}
        {/* ------------------------------------------------------------- */}
        {planets.map(planet => {
          const isSelected = selectedPlanet?.id === planet.id;
          const initialAngle = initialAngles[planet.id] || 0;
          
          // Keplerian orbital scaling for rotation speed
          const rotationDuration = Math.max(15, Math.min(260, planet.orbitalPeriodDays * 0.16));

          return (
            <g 
              key={`planet-orbit-group-${planet.id}`} 
              transform={`rotate(${initialAngle})`}
            >
              <g
                className="animate-orbit"
                style={{
                  animationDuration: `${rotationDuration}s`,
                  animationPlayState: isPaused ? 'paused' : 'running'
                }}
              >
                {/* Radial Translation Wrapper */}
                <g
                  style={{
                    transform: `translateX(${isMoonFocused && isSelected ? 0 : planet.orbitRadius}px)`,
                    transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isMoonFocused && !isSelected ? 0 : 1,
                  }}
                  className={`transition-opacity duration-1000`}
                >
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      if (!isMoonFocused) {
                        onSelectPlanet(isSelected ? null : planet);
                      }
                    }}
                    onMouseEnter={() => handleMouseEnter(planet.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    
                    {/* Scale Wrapper for Planet Body + Rings */}
                    <g
                      style={{
                        transform: isMoonFocused && isSelected ? `scale(${getPlanetScaleFactor(planet.id)})` : 'scale(1)',
                        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        transformOrigin: '0 0'
                      }}
                    >
                      {/* Hover halo ring */}
                      <circle
                        cx="0"
                        cy="0"
                        r={planet.radius + 6}
                        fill="none"
                        stroke={planet.glowColor}
                        strokeWidth="1.5"
                        className="opacity-0 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"
                      />

                      {/* Active Selection indicator */}
                      {isSelected && !isMoonFocused && (
                        <circle
                          cx="0"
                          cy="0"
                          r={planet.radius + 8}
                          fill="none"
                          stroke={isLightTheme ? "#4f46e5" : "#6366f1"}
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          className="animate-[spin_12s_linear_infinite]"
                        />
                      )}

                      {/* Planet Body */}
                      <circle
                        cx="0"
                        cy="0"
                        r={planet.radius}
                        fill={`url(#${planet.gradientId})`}
                        style={{ '--glow-color': planet.glowColor } as React.CSSProperties}
                        className="glow-planet"
                      />

                      {/* Planet Rings (Saturn / Uranus) */}
                      {planet.hasRings && planet.ringInnerRadius && planet.ringOuterRadius && (
                        <g transform={planet.id === 'uranus' ? 'rotate(78)' : 'rotate(-15)'}>
                          <ellipse
                            cx="0"
                            cy="0"
                            rx={planet.ringOuterRadius}
                            ry={planet.ringOuterRadius / (planet.id === 'uranus' ? 4 : 3.5)}
                            fill="none"
                            stroke={planet.id === 'uranus' 
                              ? (isLightTheme ? 'rgba(34, 211, 238, 0.4)' : 'rgba(165, 243, 252, 0.25)') 
                              : (isLightTheme ? 'rgba(194, 65, 12, 0.4)' : 'rgba(217, 119, 6, 0.45)')}
                            strokeWidth={planet.id === 'uranus' ? 2 : 5}
                          />
                          {planet.id === 'saturn' && (
                            <ellipse
                              cx="0"
                              cy="0"
                              rx={planet.ringOuterRadius - 4}
                              ry={(planet.ringOuterRadius - 4) / 3.5}
                              fill="none"
                              stroke="rgba(254, 215, 170, 0.2)"
                              strokeWidth="1"
                            />
                          )}
                        </g>
                      )}
                    </g>

                    {/* Text Label (Counter-rotated, Opacity fade) */}
                    <g 
                      transform={`rotate(${-initialAngle})`}
                      style={{
                        opacity: isMoonFocused ? 0 : 1,
                        pointerEvents: 'none',
                        transition: 'opacity 0.5s ease'
                      }}
                    >
                      <g
                        className="animate-orbit-reverse"
                        style={{
                          animationDuration: `${rotationDuration}s`,
                          animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                      >
                        <text
                          x="0"
                          y={planet.radius + 22}
                          textAnchor="middle"
                          className={`text-[10px] lg:text-xs font-bold transition-colors duration-300 ${
                            isSelected 
                              ? (isLightTheme ? 'fill-indigo-700 font-extrabold' : 'fill-indigo-300 font-extrabold') 
                              : (isLightTheme ? 'fill-stone-500 group-hover:fill-stone-900' : 'fill-slate-400/80 group-hover:fill-white')
                          }`}
                        >
                          {planet.name}
                        </text>
                      </g>
                    </g>

                  </g>
                </g>
              </g>
            </g>
          );
        })}

        {/* ------------------------------------------------------------- */}
        {/* MOON FOCUS VIEW LAYER (Fades in when Moon focused) */}
        {/* ------------------------------------------------------------- */}
        {selectedPlanet && isMoonFocused && (
          <g 
            style={{ 
              opacity: isMoonFocused ? 1 : 0, 
              transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
          >
            {/* Draw moon orbits and orbiting moons */}
            {selectedPlanet.moons.map((moon, index) => {
              // Space out moon orbits so they are clearly separated
              const moonOrbitRadius = startOrbitRadius + index * 24;

              // Keplerian orbital scaling for moon speed
              const moonDuration = 6 + index * 2.8;
              
              // Scatter initial angles so they don't form a line
              const initialMoonAngle = (index * 360) / Math.max(1, selectedPlanet.moons.length) + 15;
              const moonRadiusVal = getMoonRadius(moon.radiusKm);

              return (
                <g key={`moon-orbit-group-${moon.name}`}>
                  {/* Moon Orbit line */}
                  <circle
                    cx="0"
                    cy="0"
                    r={moonOrbitRadius}
                    fill="none"
                    stroke={isLightTheme ? "rgba(79, 70, 229, 0.18)" : "rgba(99, 102, 241, 0.2)"}
                    strokeWidth="1.2"
                    strokeDasharray="2 3"
                  />

                  {/* Rotating Moon Group */}
                  <g transform={`rotate(${initialMoonAngle})`}>
                    <g
                      className="animate-orbit"
                      style={{
                        animationDuration: `${moonDuration}s`,
                        animationPlayState: isPaused ? 'paused' : 'running'
                      }}
                    >
                      {/* Local Translation to Moon Center */}
                      <g transform={`translate(${moonOrbitRadius}, 0)`}>
                        <circle
                          cx="0"
                          cy="0"
                          r={moonRadiusVal}
                          fill="url(#moonGrad)"
                          className="filter drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]"
                        />
                        
                        {/* Upright Moon Label (Counter-rotated around moon center) */}
                        <g transform={`rotate(${-initialMoonAngle})`}>
                          <g
                            className="animate-orbit-reverse"
                            style={{
                              animationDuration: `${moonDuration}s`,
                              animationPlayState: isPaused ? 'paused' : 'running'
                            }}
                          >
                            <text
                              x="0"
                              y={-moonRadiusVal - 6}
                              textAnchor="middle"
                              className={`font-semibold text-[10px] pointer-events-none whitespace-nowrap ${
                                isLightTheme ? 'fill-stone-600' : 'fill-indigo-300/85'
                              }`}
                            >
                              {moon.name}
                            </text>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              );
            })}

            {/* ------------------------------------------------------------- */}
            {/* SPACE PROBES IN FOCUSED MOON VIEW */}
            {/* ------------------------------------------------------------- */}
            {showProbes && (
              <g>
                {/* Earth: Hubble Space Telescope */}
                {selectedPlanet.id === 'earth' && (
                  <g>
                    <circle cx="0" cy="0" r={startOrbitRadius - 10} fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
                    <g className="animate-orbit" style={{ animationDuration: '6s', animationPlayState: isPaused ? 'paused' : 'running' }}>
                      <g transform={`translate(${startOrbitRadius - 10}, 0)`}>
                        <rect x="-4" y="-2" width="8" height="4" fill={isLightTheme ? "#4b5563" : "#cbd5e1"} rx="0.5" />
                        <line x1="0" y1="-5" x2="0" y2="5" stroke="#3b82f6" strokeWidth="1.5" />
                        <text x="6" y="3" className="fill-emerald-500 font-extrabold text-[8px] pointer-events-none">Hubble</text>
                      </g>
                    </g>
                  </g>
                )}

                {/* Mars: Mars Reconnaissance Orbiter (MRO) */}
                {selectedPlanet.id === 'mars' && (
                  <g>
                    <circle cx="0" cy="0" r={startOrbitRadius - 8} fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
                    <g className="animate-orbit" style={{ animationDuration: '8s', animationPlayState: isPaused ? 'paused' : 'running' }}>
                      <g transform={`translate(${startOrbitRadius - 8}, 0)`}>
                        <circle cx="0" cy="0" r="2" fill="#d97706" />
                        <line x1="-3" y1="-2" x2="3" y2="2" stroke={isLightTheme ? "#1f2937" : "#e2e8f0"} strokeWidth="0.6" />
                        <text x="5" y="3" className="fill-emerald-500 font-extrabold text-[8px] pointer-events-none">MRO</text>
                      </g>
                    </g>
                  </g>
                )}

                {/* Jupiter: Juno (Highly elliptical polar orbit) */}
                {selectedPlanet.id === 'jupiter' && (
                  <g transform="rotate(30)">
                    <ellipse cx="0" cy="0" rx={startOrbitRadius - 8} ry={(startOrbitRadius - 8) / 2.2} fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="0.8" strokeDasharray="3 3" />
                    <g className="animate-orbit" style={{ animationDuration: '9s', animationPlayState: isPaused ? 'paused' : 'running' }}>
                      <g transform={`translate(${startOrbitRadius - 8}, 0)`}>
                        <polygon points="0,-4 3.5,2 -3.5,2" fill="#10b981" />
                        <text x="6" y="3" className="fill-emerald-500 font-extrabold text-[8px] pointer-events-none">Juno</text>
                      </g>
                    </g>
                  </g>
                )}

                {/* Saturn: Cassini Spacecraft orbiting Saturn outside rings */}
                {selectedPlanet.id === 'saturn' && (
                  <g>
                    <circle cx="0" cy="0" r={startOrbitRadius - 10} fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
                    <g className="animate-orbit" style={{ animationDuration: '11s', animationPlayState: isPaused ? 'paused' : 'running' }}>
                      <g transform={`translate(${startOrbitRadius - 10}, 0)`}>
                        <circle cx="0" cy="0" r="2.5" fill={isLightTheme ? "#374151" : "#f1f5f9"} />
                        <path d="M-4,-2 C-3,-4 3,-4 4,-2" fill="none" stroke="#f59e0b" strokeWidth="1" />
                        <text x="6" y="3" className="fill-emerald-500 font-extrabold text-[8px] pointer-events-none">Cassini</text>
                      </g>
                    </g>
                  </g>
                )}
              </g>
            )}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SPACE PROBES IN SOLAR SYSTEM VIEW */}
        {/* ------------------------------------------------------------- */}
        {showProbes && !isMoonFocused && (
          <g>
            {/* Voyager 1 */}
            <path 
              d={`M ${100 * Math.cos(0.2 * Math.PI)} ${100 * Math.sin(0.2 * Math.PI)} Q ${250 * Math.cos(0.25 * Math.PI)} ${250 * Math.sin(0.25 * Math.PI)} ${v1X} ${v1Y}`} 
              fill="none" 
              stroke="rgba(16, 185, 129, 0.4)" 
              strokeWidth="1" 
              strokeDasharray="3 3" 
            />
            <g transform={`translate(${v1X}, ${v1Y})`}>
              <circle cx="0" cy="0" r="3" fill="#10b981" />
              <circle cx="0" cy="0" r="1.5" fill="#fbbf24" />
              <line x1="0" y1="0" x2="-5" y2="5" stroke={isLightTheme ? "#4b5563" : "#cbd5e1"} strokeWidth="0.6" />
              <text x="6" y="2" className="fill-emerald-500 font-extrabold text-[8px] pointer-events-none">Voyager 1</text>
            </g>

            {/* Voyager 2 */}
            <path 
              d={`M ${120 * Math.cos(1.15 * Math.PI)} ${120 * Math.sin(1.15 * Math.PI)} Q ${280 * Math.cos(1.2 * Math.PI)} ${280 * Math.sin(1.2 * Math.PI)} ${v2X} ${v2Y}`} 
              fill="none" 
              stroke="rgba(16, 185, 129, 0.4)" 
              strokeWidth="1" 
              strokeDasharray="3 3" 
            />
            <g transform={`translate(${v2X}, ${v2Y})`}>
              <circle cx="0" cy="0" r="3" fill="#10b981" />
              <circle cx="0" cy="0" r="1.5" fill="#fbbf24" />
              <line x1="0" y1="0" x2="5" y2="-5" stroke={isLightTheme ? "#4b5563" : "#cbd5e1"} strokeWidth="0.6" />
              <text x="6" y="2" className="fill-emerald-500 font-extrabold text-[8px] pointer-events-none">Voyager 2</text>
            </g>

            {/* Pioneer 10 */}
            <path 
              d={`M ${75 * Math.cos(3.1 * Math.PI)} ${75 * Math.sin(3.1 * Math.PI)} Q ${220 * Math.cos(3.18 * Math.PI)} ${220 * Math.sin(3.18 * Math.PI)} ${p10X} ${p10Y}`} 
              fill="none" 
              stroke="rgba(16, 185, 129, 0.4)" 
              strokeWidth="1" 
              strokeDasharray="3 3" 
            />
            <g transform={`translate(${p10X}, ${p10Y})`}>
              <circle cx="0" cy="0" r="2.5" fill="#10b981" />
              <line x1="0" y1="0" x2="-4" y2="-4" stroke={isLightTheme ? "#4b5563" : "#cbd5e1"} strokeWidth="0.6" />
              <text x="6" y="2" className="fill-emerald-500 font-extrabold text-[8px] pointer-events-none">Pioneer 10</text>
            </g>

            {/* New Horizons */}
            <path 
              d={`M ${120 * Math.cos(4.7 * Math.PI)} ${120 * Math.sin(4.7 * Math.PI)} Q ${300 * Math.cos(4.75 * Math.PI)} ${300 * Math.sin(4.75 * Math.PI)} ${nhX} ${nhY}`} 
              fill="none" 
              stroke="rgba(16, 185, 129, 0.4)" 
              strokeWidth="1" 
              strokeDasharray="3 3" 
            />
            <g transform={`translate(${nhX}, ${nhY})`}>
              <circle cx="0" cy="0" r="2.5" fill="#10b981" />
              <circle cx="0" cy="0" r="1.2" fill="#a7f3d0" />
              <text x="6" y="2" className="fill-emerald-500 font-extrabold text-[8px] pointer-events-none">New Horizons</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
