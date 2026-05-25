interface IconProps {
  isLightTheme: boolean;
}

export function ReturnOrbitIcon({ isLightTheme }: IconProps) {
  return (
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
  );
}

export function OrbitVortexIcon({ isLightTheme }: IconProps) {
  return (
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
  );
}
