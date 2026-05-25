import type { Planet, SunData } from '../types';
import { Sparkles, Thermometer, Globe, Compass, Clock, Milestone, Wind, Layers, ExternalLink } from 'lucide-react';
import { ReturnOrbitIcon, OrbitVortexIcon } from './OrbitIcons';

function getWikipediaUrl(name: string): string {
  const mapping: { [key: string]: string } = {
    "Sonne": "https://de.wikipedia.org/wiki/Sonne",
    "Merkur": "https://de.wikipedia.org/wiki/Merkur_(Planet)",
    "Venus": "https://de.wikipedia.org/wiki/Venus_(Planet)",
    "Erde": "https://de.wikipedia.org/wiki/Erde",
    "Mars": "https://de.wikipedia.org/wiki/Mars_(Planet)",
    "Jupiter": "https://de.wikipedia.org/wiki/Jupiter_(Planet)",
    "Saturn": "https://de.wikipedia.org/wiki/Saturn_(Planet)",
    "Uranus": "https://de.wikipedia.org/wiki/Uranus_(Planet)",
    "Neptun": "https://de.wikipedia.org/wiki/Neptun_(Planet)"
  };
  return mapping[name] || `https://de.wikipedia.org/wiki/${name}`;
}

interface DetailPanelProps {
  selectedPlanet: Planet | null;
  sunData: SunData;
  isMoonFocused: boolean;
  isLightTheme: boolean;
  onToggleMoonFocus: () => void;
}

// --- SUB-COMPONENTS ---
interface FactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colSpan?: string;
}

function FactCard({ icon, label, value, colSpan = '' }: FactCardProps) {
  return (
    <div className={`fact-card ${colSpan}`}>
      <div className="fact-card-label">
        {icon}
        {label}
      </div>
      <span className="fact-card-value">{value}</span>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="info-card">
      <h4 className="info-card-title">
        {icon} {title}
      </h4>
      <p className="info-card-desc">
        {description}
      </p>
    </div>
  );
}

interface MoonItemProps {
  name: string;
  discoverer?: string;
  discoveryYear?: string | number;
  radiusKm: number;
  index: number;
}

function MoonItem({ name, discoverer, discoveryYear, radiusKm, index }: MoonItemProps) {
  return (
    <div className="moon-item">
      <div className="flex items-center gap-2.5">
        <div className="moon-index-badge">
          {index + 1}
        </div>
        <div>
          <p className="moon-name">
            {name}
          </p>
          {discoverer && (
            <p className="moon-desc">
              {discoverer} ({discoveryYear || 'unbekannt'})
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="moon-radius-val">
          {radiusKm.toLocaleString('de-DE')} km
        </p>
        <p className="moon-radius-label">Radius</p>
      </div>
    </div>
  );
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
  const moonListBgClass = isLightTheme ? 'bg-stone-200/20 border-stone-200' : 'bg-slate-900/20 border-slate-800/60';

  return (
    <aside className={`w-full lg:w-[460px] flex-1 min-h-0 lg:flex-none p-6 flex flex-col overflow-y-auto shadow-2xl z-10 transition-all duration-300 ${containerClass}`}>
      
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
              <ReturnOrbitIcon isLightTheme={isLightTheme} />
            ) : (
              <OrbitVortexIcon isLightTheme={isLightTheme} />
            )}
          </button>
        )}
      </div>

      {/* Realistic NASA-style Planet Image */}
      <div 
        className="relative w-full mb-5 shadow-xl"
        style={{
          boxShadow: isLightTheme 
            ? '0 10px 25px -5px rgba(0,0,0,0.05)' 
            : `0 15px 35px -10px ${selectedPlanet?.glowColor || 'rgba(245, 158, 11, 0.4)'}`,
          height: '240px'
        }}
      >
        <img 
          src={imagePath} 
          alt={`NASA Teleskopaufnahme von ${title}`} 
          className={`w-full h-full object-cover rounded-2xl border select-none ${
            isLightTheme ? 'border-stone-200/80 bg-stone-200/50' : 'border-slate-800 bg-slate-900/60'
          }`}
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <p className={`${textDescColor} leading-relaxed text-sm lg:text-base mb-3.5`}>
          {description}
        </p>
        <a 
          href={getWikipediaUrl(title)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${
            isLightTheme 
              ? 'text-indigo-600 hover:text-indigo-800' 
              : 'text-indigo-400 hover:text-indigo-300'
          }`}
        >
          <span>Mehr auf Wikipedia lesen</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Quick Facts Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <FactCard
          icon={<Thermometer className="w-3.5 h-3.5 text-red-400" />}
          label="Temperatur"
          value={temp}
        />

        <FactCard
          icon={<Globe className="w-3.5 h-3.5 text-blue-400" />}
          label="Durchmesser"
          value={`${diameter.toLocaleString('de-DE')} km`}
        />

        {selectedPlanet ? (
          <>
            <FactCard
              icon={<Milestone className="w-3.5 h-3.5 text-emerald-400" />}
              label="Sonnenabstand"
              value={`${selectedPlanet.distanceFromSunAU} AE`}
            />

            <FactCard
              icon={<Compass className="w-3.5 h-3.5 text-amber-400" />}
              label="Umlaufzeit"
              value={selectedPlanet.orbitalPeriodDays >= 365
                ? `${(selectedPlanet.orbitalPeriodDays / 365).toFixed(1)} Jahre`
                : `${selectedPlanet.orbitalPeriodDays} Tage`}
            />

            <FactCard
              icon={<Clock className="w-3.5 h-3.5 text-purple-400" />}
              label="Tageslänge"
              value={selectedPlanet.dayLengthHours >= 24
                ? `${(selectedPlanet.dayLengthHours / 24).toFixed(1)} Erdentage`
                : `${selectedPlanet.dayLengthHours} Std.`}
              colSpan="col-span-2"
            />
          </>
        ) : (
          <FactCard
            icon={<Sparkles className="w-3.5 h-3.5 text-yellow-400" />}
            label="Masse"
            value={sunData.mass}
            colSpan="col-span-2"
          />
        )}
      </div>

      {/* Detailed Planet Data Cards (Atmosphere, Surface, History) */}
      <div className="flex flex-col gap-3 mb-5">
        <InfoCard
          icon={<Wind className="w-4 h-4 text-indigo-400" />}
          title="Atmosphäre"
          description={atmosphere}
        />

        <InfoCard
          icon={<Layers className="w-4 h-4 text-indigo-400" />}
          title="Oberfläche & Geologie"
          description={surface}
        />

        <InfoCard
          icon={<Compass className="w-4 h-4 text-indigo-400" />}
          title="Entdeckung & Geschichte"
          description={discoveryText}
        />
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
                  <MoonItem
                    key={moon.name}
                    name={moon.name}
                    discoverer={moon.discoverer}
                    discoveryYear={moon.discoveryYear}
                    radiusKm={moon.radiusKm}
                    index={index}
                  />
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
