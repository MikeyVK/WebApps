import React from 'react';

interface FFLogoProps {
  className?: string;
  onClick?: () => void;
}

export const FFLogo: React.FC<FFLogoProps> = ({ className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-start leading-none select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <span className="text-[10px] font-black text-slate-900 tracking-widest uppercase mb-0.5 ml-[2px]">Fokus</span>
      <span className="text-2xl font-black text-[#F26522] tracking-tight leading-none uppercase">
        FysiekFabriek
      </span>
    </div>
  );
};
