import { Layers, ClipboardList, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f294a] text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#f19d76]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="bg-[#0f294a]/85 backdrop-blur border-b border-slate-700/60 py-6 px-8 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-[#f19d76] to-[#e0855c] rounded-xl flex items-center justify-center shadow-lg shadow-[#f19d76]/10">
              <Layers className="w-6 h-6 text-[#0f294a] stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                WebApps <span className="text-[#f19d76]">Portal</span>
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Central Management & Analysis</p>
            </div>
          </div>
          <span className="text-xs text-[#f19d76] bg-[#f19d76]/10 border border-[#f19d76]/20 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Workspace
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-16 flex flex-col justify-center items-center gap-14 z-10">
        
        {/* Welcome Section */}
        <div className="text-center space-y-4 max-w-2xl">
          <span className="text-xs font-bold text-[#f19d76] uppercase tracking-widest bg-[#f19d76]/10 border border-[#f19d76]/20 px-3 py-1.5 rounded-md">
            Algemeen Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            Applicatie <span className="bg-gradient-to-r from-[#f19d76] to-orange-400 bg-clip-text text-transparent">Beheer Portaal</span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
            Selecteer een van de onderstaande modules om te starten. U kunt de applicaties zowel los gebruiken als via het specifieke FysiekFabriek sub-portaal.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          
          {/* Card 1: FysiekFabriek Portal */}
          <a 
            href="fysiek_fabriek_portal/"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#f19d76] to-orange-400" />
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#f19d76]/10 rounded-2xl flex items-center justify-center border border-[#f19d76]/20 text-[#f19d76] group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#f19d76] transition-colors">FysiekFabriek Portaal</h3>
              <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                De overkoepelende startpagina specifiek voor alle FysiekFabriek hulpmiddelen en triage tools. Bundelt de scans in een gezamenlijke interface.
              </p>
            </div>
            <div className="text-xs font-bold text-[#f19d76] flex items-center gap-1.5 mt-4 self-start">
              <span>Open FF Portaal</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

          {/* Card 2: Project Intake Scan */}
          <a 
            href="project_intake_scan/"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f19d76]" />
            <div className="space-y-4">
              <div className="w-12 h-12 bg-orange-950/40 rounded-2xl flex items-center justify-center border border-[#f19d76]/20 text-[#f19d76] group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#f19d76] transition-colors">Project Intake Scan</h3>
              <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                Controleer een hulpvraag aan de hand van de 11 Fokus-criteria. Bepaal direct of de uitdaging geschikt is voor co-creatie of dat deze buiten de formule valt.
              </p>
            </div>
            <div className="text-xs font-bold text-[#f19d76] flex items-center gap-1.5 mt-4 self-start">
              <span>Start Intake Scan</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

          {/* Card 3: Maatwerk Risico Scan */}
          <a 
            href="maatwerk_risico_scan/"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-[#f19d76]" />
            <div className="space-y-4">
              <div className="w-12 h-12 bg-sky-950/40 rounded-2xl flex items-center justify-center border border-[#f19d76]/20 text-[#f19d76] group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#f19d76] transition-colors">Maatwerk Risico Scan</h3>
              <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                Classificeer projecten binnen de MDR-kwaliteitsrichtlijnen (Rood, Oranje, Groen). Uitgerust met FMEA-lite risicomatrix en exportfunctionaliteit.
              </p>
            </div>
            <div className="text-xs font-bold text-[#f19d76] flex items-center gap-1.5 mt-4 self-start">
              <span>Start Risico Scan</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#0b1d35] border-t border-slate-800/80 py-6 px-6 text-center text-slate-500 text-xs mt-auto">
        <p>© 2026 WebApps Portal. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  );
}
