import { useState, useEffect } from 'react';
import { planetsData, sunData } from './data/solarSystemData';
import type { Planet } from './types';
import StarField from './components/StarField';
import SolarSystem from './components/SolarSystem';
import DetailPanel from './components/DetailPanel';
import { HelpCircle, Sun, Moon, Radio } from 'lucide-react';

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isMoonFocused, setIsMoonFocused] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showProbes, setShowProbes] = useState<boolean>(false);

  // Sync theme with HTML body classes
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Handle selecting a planet (from header or SVG canvas)
  const handleSelectPlanet = (planet: Planet | null) => {
    setSelectedPlanet(planet);
    setIsMoonFocused(false); // Reset moon focus when selecting a new planet
  };

  const handleToggleMoonFocus = () => {
    setIsMoonFocused(prev => !prev);
  };

  // Get current date formatted in German
  const formattedDate = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const isLightTheme = theme === 'light';

  return (
    <div className={`relative flex flex-col lg:flex-row h-screen w-screen overflow-hidden antialiased font-sans select-none transition-colors duration-300 ${
      isLightTheme ? 'bg-stone-50 text-stone-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Background Starfield */}
      <StarField />

      {/* Main Solar System Viewer */}
      <main className={`flex-1 relative flex flex-col h-[65vh] lg:h-full overflow-hidden border-b lg:border-b-0 ${
        isLightTheme ? 'border-stone-200' : 'border-slate-800'
      }`}>
        
        {/* Floating App Header */}
        <header className="absolute top-4 left-6 z-10 pointer-events-none max-w-sm lg:max-w-md">
          <h1 className={`text-xl lg:text-2xl font-extrabold tracking-wider uppercase ${
            isLightTheme 
              ? 'text-indigo-950 bg-clip-text' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-indigo-400 to-purple-400'
          }`}>
            Kosmos Explorer
          </h1>
          <p className={`text-[10px] lg:text-xs mt-0.5 font-semibold ${isLightTheme ? 'text-stone-500' : 'text-slate-400'}`}>
            Interaktiver Wegweiser & Orbit-Simulator
          </p>
          <div className={`mt-2 text-[9px] lg:text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block ${
            isLightTheme 
              ? 'bg-stone-200/50 border border-stone-300/40 text-stone-600' 
              : 'bg-slate-900/40 border border-slate-800/30 text-slate-500'
          }`}>
            Konstellation berechnet für: {formattedDate}
          </div>
        </header>

        {/* Floating Toolbar (Top Right) */}
        <div className="absolute top-4 right-6 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Instructions Overlay */}
          <div className={`hidden md:flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-xl border backdrop-blur-sm pointer-events-none ${
            isLightTheme 
              ? 'text-stone-500 bg-white/70 border-stone-200/60' 
              : 'text-slate-400 bg-slate-950/40 border-slate-900/40'
          }`}>
            <HelpCircle className={`w-3.5 h-3.5 ${isLightTheme ? 'text-indigo-600' : 'text-indigo-400/80'}`} />
            <span>Maus über Planet stoppt Animation. Click zur Auswahl.</span>
          </div>
          
          {/* Light/Dark Mode Switch Button */}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-xl border transition-all shadow-md backdrop-blur-sm cursor-pointer ${
              isLightTheme 
                ? 'bg-white/80 border-stone-200 text-stone-700 hover:bg-white hover:text-stone-900 hover:shadow-md' 
                : 'bg-slate-900/60 border-slate-800/60 text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title={isLightTheme ? 'Dunkelmodus aktivieren' : 'Lichtmodus (Starmap) aktivieren'}
          >
            {isLightTheme ? <Moon className="w-4 h-4 text-indigo-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        {/* Quick Selector Navigation Pills & Probes Toggle */}
        <nav className={`absolute bottom-4 left-6 right-6 lg:right-auto z-10 flex gap-1.5 lg:gap-2 overflow-x-auto py-2 px-2.5 backdrop-blur-md rounded-2xl border pointer-events-auto shadow-lg max-w-[calc(100vw-3rem)] scrollbar-none ${
          isLightTheme ? 'bg-white/85 border-stone-200/70' : 'bg-slate-950/60 border-slate-900'
        }`}>
          <button 
            onClick={() => handleSelectPlanet(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 shrink-0 cursor-pointer ${
              !selectedPlanet 
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]' 
                : (isLightTheme
                  ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40')
            }`}
          >
            Sonne
          </button>
          
          {planetsData.map(planet => {
            const isSelected = selectedPlanet?.id === planet.id;
            return (
              <button
                key={planet.id}
                onClick={() => handleSelectPlanet(planet)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]' 
                    : (isLightTheme
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40')
                }`}
              >
                {planet.name}
              </button>
            );
          })}

          {/* Divider */}
          <div className={`w-[1px] my-1 shrink-0 ${isLightTheme ? 'bg-stone-200' : 'bg-slate-800'}`} />

          {/* Probes Toggle Button */}
          <button
            onClick={() => setShowProbes(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-1.5 ${
              showProbes
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                : (isLightTheme
                  ? 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40')
            }`}
            title="Historische Raumsonden (Voyager, Cassini, etc.) einblenden"
          >
            <Radio className={`w-3.5 h-3.5 ${showProbes ? 'animate-pulse' : ''}`} />
            Sonden {showProbes ? 'an' : 'aus'}
          </button>
        </nav>

        {/* Interactive SVG Canvas */}
        <SolarSystem
          planets={planetsData}
          sun={sunData}
          selectedPlanet={selectedPlanet}
          isMoonFocused={isMoonFocused}
          isLightTheme={isLightTheme}
          showProbes={showProbes}
          onSelectPlanet={handleSelectPlanet}
        />
      </main>

      {/* Facts Detail Sidebar */}
      <DetailPanel
        selectedPlanet={selectedPlanet}
        sunData={sunData}
        isMoonFocused={isMoonFocused}
        isLightTheme={isLightTheme}
        onToggleMoonFocus={handleToggleMoonFocus}
      />
    </div>
  );
}

export default App;
