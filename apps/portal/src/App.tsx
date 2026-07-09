import { useState } from 'react';
import * as Icons from 'lucide-react';
import metadata from '../../../apps-metadata.json';
import { AppMetadata } from '@shared/types/metadata';

export default function App() {
  const [theme, setTheme] = useState<'theme-dark' | 'theme-brutalist'>('theme-dark');

  const sortedApps = (metadata.apps as AppMetadata[]).sort((a, b) => a.order - b.order);

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-6 h-6" />;
    }
    return <Icons.Layers className="w-6 h-6" />;
  };

  return (
    <div className={`min-h-screen ${theme} bg-bg-app text-text-app flex flex-col font-sans relative overflow-x-hidden antialiased`}>
      {/* Header */}
      <header className="bg-white border-b-app border-color-app py-5 px-6 sticky top-0 z-40 print:hidden shadow-app-small">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center border-2 border-slate-900 transform rotate-[-2deg] shadow-[2px_2px_0px_0px_rgba(242,101,34,1)]">
              <Icons.Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                WebApps Portal
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Central Management & Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(prev => prev === 'theme-dark' ? 'theme-brutalist' : 'theme-dark')}
              className="text-xs font-black px-3.5 py-2 border-2 border-color-app bg-white text-slate-800 rounded-app-btn shadow-app-small transition-all hover:bg-[#F26522] hover:text-white cursor-pointer"
            >
              {theme === 'theme-dark' ? '☀️ Light Brutalist' : '🌙 Warm Dark'}
            </button>
            <span className="text-xs text-[#F26522] bg-orange-50 border-2 border-color-app px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider print:hidden">
              Workspace
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-16 flex flex-col justify-center items-center gap-14 z-10">
        
        {/* Welcome Section */}
        <div className="text-center space-y-4 max-w-2xl">
          <span className="text-xs font-bold text-[#F26522] uppercase tracking-widest bg-orange-50 border-2 border-color-app px-3 py-1.5 rounded-md">
            Algemeen Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Applicatie Beheer Portaal
          </h2>
          <p className="text-slate-650 text-sm md:text-base leading-relaxed font-semibold">
            Selecteer een van de onderstaande modules om te starten. U kunt de applicaties zowel los gebruiken als via het specifieke FysiekFabriek sub-portaal.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {sortedApps.map(app => (
            <a 
              key={app.id}
              href={app.path.replace(/^\//, '')}
              className="group bg-white border-width-app border-color-app p-8 rounded-app-card transition-all relative overflow-hidden flex flex-col justify-between shadow-app hover:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] hover:-translate-y-1 duration-300 cursor-pointer text-slate-900"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F26522]" />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center border-2 border-color-app text-[#F26522] group-hover:scale-110 transition-transform">
                  {renderIcon(app.icon)}
                </div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-[#F26522] transition-colors">{app.name}</h3>
                <p className="text-slate-650 text-xs leading-relaxed font-semibold">
                  {app.description}
                </p>
              </div>
              <div className="text-xs font-black text-[#F26522] flex items-center gap-1.5 mt-4 self-start">
                <span>
                  {app.id === 'fysiek_fabriek_portal' ? 'Open FF Portaal' : `Start ${app.name.replace('Project ', '').replace('Maatwerk ', '')}`}
                </span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t-app border-color-app py-6 px-6 text-center text-slate-500 text-xs mt-auto">
        <p className="font-bold">© 2026 WebApps Portal. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  );
}
