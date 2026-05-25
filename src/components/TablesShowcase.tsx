import { useState, useMemo, useRef, type UIEvent } from 'react';
import { planetsData } from '../data/solarSystemData';
import { Database, ShieldAlert, Cpu, Layers, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface TablesShowcaseProps {
  isLightTheme: boolean;
}

interface TelemetryLog {
  id: number;
  timestamp: string;
  sensor: string;
  value: string;
  status: 'OK' | 'WARN' | 'ERROR';
}

const defaultColumnOrder: (keyof TelemetryLog)[] = ['id', 'timestamp', 'sensor', 'value', 'status'];

// Generate telemetry logs statically once outside the component to comply with React 19 purity rules.
// Uses a fixed timestamp base and pseudo-random calculations to remain 100% deterministic and pure.
const telemetryData: TelemetryLog[] = (() => {
  const logs: TelemetryLog[] = [];
  const sensors = ['Core Temperature Probe', 'Magnetic Field Sensor', 'Gravity Anomaly Detector', 'Atmospheric Barometer', 'Solar Radiation Grid'];
  const statuses: ('OK' | 'WARN' | 'ERROR')[] = ['OK', 'WARN', 'ERROR'];
  const baseTime = 1779651596792;

  for (let i = 1; i <= 10000; i++) {
    const date = new Date(baseTime - i * 10000);
    const timeStr = date.toLocaleTimeString('de-DE') + `.${String(i % 1000).padStart(3, '0')}`;
    const status = statuses[i % 100 < 5 ? 2 : i % 100 < 15 ? 1 : 0]; // 5% ERROR, 10% WARN, 85% OK
    
    // Deterministic pseudo-random fraction between 0 and 1
    const pseudoRand = Math.sin(i) * 0.5 + 0.5;
    
    let val: string;
    if (i % 5 === 0) val = `${(pseudoRand * 1000).toFixed(2)} nT`;
    else if (i % 5 === 1) val = `${(1.2 + pseudoRand * 0.4).toFixed(3)} G`;
    else if (i % 5 === 2) val = `${(pseudoRand * 500 - 150).toFixed(1)} °C`;
    else val = `${(pseudoRand * 100).toFixed(2)} %`;

    logs.push({
      id: i,
      timestamp: timeStr,
      sensor: sensors[i % sensors.length],
      value: val,
      status: status
    });
  }
  return logs;
})();

export default function TablesShowcase({ isLightTheme }: TablesShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'responsive' | 'virtualized'>('responsive');

  // --- STATE FOR FILTERING, SORTING, REORDERING ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OK' | 'WARN' | 'ERROR'>('ALL');
  const [sortConfig, setSortConfig] = useState<{
    column: keyof TelemetryLog | null;
    direction: 'ASC' | 'DESC' | null;
  }>({ column: null, direction: null });
  const [columnOrder, setColumnOrder] = useState<(keyof TelemetryLog)[]>(defaultColumnOrder);

  // --- FILTER & SORT LOGIC (useMemo for 60fps performance) ---
  const filteredAndSortedTelemetry = useMemo(() => {
    let result = [...telemetryData];

    // 1. Search Query filtering (sensor, ID, or value)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.sensor.toLowerCase().includes(q) ||
          log.value.toLowerCase().includes(q) ||
          String(log.id).includes(q) ||
          log.timestamp.includes(q)
      );
    }

    // 2. Status filtering
    if (statusFilter !== 'ALL') {
      result = result.filter((log) => log.status === statusFilter);
    }

    // 3. Sorting
    if (sortConfig.column && sortConfig.direction) {
      const col = sortConfig.column;
      const isAsc = sortConfig.direction === 'ASC';
      result.sort((a, b) => {
        const valA = a[col];
        const valB = b[col];

        // Numerical comparison for ID
        if (col === 'id') {
          return isAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
        }

        // Numerical comparison for value (try to strip units)
        if (col === 'value') {
          const numA = parseFloat((valA as string).replace(/[^\d.-]/g, ''));
          const numB = parseFloat((valB as string).replace(/[^\d.-]/g, ''));
          if (!isNaN(numA) && !isNaN(numB)) {
            return isAsc ? numA - numB : numB - numA;
          }
        }

        // String alphabetical fallback comparison
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return isAsc ? -1 : 1;
        if (strA > strB) return isAsc ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [searchQuery, statusFilter, sortConfig]);

  // --- 2. VIRTUALIZATION HOOK / ENGINE MATH ---
  const rowHeight = 44; // Fixed height in pixels for each row
  const viewportHeight = 400; // Scrollable window height in pixels
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalRows = filteredAndSortedTelemetry.length;
  const totalHeight = totalRows * rowHeight;

  // Calculate visible range index
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2); // -2 for buffer
  const endIndex = Math.min(totalRows - 1, Math.floor((scrollTop + viewportHeight) / rowHeight) + 2); // +2 for buffer

  // Slice visible items
  const visibleData = useMemo(() => {
    return filteredAndSortedTelemetry.slice(startIndex, endIndex + 1);
  }, [filteredAndSortedTelemetry, startIndex, endIndex]);

  // Visual offsets for absolute positioning
  const offsetY = startIndex * rowHeight;

  // Column shifting handler
  const moveColumn = (index: number, direction: 'left' | 'right') => {
    const newOrder = [...columnOrder];
    if (direction === 'left' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'right' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setColumnOrder(newOrder);
  };

  // Sorting header click handler
  const handleSort = (column: keyof TelemetryLog) => {
    setSortConfig((prev) => {
      if (prev.column !== column) {
        return { column, direction: 'ASC' };
      }
      if (prev.direction === 'ASC') {
        return { column, direction: 'DESC' };
      }
      return { column: null, direction: null };
    });
  };

  // Width definitions matching 12-column grid spans
  const columnWidths: Record<keyof TelemetryLog, string> = {
    id: 'col-span-2',
    timestamp: 'col-span-3',
    sensor: 'col-span-4',
    value: 'col-span-2 text-right',
    status: 'col-span-1 text-center',
  };

  // Display labels in German
  const columnLabels: Record<keyof TelemetryLog, string> = {
    id: 'Log ID',
    timestamp: 'Zeitstempel',
    sensor: 'Sensor',
    value: 'Messwert',
    status: 'Status',
  };

  // Theme Styling
  const cardBg = isLightTheme ? 'bg-white border-stone-200 text-stone-800' : 'bg-slate-900/60 border-slate-800/80 text-slate-200';
  const headerText = isLightTheme ? 'text-indigo-950' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-400';
  const tableHeaderBg = isLightTheme ? 'bg-stone-100 text-stone-600' : 'bg-slate-950/60 text-slate-400';
  const borderClass = isLightTheme ? 'border-stone-200' : 'border-slate-800/60';
  const hoverRowBg = isLightTheme ? 'hover:bg-stone-50' : 'hover:bg-slate-900/40';

  const isFilterActive =
    searchQuery !== '' ||
    statusFilter !== 'ALL' ||
    sortConfig.column !== null ||
    JSON.stringify(columnOrder) !== JSON.stringify(defaultColumnOrder);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 lg:p-8" style={{ transform: 'translateZ(0)' }}>
      {/* Title */}
      <div className="mb-6">
        <h2 className={`text-2xl font-extrabold tracking-tight mb-1 ${headerText}`}>
          Datentabellen-Showcase
        </h2>
        <p className={`text-xs ${isLightTheme ? 'text-stone-500' : 'text-slate-400'}`}>
          Zwei Tabellen-Konzepte: Grid-zu-Karten Transformation auf Mobilgeräten und virtuelle 10.000-Zeilen Liste mit Sortierung, Filterung und Spaltenanordnung.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className={`flex border-b mb-6 ${borderClass}`}>
        <button
          onClick={() => setActiveTab('responsive')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'responsive'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          1. Mobile-Responsive Tabelle
        </button>
        <button
          onClick={() => setActiveTab('virtualized')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'virtualized'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Cpu className="w-4 h-4" />
          2. Virtualisierte Tabelle (10.000 Zeilen)
        </button>
      </div>

      {/* Showcase Content */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* --- SHOWCASE 1: RESPONSIVE TABLE --- */}
        {activeTab === 'responsive' && (
          <div className={`border rounded-2xl p-5 shadow-xl flex flex-col ${cardBg}`}>
            <div className="mb-4">
              <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                🚀 Planetensteckbriefe (Responsive Transformation)
              </h3>
              <p className={`text-xs ${isLightTheme ? 'text-stone-500' : 'text-slate-400'}`}>
                Ziehe das Browserfenster kleiner: Auf Desktop siehst du Zeilen und Spalten, auf Mobile transformiert sich jede Zeile in eine schicke, kompakte Profilkarte.
              </p>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              
              {/* TABLE LAYOUT: Only shown on md and larger screens */}
              <table className="w-full text-left border-collapse hidden md:table">
                <thead>
                  <tr className={`border-b text-xs font-bold uppercase tracking-wider ${tableHeaderBg} ${borderClass}`}>
                    <th className="p-3.5 rounded-l-xl">Name</th>
                    <th className="p-3.5">Durchmesser</th>
                    <th className="p-3.5">Durchschn. Temp.</th>
                    <th className="p-3.5">Umlaufzeit (Tage)</th>
                    <th className="p-3.5 rounded-r-xl">Monde</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLightTheme ? 'divide-stone-100' : 'divide-slate-800/40'}`}>
                  {planetsData.map((planet) => (
                    <tr key={planet.id} className={`text-sm transition-colors ${hoverRowBg}`}>
                      <td className="p-3.5 font-bold flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: planet.glowColor }} />
                        {planet.name}
                      </td>
                      <td className="p-3.5">{planet.diameterKm.toLocaleString('de-DE')} km</td>
                      <td className="p-3.5">{planet.tempC}</td>
                      <td className="p-3.5">{planet.orbitalPeriodDays.toLocaleString('de-DE')} d</td>
                      <td className="p-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          planet.totalMoonsCount > 0 
                            ? (isLightTheme ? 'bg-indigo-50 text-indigo-700' : 'bg-indigo-950/40 text-indigo-400')
                            : (isLightTheme ? 'bg-stone-100 text-stone-500' : 'bg-slate-900 text-slate-500')
                        }`}>
                          {planet.totalMoonsCount} Monde
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* CARD LAYOUT: Only shown on mobile/small screens (< 768px) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {planetsData.map((planet) => (
                  <div 
                    key={planet.id} 
                    className={`border rounded-xl p-4 flex flex-col gap-2.5 shadow-sm ${
                      isLightTheme ? 'bg-stone-50/50' : 'bg-slate-950/40'
                    } ${borderClass}`}
                  >
                    {/* Header */}
                    <div className={`flex justify-between items-center border-b pb-2 ${borderClass}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: planet.glowColor }} />
                        <span className="font-extrabold text-base">{planet.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        planet.totalMoonsCount > 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {planet.totalMoonsCount} Monde
                      </span>
                    </div>

                    {/* Properties List */}
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <div>
                        <p className="text-slate-500 font-medium">Durchmesser</p>
                        <p className="font-bold">{planet.diameterKm.toLocaleString('de-DE')} km</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Temperatur</p>
                        <p className="font-bold">{planet.tempC}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500 font-medium">Umlaufzeit</p>
                        <p className="font-bold">{planet.orbitalPeriodDays.toLocaleString('de-DE')} Tage</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* --- SHOWCASE 2: VIRTUALIZED TABLE (10,000 ROWS) --- */}
        {activeTab === 'virtualized' && (
          <div className={`border rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-0 ${cardBg}`}>
            
            {/* Explanatory Header */}
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" /> Virtualisiertes Daten-Grid (10.000 Zeilen)
                </h3>
                <p className={`text-xs ${isLightTheme ? 'text-stone-500' : 'text-slate-400'}`}>
                  Ein Render-Test mit 10.000 Telemetrie-Einträgen. Wir zeichnen im HTML immer nur die exakt sichtbaren Zeilen.
                </p>
              </div>

              {/* Live DOM Monitor Badge */}
              <div className="flex gap-2 shrink-0">
                <div className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border flex flex-col items-center ${
                  isLightTheme ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950/20 border-amber-800/30 text-amber-400'
                }`}>
                  <span className="opacity-75 uppercase tracking-wider text-[8px]">DOM Nodes im HTML</span>
                  <span className="text-sm font-black">{visibleData.length} Zeilen</span>
                </div>
                <div className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border flex flex-col items-center ${
                  isLightTheme ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-indigo-950/20 border-indigo-800/30 text-indigo-400'
                }`}>
                  <span className="opacity-75 uppercase tracking-wider text-[8px]">Gesamtzeilen im RAM</span>
                  <span className="text-sm font-black">{totalRows.toLocaleString('de-DE')}</span>
                </div>
              </div>
            </div>

            {/* --- TOOLBAR SECTION (Search, Filter, Reset) --- */}
            <div className={`mb-4 flex flex-wrap items-center gap-3 pb-4 border-b ${borderClass}`}>
              
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500" />
                </span>
                <input
                  type="text"
                  placeholder="Sensoren, IDs oder Werte suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-8 py-1.5 rounded-lg border text-xs outline-none transition-all ${
                    isLightTheme
                      ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status filter dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer outline-none transition-all ${
                    isLightTheme
                      ? 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}>
                    Status: {statusFilter === 'ALL' ? 'Alle' : statusFilter}
                    <span className="text-[10px] opacity-60">▼</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" isLightTheme={isLightTheme}>
                  <DropdownMenuLabel>Status filtern</DropdownMenuLabel>
                  <DropdownMenuSeparator isLightTheme={isLightTheme} />
                  <DropdownMenuItem isLightTheme={isLightTheme} onClick={() => setStatusFilter('ALL')}>
                    <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" /> Alle
                  </DropdownMenuItem>
                  <DropdownMenuItem isLightTheme={isLightTheme} onClick={() => setStatusFilter('OK')}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> OK
                  </DropdownMenuItem>
                  <DropdownMenuItem isLightTheme={isLightTheme} onClick={() => setStatusFilter('WARN')}>
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> WARN
                  </DropdownMenuItem>
                  <DropdownMenuItem isLightTheme={isLightTheme} onClick={() => setStatusFilter('ERROR')}>
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2" /> ERROR
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset filter button */}
              {isFilterActive && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setSortConfig({ column: null, direction: null });
                    setColumnOrder(defaultColumnOrder);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    isLightTheme
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Anordnung & Filter zurücksetzen
                </button>
              )}
            </div>

            {/* Table Container Header (Locked) */}
            <div className={`border rounded-t-xl overflow-hidden ${borderClass}`}>
              <div className={`grid grid-cols-12 text-xs font-bold uppercase tracking-wider p-3 border-b ${tableHeaderBg} ${borderClass} select-none`}>
                {columnOrder.map((colKey, index) => {
                  const widthClass = columnWidths[colKey];
                  const label = columnLabels[colKey];
                  const isSorted = sortConfig.column === colKey;
                  const sortDir = sortConfig.direction;
                  const isRightAligned = colKey === 'value';
                  const flexAlignClass = isRightAligned ? 'justify-end' : '';

                  return (
                    <div 
                      key={colKey}
                      className={`${widthClass} group flex items-center gap-1 relative ${flexAlignClass}`}
                    >
                      {/* Left shift button */}
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveColumn(index, 'left');
                          }}
                          title="Spalte nach links verschieben"
                          className={`opacity-0 group-hover:opacity-100 hover:text-indigo-400 transition-opacity p-0.5 cursor-pointer text-[10px] ${
                            isLightTheme ? 'text-stone-400' : 'text-slate-500'
                          }`}
                        >
                          ◀
                        </button>
                      )}

                      {/* Header label and sort trigger */}
                      <span 
                        onClick={() => handleSort(colKey)}
                        className="cursor-pointer hover:text-indigo-400 transition-colors flex items-center gap-1 py-0.5"
                      >
                        {label}
                        {isSorted ? (
                          <span className="text-indigo-400 text-[10px]">
                            {sortDir === 'ASC' ? '▲' : '▼'}
                          </span>
                        ) : (
                          <span className="opacity-0 group-hover:opacity-30 text-[10px]">▲</span>
                        )}
                      </span>

                      {/* Right shift button */}
                      {index < columnOrder.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveColumn(index, 'right');
                          }}
                          title="Spalte nach rechts verschieben"
                          className={`opacity-0 group-hover:opacity-100 hover:text-indigo-400 transition-opacity p-0.5 cursor-pointer text-[10px] ${
                            isLightTheme ? 'text-stone-400' : 'text-slate-500'
                          }`}
                        >
                          ▶
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Viewport */}
            <div 
              ref={containerRef}
              onScroll={handleScroll}
              className={`flex-1 overflow-y-auto border-x border-b rounded-b-xl relative bg-opacity-40 ${
                isLightTheme ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/40 border-slate-800/60'
              }`}
              style={{ height: `${viewportHeight}px` }}
            >
              {/* Dummy Spacer Div: Forces the scrollbar to take up the full virtualized height */}
              <div style={{ height: `${totalHeight}px`, width: '100%', pointerEvents: 'none' }} />

              {/* Absolute Positioned Visible Window */}
              {totalRows === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Database className="w-8 h-8 text-slate-500 mb-2 opacity-50 animate-pulse" />
                  <p className="text-sm font-bold">Keine Telemetriedaten gefunden</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[250px]">
                    Passe deine Such- oder Filtereinstellungen an, um Ergebnisse anzuzeigen.
                  </p>
                </div>
              ) : (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${offsetY}px)`,
                    width: '100%'
                  }}
                >
                  {visibleData.map((log) => (
                    <div
                      key={log.id}
                      className={`grid grid-cols-12 text-xs items-center p-3 border-b ${borderClass} ${hoverRowBg}`}
                      style={{ height: `${rowHeight}px` }}
                    >
                      {columnOrder.map((colKey) => {
                        const widthClass = columnWidths[colKey];
                        
                        if (colKey === 'id') {
                          return <div key="id" className={`${widthClass} font-mono text-slate-500`}>#{log.id}</div>;
                        }
                        if (colKey === 'timestamp') {
                          return <div key="timestamp" className={`${widthClass} font-mono font-medium`}>{log.timestamp}</div>;
                        }
                        if (colKey === 'sensor') {
                          return <div key="sensor" className={`${widthClass} truncate pr-2 font-medium`}>{log.sensor}</div>;
                        }
                        if (colKey === 'value') {
                          return <div key="value" className={`${widthClass} font-mono font-bold`}>{log.value}</div>;
                        }
                        if (colKey === 'status') {
                          return (
                            <div key="status" className={`${widthClass} flex justify-center`}>
                              <span className={`w-2 h-2 rounded-full ${
                                log.status === 'ERROR' 
                                  ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]' 
                                  : log.status === 'WARN'
                                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                                  : 'bg-emerald-500'
                              }`} />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Footer Note */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Hier werden konstant nur {visibleData.length} Elemente gerendert. Scrolle schnell, um den flüssigen Austausch zu sehen!</span>
              </div>
              <div>
                <span>Filter aktiv: {totalRows.toLocaleString('de-DE')} von 10.000 Einträgen</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

