import React from 'react';

export interface FooterProps {
  copyright?: string;
  notes?: string[];
  className?: string;
  innerClassName?: string;
  theme?: 'theme-brutalist' | 'theme-dark';
  onChangeTheme?: (newTheme: 'theme-brutalist' | 'theme-dark') => void;
}

export const Footer: React.FC<FooterProps> = ({
  copyright,
  notes = [],
  className = '',
  innerClassName = 'max-w-7xl',
  theme,
  onChangeTheme
}) => {
  return (
    <footer className={`bg-white border-t-app border-color-app py-6 px-6 text-slate-500 text-xs mt-auto print:hidden ${className}`}>
      <div className={`mx-auto space-y-4 ${innerClassName}`}>
        {notes.length > 0 && (
          <div className="space-y-1 text-center">
            {notes.map((note, idx) => (
              <p key={idx} className="opacity-65 text-[10px] font-semibold text-slate-500">
                {note}
              </p>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-3">
          {copyright ? (
            <p className="font-bold text-slate-700">{copyright}</p>
          ) : (
            <div />
          )}
          {theme && onChangeTheme && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Thema:</span>
              <button 
                onClick={() => onChangeTheme(theme === 'theme-brutalist' ? 'theme-dark' : 'theme-brutalist')}
                className="w-8 h-8 border-2 border-slate-800 rounded-xl bg-white hover:bg-slate-50 text-slate-800 transition-all shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] cursor-pointer flex items-center justify-center text-xs font-black"
                title={theme === 'theme-brutalist' ? 'Schakel naar donker thema' : 'Schakel naar licht thema'}
                aria-label="Schakel thema"
              >
                {theme === 'theme-brutalist' ? '🌙' : '☀️'}
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
