import { useState, useEffect } from 'react';
import { planetsData, sunData } from './data/solarSystemData';
import type { Planet } from './types';
import StarField from './components/StarField';
import SolarSystem from './components/SolarSystem';
import DetailPanel from './components/DetailPanel';
import Ui5DetailPanel from './components/Ui5DetailPanel';
import TablesShowcase from './components/TablesShowcase';
import { Moon, Sun } from 'lucide-react';
import { 
  ThemeProvider,
  ShellBar,
  Button,
  FlexBox,
  ToggleButton
} from '@ui5/webcomponents-react';
import { setTheme as setUi5Theme } from '@ui5/webcomponents-base/dist/config/Theme.js';

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isMoonFocused, setIsMoonFocused] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showProbes, setShowProbes] = useState<boolean>(false);
  const [showcaseMode, setShowcaseMode] = useState<'custom' | 'ui5' | 'tables'>('custom');

  // Sync theme with HTML body classes and UI5 theme engine
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      setUi5Theme('sap_horizon');
    } else {
      document.body.classList.remove('light-theme');
      setUi5Theme('sap_horizon_dark');
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

  const isLightTheme = theme === 'light';
  const isUi5 = showcaseMode === 'ui5';

  return (
    <ThemeProvider>
      <div 
        className={`relative flex flex-col lg:flex-row h-screen w-screen overflow-hidden antialiased font-sans select-none transition-colors duration-300 ${
          isLightTheme ? 'bg-stone-50 text-stone-900' : 'bg-slate-950 text-slate-100'
        }`}
        style={isUi5 ? {
          backgroundColor: 'var(--sapBackgroundColor, #fafafa)',
          color: 'var(--sapTextColor, #1f2937)'
        } : undefined}
      >
        {/* Background Starfield */}
        {(!isUi5 || theme === 'dark') && <StarField />}

        {/* Main Area */}
        <main className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
          
          {/* 1. HEADER & NAVIGATION CONTROL */}
          {isUi5 ? (
            /* SAP UI5 ShellBar Header */
            <ShellBar
              primaryTitle="Kosmos Explorer"
              secondaryTitle="SAP Fiori Showcase"
              style={{
                borderBottom: '1px solid var(--sapGroup_BorderColor, #e5e5e5)',
                zIndex: 20,
                flexShrink: 0
              }}
            >
              <Button 
                design={(showcaseMode as string) === 'custom' ? "Emphasized" : "Transparent"}
                onClick={() => setShowcaseMode('custom')}
                style={{ marginRight: '4px' }}
              >
                Custom
              </Button>
              <Button 
                design={(showcaseMode as string) === 'ui5' ? "Emphasized" : "Transparent"}
                onClick={() => setShowcaseMode('ui5')}
                style={{ marginRight: '4px' }}
              >
                SAP UI5
              </Button>
              <Button 
                design={(showcaseMode as string) === 'tables' ? "Emphasized" : "Transparent"}
                onClick={() => setShowcaseMode('tables')}
                style={{ marginRight: '8px' }}
              >
                Tabellen
              </Button>
              <Button 
                design="Transparent"
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              >
                {isLightTheme ? "Dunkelmodus" : "Lichtmodus"}
              </Button>
            </ShellBar>
          ) : (
            /* Custom View / Tables View Header */
            <div 
              className={`z-20 flex justify-between items-center p-5 select-none shrink-0 ${
                showcaseMode === 'custom' 
                  ? 'absolute top-0 left-0 right-0 pointer-events-none' 
                  : `w-full border-b ${isLightTheme ? 'border-stone-200' : 'border-slate-800'}`
              }`}
            >
              {/* Logo / Text */}
              <div className="pointer-events-none">
                <h1 className={`text-lg lg:text-xl font-extrabold tracking-wider uppercase ${
                  isLightTheme 
                    ? 'text-indigo-950' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-indigo-400 to-purple-400'
                }`}>
                  Kosmos Explorer 
                  {(showcaseMode as string) === 'tables' && (
                    <span className="text-[9px] font-bold align-middle bg-emerald-600 text-white px-2 py-0.5 rounded ml-2">Tabellen</span>
                  )}
                </h1>
                <p className={`text-[9px] lg:text-[10px] font-semibold ${isLightTheme ? 'text-stone-500' : 'text-slate-500'}`}>
                  {(showcaseMode as string) === 'tables' ? "Performance & Grid Showcase" : "Interaktiver Wegweiser & Orbit-Simulator"}
                </p>
              </div>

              {/* Floating Toolbar */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {/* 3-Way Segmented Control */}
                <div className={`flex p-1 rounded-xl gap-0.5 backdrop-blur-sm shadow-md border ${
                  isLightTheme ? 'bg-stone-200/50 border-stone-300/40' : 'bg-slate-900/50 border-slate-800/80'
                }`}>
                  <button
                    onClick={() => setShowcaseMode('custom')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                      (showcaseMode as string) === 'custom'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Custom
                  </button>
                  <button
                    onClick={() => setShowcaseMode('ui5')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                      (showcaseMode as string) === 'ui5'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SAP UI5
                  </button>
                  <button
                    onClick={() => setShowcaseMode('tables')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                      (showcaseMode as string) === 'tables'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tabellen
                  </button>
                </div>

                {/* Dark/Light toggle */}
                <button
                  onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                  className={`p-2 rounded-xl border transition-all shadow-md backdrop-blur-sm cursor-pointer ${
                    isLightTheme 
                      ? 'bg-white/80 border-stone-200 text-stone-700 hover:bg-stone-100' 
                      : 'bg-slate-900/60 border-slate-800/60 text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                  title={isLightTheme ? 'Dunkelmodus' : 'Lichtmodus'}
                >
                  {isLightTheme ? <Moon className="w-3.5 h-3.5 text-indigo-700" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>
            </div>
          )}

          {/* 2. BODY CONTENT (Solar System Canvas OR Tables Showcase) */}
          {showcaseMode === 'tables' ? (
            /* Tables Showcase Layout */
            <TablesShowcase isLightTheme={isLightTheme} />
          ) : (
            /* Interactive Solar System View (Custom or UI5) */
            <div className="flex-1 relative flex flex-col min-h-0">
              {/* Bottom Navigation (Only in custom mode or UI5 mode, not tables) */}
              {isUi5 ? (
                /* SAP UI5 Navigation Bar */
                <FlexBox 
                  justifyContent="Center" 
                  alignItems="Center" 
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '24px',
                    right: '24px',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--sapObjectHeader_Background, #ffffff)',
                    border: '1px solid var(--sapGroup_BorderColor, #e5e5e5)',
                    borderRadius: '12px',
                    boxShadow: 'var(--sapContent_HeaderShadow, 0 4px 10px rgba(0,0,0,0.15))',
                    zIndex: 10,
                    gap: '1rem',
                    width: 'auto',
                    maxWidth: 'calc(100vw - 3rem)',
                    overflowX: 'auto'
                  }}
                  className="scrollbar-none"
                >
                  <FlexBox style={{ gap: '0.25rem', overflowX: 'auto', maxWidth: '100%' }} className="scrollbar-none">
                    <Button 
                      design={!selectedPlanet ? "Emphasized" : "Default"}
                      onClick={() => handleSelectPlanet(null)}
                    >
                      Sonne
                    </Button>
                    {planetsData.map(planet => (
                      <Button
                        key={planet.id}
                        design={selectedPlanet?.id === planet.id ? "Emphasized" : "Default"}
                        onClick={() => handleSelectPlanet(planet)}
                      >
                        {planet.name}
                      </Button>
                    ))}
                  </FlexBox>

                  <ToggleButton
                    pressed={showProbes}
                    onChange={() => setShowProbes(p => !p)}
                    design="Default"
                  >
                    Sonden {showProbes ? "an" : "aus"}
                  </ToggleButton>
                </FlexBox>
              ) : (
                /* Custom Navigation Bar */
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
                    <span className={`w-2.5 h-2.5 rounded-full ${showProbes ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                    Sonden {showProbes ? 'an' : 'aus'}
                  </button>
                </nav>
              )}

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
            </div>
          )}
        </main>

        {/* 3. SIDEBAR DETAIL PANEL (Only rendered in Solar System Mode) */}
        {showcaseMode !== 'tables' && (
          isUi5 ? (
            <Ui5DetailPanel
              selectedPlanet={selectedPlanet}
              sunData={sunData}
              isMoonFocused={isMoonFocused}
              onToggleMoonFocus={handleToggleMoonFocus}
            />
          ) : (
            <DetailPanel
              selectedPlanet={selectedPlanet}
              sunData={sunData}
              isMoonFocused={isMoonFocused}
              isLightTheme={isLightTheme}
              onToggleMoonFocus={handleToggleMoonFocus}
            />
          )
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
