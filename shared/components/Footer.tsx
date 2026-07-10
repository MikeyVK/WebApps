import React from 'react';

export interface FooterProps {
  copyright?: string;
  notes?: string[];
  className?: string;
  innerClassName?: string;
}

export const Footer: React.FC<FooterProps> = ({
  copyright,
  notes = [],
  className = '',
  innerClassName = 'max-w-7xl'
}) => {
  return (
    <footer className={`bg-white border-t-app border-color-app py-6 px-6 text-center text-slate-500 text-xs mt-auto print:hidden ${className}`}>
      <div className={`mx-auto space-y-2 ${innerClassName}`}>
        {copyright && <p className="font-bold text-slate-700">{copyright}</p>}
        {notes.map((note, idx) => (
          <p key={idx} className="opacity-65 text-[10px] font-semibold text-slate-500">
            {note}
          </p>
        ))}
      </div>
    </footer>
  );
};
