
import metadata from '../../../apps-metadata.json';
import { AppMetadata } from '@shared/types/metadata';

export default function App() {
  const portalMeta = (metadata.apps as AppMetadata[]).find(app => app.id === 'fysiek_fabriek_portal');
  const appTheme = portalMeta?.defaultTheme || 'theme-brutalist';

  const scans = (metadata.apps as AppMetadata[])
    .filter(app => app.id !== 'fysiek_fabriek_portal')
    .sort((a, b) => a.order - b.order);

  const renderIcon = (iconName: string) => {
    if (iconName === 'ClipboardList') {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    }
    if (iconName === 'ShieldCheck') {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen ${appTheme} bg-bg-app text-text-app flex flex-col font-sans relative overflow-x-hidden antialiased`}>
      {/* Header */}
      <header className="bg-white border-b-app border-color-app py-5 px-6 sticky top-0 z-40 shadow-app-small">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2.5 border-2 border-slate-900 rounded-xl flex items-center justify-center transform rotate-[-2deg] shadow-[2px_2px_0px_0px_rgba(242,101,34,1)]">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">FysiekFabriek Portal</h1>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hulpmiddelen & Risicobeoordeling</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="../" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 border-2 border-color-app rounded-app-btn shadow-app-small flex items-center gap-1.5 cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Algemene Portal</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center items-center gap-12 z-10">
        
        {/* Welcome Section */}
        <div className="text-center space-y-4 max-w-2xl">
          <span className="text-xs font-bold text-[#F26522] uppercase tracking-widest bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-md">FysiekFabriek Dashboard</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Welkom bij de FysiekFabriek Scans
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
            Selecteer hieronder een van de specifieke FysiekFabriek applicaties om aan de slag te gaan met de intake of de risico-scan.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {scans.map(scan => (
            <a 
              key={scan.id}
              href={`..${scan.path}`}
              className="group bg-white border-width-app border-color-app p-8 rounded-app-card transition-all relative overflow-hidden flex flex-col justify-between shadow-app hover:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] hover:-translate-y-0.5 duration-200 cursor-pointer text-slate-900"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F26522]" />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center border-2 border-color-app text-[#F26522] group-hover:scale-110 transition-transform">
                  {renderIcon(scan.icon)}
                </div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-[#F26522] transition-colors">{scan.name}</h3>
                <p className="text-slate-650 text-xs leading-relaxed font-semibold">
                  {scan.description}
                </p>
              </div>
              <div className="text-xs font-black text-[#F26522] flex items-center gap-1.5 mt-4 self-start">
                <span>Start {scan.name.replace('Project ', '').replace('Maatwerk ', '')}</span>
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
        <p className="font-bold">© 2026 FysiekFabriek & Fokus. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  );
}
