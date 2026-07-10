import React from 'react';

export interface HeaderAction {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: HeaderAction[];
  className?: string;
  innerClassName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  title,
  subtitle,
  actions = [],
  className = '',
  innerClassName = 'max-w-7xl'
}) => {
  return (
    <header className={`bg-white border-b-app border-color-app py-4 px-6 sticky top-0 z-40 print:hidden shadow-app-small ${className}`}>
      <div className={`mx-auto flex items-center justify-between ${innerClassName}`}>
        
        {/* Left Slot: Logo / Title / Subtitle */}
        <div className="flex items-center gap-4">
          {logo ? (
            logo
          ) : title ? (
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          ) : null}
          
          {subtitle && (
            <div className="hidden sm:block border-l-2 border-slate-200 pl-4 py-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{subtitle}</p>
            </div>
          )}
        </div>

        {/* Right Slot: Dynamic Actions */}
        <div className="flex items-center gap-3">
          {actions.map((action, idx) => {
            const btnClass = `px-4 py-2 border-2 border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] cursor-pointer flex items-center gap-1.5 ${
              action.variant === 'primary' 
                ? 'bg-[#F26522] hover:bg-orange-600 text-white border-slate-800 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[2px]' 
                : action.isActive 
                  ? 'text-white bg-slate-900' 
                  : 'text-slate-800 bg-white hover:bg-slate-50'
            }`;

            if (action.href) {
              return (
                <a key={idx} href={action.href} className={btnClass}>
                  {action.icon}
                  <span>{action.label}</span>
                </a>
              );
            }

            return (
              <button key={idx} onClick={action.onClick} className={btnClass}>
                {action.icon}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
