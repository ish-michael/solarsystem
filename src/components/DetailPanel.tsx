import { useEffect, useState } from 'react';
import type { Planet, SunData } from '../types';
import { Sparkles, Thermometer, Globe, Compass, Clock, Milestone, Wind, Layers } from 'lucide-react';

interface DetailPanelProps {
  selectedPlanet: Planet | null;
  sunData: SunData;
  isMoonFocused: boolean;
  isLightTheme: boolean;
  onToggleMoonFocus: () => void;
}

export default function DetailPanel({
  selectedPlanet,
  sunData,
  isMoonFocused,
  isLightTheme,
  onToggleMoonFocus
}: DetailPanelProps) {
  // If no planet is selected, display Sun data
  const title = selectedPlanet ? selectedPlanet.name : sunData.name;
  const description = selectedPlanet ? selectedPlanet.description : sunData.description;
  const funFact = selectedPlanet ? selectedPlanet.funFact : sunData.funFact;
  const temp = selectedPlanet ? selectedPlanet.tempC : sunData.tempC;
  const diameter = selectedPlanet ? selectedPlanet.diameterKm : sunData.diameterKm;
  const imagePath = selectedPlanet ? selectedPlanet.imagePath : sunData.imagePath;

  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [imageMeta, setImageMeta] = useState<string>('');

  // Reset load status when imagePath changes
  useEffect(() => {
    setLoadStatus('loading');
    setImageMeta('');
  }, [imagePath]);

  // Diagnostic fetch to verify image loading payload
  useEffect(() => {
    if (!imagePath) return;
    fetch(imagePath)
      .then(res => {
        const contentType = res.headers.get('content-type');
        console.log(`[Diagnostic] Image: ${imagePath} | Content-Type: ${contentType} | Status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        console.log(`[Diagnostic] First 100 chars:`, text.substring(0, 100));
      })
      .catch(err => {
        console.error(`[Diagnostic] Fetch failed:`, err);
      });
  }, [imagePath]);
  const atmosphere = selectedPlanet ? selectedPlanet.atmosphere : sunData.atmosphere;
  const surface = selectedPlanet ? selectedPlanet.surface : sunData.surface;
  
  // Historical discovery text
  const discoveryText = selectedPlanet 
    ? (selectedPlanet.discoverer && selectedPlanet.discoveryYear !== 'Prähistorisch'
      ? `Entdeckt im Jahr ${selectedPlanet.discoveryYear} durch ${selectedPlanet.discoverer}.`
      : `Seit dem Altertum als Wandelstern bekannt. Name aus der römischen Mythologie.`)
    : `Seit prähistorischen Zeiten beobachtet. Sie bildet das gravitative Zentrum unseres Sonnensystems.`;

  // Sort moons by size descending (should already be sorted in data, but let's enforce it)
  const moons = selectedPlanet 
    ? [...selectedPlanet.moons].sort((a, b) => b.radiusKm - a.radiusKm).slice(0, 10)
    : [];

  // Theme styling helpers
  const containerClass = isLightTheme
    ? 'bg-stone-50/95 border-t lg:border-t-0 lg:border-l border-stone-200/80 text-stone-800'
    : 'bg-slate-950/85 border-t lg:border-t-0 lg:border-l border-slate-800 text-slate-200';
  
  const textTitleColor = isLightTheme ? 'text-stone-900' : 'text-white';
  const textDescColor = isLightTheme ? 'text-stone-700' : 'text-slate-300';
  const textLabelColor = isLightTheme ? 'text-stone-500' : 'text-slate-400';
  const cardBgClass = isLightTheme ? 'bg-stone-200/30 border-stone-300/40' : 'bg-slate-900/50 border-slate-800/80';
  const moonListBgClass = isLightTheme ? 'bg-stone-200/20 border-stone-200' : 'bg-slate-900/20 border-slate-800/60';
  const moonItemClass = isLightTheme ? 'hover:bg-stone-200/40 border-stone-200/40' : 'hover:bg-slate-900/40 border-slate-800/40';

  return (
    <aside className={`w-full lg:w-[460px] backdrop-blur-md p-6 flex flex-col overflow-y-auto shadow-2xl z-10 transition-all duration-300 ${containerClass}`}>
      
      {/* Header section with Name and the interactive Focus Button */}
      <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isLightTheme ? 'border-stone-200' : 'border-slate-800'}`}>
        <div>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${isLightTheme ? 'text-indigo-600' : 'text-indigo-400'}`}>
            {selectedPlanet ? 'Planet' : 'Zentralstern'}
          </span>
          <h2 className={`text-3xl font-extrabold tracking-tight flex items-center gap-2 ${textTitleColor}`}>
            {title}
          </h2>
        </div>

        {/* Focus Button - Surprise SVG Image */}
        {selectedPlanet && (
          <button
            onClick={onToggleMoonFocus}
            aria-label={isMoonFocused ? "Zurück zum Sonnensystem" : `${title} und Monde fokussieren`}
            title={isMoonFocused ? "Zurück zum Sonnensystem" : `${title} und Monde in den Fokus rücken`}
            className={`relative p-2.5 rounded-full border transition-all duration-300 group cursor-pointer overflow-hidden ${
              isLightTheme
                ? 'bg-stone-100 border-stone-300 text-indigo-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-[0_0_12px_rgba(79,70,229,0.2)]'
                : 'bg-slate-900 border-indigo-500/30 hover:border-indigo-400 text-indigo-400 hover:text-indigo-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]'
            }`}
          >
            {/* Background pulsating effect */}
            <div className={`absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isLightTheme ? 'from-indigo-600/5 to-purple-600/5' : 'from-indigo-600/10 to-purple-600/10'
            }`} />
            
            {isMoonFocused ? (
              /* Back Button: Stylized Cosmic Returning Orbit Arrow */
              <svg 
                className="w-7 h-7 relative z-10 transform group-hover:-translate-x-0.5 transition-transform duration-300" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 12A9 9 0 0 1 7.5 20" strokeDasharray="3 3" className={isLightTheme ? 'stroke-indigo-300' : 'stroke-indigo-500/50'} />
                <path d="M12 3a9 9 0 0 1 9 9" strokeDasharray="3 3" className={isLightTheme ? 'stroke-indigo-300' : 'stroke-indigo-500/50'} />
                <path d="M3 12a9 9 0 0 1 15-6.7L12 11" className={isLightTheme ? 'stroke-indigo-600' : 'stroke-indigo-400'} />
                <polyline points="8 11 12 11 12 7" className={isLightTheme ? 'stroke-indigo-600' : 'stroke-indigo-400'} />
                <circle cx="12" cy="12" r="1.5" className={isLightTheme ? 'fill-amber-500' : 'fill-amber-400'} />
              </svg>
            ) : (
              /* Focus Button: Stylized Gravity Orbit Vortex (Quantum-like) */
              <svg 
                className="w-7 h-7 relative z-10 animate-[spin_10s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3.5" className={isLightTheme ? 'fill-indigo-500 stroke-indigo-500' : 'fill-indigo-400 stroke-indigo-400'} />
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" className="opacity-80" />
                <circle cx="17.2" cy="9" r="1.2" className={isLightTheme ? 'fill-purple-500' : 'fill-purple-300'} />
                <path d="M12 2a10 10 0 0 1 7.8 3.8" strokeWidth="1.5" className={isLightTheme ? 'stroke-indigo-600' : 'stroke-indigo-300'} />
                <path d="M12 22a10 10 0 0 1-7.8-3.8" strokeWidth="1.5" className={isLightTheme ? 'stroke-indigo-600' : 'stroke-indigo-300'} />
                <circle cx="5" cy="15" r="1" className={isLightTheme ? 'fill-stone-600' : 'fill-slate-200'} />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Realistic NASA-style Planet Image */}
      <div className={`relative w-full rounded-2xl overflow-hidden mb-5 border shadow-xl group ${
        isLightTheme ? 'border-stone-200/80 bg-stone-200/50' : 'border-slate-800 bg-slate-900/60'
      }`}>
        <img 
          src={imagePath} 
          alt={`NASA Teleskopaufnahme von ${title}`} 
          className="w-full h-48 sm:h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-700 select-none" 
          onLoad={(e) => {
            setLoadStatus('success');
            const target = e.currentTarget;
            setImageMeta(`${target.naturalWidth}x${target.naturalHeight}px`);
          }}
          onError={() => {
            setLoadStatus('error');
          }}
        />
        {/* Dynamic atmospheric radial glow outline matching planet colors */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, transparent 35%, ${selectedPlanet?.glowColor || 'rgba(245, 158, 11, 0.25)'} 100%)`,
            opacity: isLightTheme ? 0.35 : 0.5
          }}
        />
      </div>
      <div className="text-[10px] text-center -mt-3 mb-4 font-mono break-all flex flex-col gap-0.5">
        <div className="opacity-45">Pfad: {imagePath}</div>
        <div className="font-bold flex items-center justify-center gap-1.5">
          {loadStatus === 'loading' && <span className="text-amber-500 animate-pulse">⏳ Lädt Bild...</span>}
          {loadStatus === 'success' && <span className="text-emerald-500">✅ Erfolgreich geladen ({imageMeta})</span>}
          {loadStatus === 'error' && <span className="text-red-500">❌ Fehler beim Laden (Bilddatei nicht lesbar)</span>}
        </div>
      </div>

      {/* Description */}
      <div className="mb-5">
        <p className={`${textDescColor} leading-relaxed text-sm lg:text-base`}>
          {description}
        </p>
      </div>

      {/* Quick Facts Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className={`border rounded-xl p-3 flex flex-col justify-between ${cardBgClass}`}>
          <div className={`flex items-center gap-1.5 text-xs mb-1 font-semibold ${textLabelColor}`}>
            <Thermometer className="w-3.5 h-3.5 text-red-400" />
            Temperatur
          </div>
          <span className={`text-sm font-bold ${textTitleColor}`}>{temp}</span>
        </div>

        <div className={`border rounded-xl p-3 flex flex-col justify-between ${cardBgClass}`}>
          <div className={`flex items-center gap-1.5 text-xs mb-1 font-semibold ${textLabelColor}`}>
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            Durchmesser
          </div>
          <span className={`text-sm font-bold ${textTitleColor}`}>
            {diameter.toLocaleString('de-DE')} km
          </span>
        </div>

        {selectedPlanet ? (
          <>
            <div className={`border rounded-xl p-3 flex flex-col justify-between ${cardBgClass}`}>
              <div className={`flex items-center gap-1.5 text-xs mb-1 font-semibold ${textLabelColor}`}>
                <Milestone className="w-3.5 h-3.5 text-emerald-400" />
                Sonnenabstand
              </div>
              <span className={`text-sm font-bold ${textTitleColor}`}>
                {selectedPlanet.distanceFromSunAU} AE
              </span>
            </div>

            <div className={`border rounded-xl p-3 flex flex-col justify-between ${cardBgClass}`}>
              <div className={`flex items-center gap-1.5 text-xs mb-1 font-semibold ${textLabelColor}`}>
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Umlaufzeit
              </div>
              <span className={`text-sm font-bold ${textTitleColor}`}>
                {selectedPlanet.orbitalPeriodDays >= 365
                  ? `${(selectedPlanet.orbitalPeriodDays / 365).toFixed(1)} Jahre`
                  : `${selectedPlanet.orbitalPeriodDays} Tage`}
              </span>
            </div>

            <div className={`border rounded-xl p-3 col-span-2 flex items-center justify-between ${cardBgClass}`}>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${textLabelColor}`}>
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Tageslänge
              </div>
              <span className={`text-sm font-bold ${textTitleColor}`}>
                {selectedPlanet.dayLengthHours >= 24
                  ? `${(selectedPlanet.dayLengthHours / 24).toFixed(1)} Erdentage`
                  : `${selectedPlanet.dayLengthHours} Std.`}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className={`border rounded-xl p-3 col-span-2 flex flex-col justify-between ${cardBgClass}`}>
              <div className={`flex items-center gap-1.5 text-xs mb-1 font-semibold ${textLabelColor}`}>
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Masse
              </div>
              <span className={`text-sm font-bold ${textTitleColor}`}>{(sunData as SunData).mass}</span>
            </div>
          </>
        )}
      </div>

      {/* Detailed Planet Data Cards (Atmosphere, Surface, History) */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Atmosphere */}
        <div className={`p-4 border rounded-xl ${cardBgClass}`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-indigo-400" /> Atmosphäre
          </h4>
          <p className={`text-xs leading-relaxed ${textDescColor}`}>
            {atmosphere}
          </p>
        </div>

        {/* Surface / Geology */}
        <div className={`p-4 border rounded-xl ${cardBgClass}`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" /> Oberfläche & Geologie
          </h4>
          <p className={`text-xs leading-relaxed ${textDescColor}`}>
            {surface}
          </p>
        </div>

        {/* Discovery History */}
        <div className={`p-4 border rounded-xl ${cardBgClass}`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-400" /> Entdeckung & Geschichte
          </h4>
          <p className={`text-xs leading-relaxed ${textDescColor}`}>
            {discoveryText}
          </p>
        </div>
      </div>

      {/* Fun Fact Section */}
      <div className={`border rounded-2xl p-4.5 mb-5 shadow-inner relative overflow-hidden group ${
        isLightTheme 
          ? 'bg-amber-50/45 border-amber-200/50' 
          : 'bg-gradient-to-r from-indigo-950/40 to-slate-900/40 border-indigo-500/20'
      }`}>
        <div className="absolute top-0 right-0 p-3.5 opacity-10 text-indigo-400 pointer-events-none group-hover:scale-110 transition-transform duration-300">
          <Sparkles className="w-8 h-8" />
        </div>
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Schon gewusst?
        </h4>
        <p className={`text-sm italic leading-relaxed ${isLightTheme ? 'text-stone-700 font-medium' : 'text-indigo-200/90'}`}>
          "{funFact}"
        </p>
      </div>

      {/* Moons section */}
      {selectedPlanet && (
        <div className="flex-1 flex flex-col min-h-[220px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${textLabelColor}`}>
              Monde ({selectedPlanet.totalMoonsCount})
            </h3>
            {moons.length > 0 && selectedPlanet.totalMoonsCount > 10 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isLightTheme ? 'bg-stone-200 text-stone-600' : 'bg-slate-900 text-slate-400'
              }`}>
                Top 10 nach Größe
              </span>
            )}
          </div>

          {moons.length > 0 ? (
            <div className={`flex-1 border rounded-xl overflow-hidden flex flex-col ${moonListBgClass}`}>
              <div className={`overflow-y-auto max-h-[260px] divide-y ${isLightTheme ? 'divide-stone-200/60' : 'divide-slate-800/40'}`}>
                {moons.map((moon, index) => (
                  <div
                    key={moon.name}
                    className={`p-3 transition-colors duration-150 flex items-center justify-between border-b last:border-b-0 ${moonItemClass}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isLightTheme 
                          ? 'bg-stone-200/60 border-stone-300/40 text-stone-600' 
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className={`text-xs lg:text-sm font-bold leading-tight ${textTitleColor}`}>
                          {moon.name}
                        </p>
                        {moon.discoverer && (
                          <p className={`text-[10px] truncate max-w-[180px] ${isLightTheme ? 'text-stone-500' : 'text-slate-500'}`}>
                            {moon.discoverer} ({moon.discoveryYear || 'unbekannt'})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${isLightTheme ? 'text-indigo-700' : 'text-indigo-300'}`}>
                        {moon.radiusKm.toLocaleString('de-DE')} km
                      </p>
                      <p className={`text-[9px] uppercase tracking-widest ${textLabelColor}`}>Radius</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center p-6 border border-dashed rounded-xl text-center ${
              isLightTheme ? 'border-stone-300/70 bg-stone-100/30' : 'border-slate-800 bg-slate-900/10'
            }`}>
              <span className="text-2xl mb-1">🌑</span>
              <p className={`text-xs ${textLabelColor}`}>
                Keine bekannten Monde vorhanden.
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
