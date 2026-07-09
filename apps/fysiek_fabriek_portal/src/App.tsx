export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 py-5 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">FysiekFabriek Portal</h1>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hulpmiddelen & Risicobeoordeling</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs font-bold text-slate-300 hover:text-sky-400 transition-colors bg-slate-700/40 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-1">
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
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-950/50 px-3 py-1.5 rounded-md">FysiekFabriek Dashboard</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
            Welkom bij de <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">FysiekFabriek Tools</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Selecteer hieronder een van de specifieke FysiekFabriek applicaties om aan de slag te gaan met de intake of de risico-triage.
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Card 1: Maatwerk Risico Scan (Stoplicht Triage) */}
          <a 
            href="/maatwerk_risico_scan/"
            className="group bg-slate-800 hover:bg-slate-800/80 border border-slate-700 hover:border-sky-500/50 rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-sky-500/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 to-indigo-500" />
            <div className="space-y-4">
              <div className="w-12 h-12 bg-sky-950/50 rounded-2xl flex items-center justify-center border border-sky-800/50 text-sky-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">Maatwerk Risico Scan</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Evalueer snel projecten aan de hand van het stoplichtmedisch model (Rood, Oranje, Groen). Inclusief een interactieve FMEA-lite risicoanalyse voor Oranje projecten en automatische rapportgeneratie.
              </p>
            </div>
            <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5 mt-4 self-start">
              <span>Start Risico Scan</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

          {/* Card 2: Project Intake Scan (Fokus Flowchart) */}
          <a 
            href="/project_intake_scan/"
            className="group bg-slate-800 hover:bg-slate-800/80 border border-slate-700 hover:border-[#F26522]/50 rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-orange-500/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F26522]" />
            <div className="space-y-4">
              <div className="w-12 h-12 bg-orange-950/50 rounded-2xl flex items-center justify-center border border-orange-850/50 text-[#F26522] group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#F26522] transition-colors">Project Intake Scan</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Doorloop de 11 criteria voor uitdagers en uitdagingen om te bepalen of een specifiek hulpmiddelenproject past binnen de Fokus-formule. Houdt een dossier-geschiedenis lokaal bij.
              </p>
            </div>
            <div className="text-xs font-bold text-[#F26522] flex items-center gap-1.5 mt-4 self-start">
              <span>Start Intake Scan</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 px-6 text-center text-slate-600 text-xs mt-auto">
        <p>© 2026 FysiekFabriek & Fokus. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  );
}
