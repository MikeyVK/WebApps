import { useState, useEffect } from 'react';
import { Home, Plus, Trash2, Printer, ClipboardList, Info, Check, AlertCircle } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { FFLogo } from '@shared/components/FFLogo';
import { Footer } from '@shared/components/Footer';

interface SavedChecklist {
  id: number;
  date: string;
  projectName: string;
  projectDescription: string;
  challengerName: string;
  status: 'Geschikt' | 'Niet Geschikt';
  checks: Record<string, boolean>;
  notes: string;
}

interface ChecklistBlock {
  id: string;
  title: string;
  headerBg: string;
  borderClass: string;
  explanation: {
    title: string;
    text: string;
    examples?: {
      notAllowed: string[];
      allowed: string[];
    };
  };
  checkboxes: { id: string; label: string }[];
}

const CHECKLIST_BLOCKS: ChecklistBlock[] = [
  {
    id: 'uitdager_1',
    title: 'De uitdager',
    headerBg: 'bg-[#F9D448]', // Yellow
    borderClass: 'border-[#F9D448]',
    explanation: {
      title: 'Toelichting: De uitdager',
      text: 'FysiekFabriek is voor mensen met een fysieke beperking om met eigen regie over het eigen leven een oplossing te vinden. De uitdager moet in staat zijn eigen keuzes te maken en daarvoor verantwoordelijkheid te kunnen dragen.'
    },
    checkboxes: [
      { id: 'beperking', label: 'Heeft een fysieke beperking' },
      { id: 'meerderjarig', label: 'Is meerderjarig' },
      { id: 'regie', label: 'Is handelingsbekwaam: kan eigen regie voeren en keuzes maken' }
    ]
  },
  {
    id: 'uitdaging',
    title: 'De uitdaging',
    headerBg: 'bg-[#CBD5E1]', // Grey
    borderClass: 'border-[#CBD5E1]',
    explanation: {
      title: 'Toelichting: De uitdaging',
      text: 'Er worden bij FysiekFabriek alleen oplossingen gezocht voor één specifieke persoon: de uitdager. De oplossing is altijd maatwerk: Design-for-one. Daarnaast worden er alleen voorwerpen gemaakt die uitsluitend een ergonomisch, recreatief of huishoudelijk comfortdoel dienen en geen medische of compenserende claim hebben.'
    },
    checkboxes: [
      { id: 'eigen_leven', label: 'Gaat over het eigen leven van de uitdager' },
      { id: 'activiteit', label: 'Dient om een gewone dagelijkse activiteit mogelijk of makkelijker te maken' },
      { id: 'comfortdoel', label: 'Dient uitsluitend een comfortdoel (geen medische claim)' }
    ]
  },
  {
    id: 'uitdager_2',
    title: 'De uitdager (Lichaam & Advies)',
    headerBg: 'bg-[#FDCF9E]', // Peach
    borderClass: 'border-[#FDCF9E]',
    explanation: {
      title: 'Toelichting: Lichaam & Advies',
      text: 'Het is belangrijk dat er sprake is van een stabiele situatie. En het is noodzakelijk dat de uitdager zelf goed weet wat die wel en niet kan en wat goed is voor diens lijf. FysiekFabriek kan hierin niet adviseren. FysiekFabriek is geen zorg.'
    },
    checkboxes: [
      { id: 'lichaam_kennis', label: 'Weet wat diens lichaam kan en aankan' },
      { id: 'advies_gehad', label: 'Heeft bestaande oplossingen geprobeerd en hierbij hulp/advies gehad (bijv. ergotherapeut)' }
    ]
  },
  {
    id: 'wat_kan_niet',
    title: 'Wat kan niet',
    headerBg: 'bg-[#F8C1C1]', // Pink
    borderClass: 'border-[#F8C1C1]',
    explanation: {
      title: 'Toelichting: Uitsluitingscriteria',
      text: 'Bepaalde categorieën hulpmiddelen zijn om veiligheidsredenen strikt uitgesloten van ontwikkeling binnen de FysiekFabriek.',
      examples: {
        notAllowed: [
          'Vitale functies: beugel beademingsslang, sondevloeistof-regelaar, gemotoriseerde microlax-tangen.',
          'Lichaamsgewicht: Tilliften, sta-op-hulp beugels, mechanische remverlenging.',
          'Software & Elektronica: bluetooth-app die verlichting regelt, verwarmde kussens op accu\'s.'
        ],
        allowed: [
          'Ondersteunend: bekerhouder, smartphone-statief, ergonomische bestekgreep, handmatige hulpmiddelen.',
          'Comfort: zachte opvulling voor armsteun, bekerclip op een tafelblad, lichte penhouder.',
          'Mechanisch: volledig mechanische drukknopvergroter of mechanische schuifhendel.'
        ]
      }
    },
    checkboxes: [
      { id: 'geen_vitale', label: 'Geen oplossing voor problemen met vitale functies' },
      { id: 'geen_gewicht', label: 'Geen oplossing die het volledige lichaamsgewicht draagt' },
      { id: 'geen_software', label: 'Geen software, apps of actieve elektronische componenten' }
    ]
  },
  {
    id: 'aanpassing',
    title: 'Let op: bestaande hulpmiddelen worden niet aangepast',
    headerBg: 'bg-[#E2C6A9]', // Brown
    borderClass: 'border-[#E2C6A9]',
    explanation: {
      title: 'Toelichting: Geen aanpassing van bestaande hulpmiddelen',
      text: 'Bestaande, gecertificeerde hulpmiddelen (zoals een rolstoel) mogen nooit constructief worden gewijzigd door boren, zagen of lassen, omdat hiermee de fabrieksgarantie en veiligheidscertificering (CE-markering) vervallen. Bevestigingen mogen uitsluitend via schroefloze, demontabele klemverbindingen plaatsvinden.'
    },
    checkboxes: [
      { id: 'geen_constructieve_wijziging', label: 'Geen constructieve wijzigingen (nooit boren, zagen of lassen aan/in een rolstoel)' },
      { id: 'klemverbinding', label: 'Bevestigingen uitsluitend via schroefloze, demontabele klemverbindingen' }
    ]
  },
  {
    id: 'overig',
    title: '...??',
    headerBg: 'bg-[#D1C4E9]', // Purple
    borderClass: 'border-[#D1C4E9]',
    explanation: {
      title: 'Toelichting: Overige checks',
      text: 'Gebruik uw gezond verstand om te beoordelen of er nog andere risico\'s of belemmeringen zijn die de geschiktheid van de uitdaging in de weg staan.'
    },
    checkboxes: [
      { id: 'geen_overige_risicos', label: 'Geen overige risico\'s of twijfels geïdentificeerd (gebruik het opmerkingenveld bij twijfel)' }
    ]
  }
];

export default function ProjectIntakeChecklist() {
  const [currentView, setCurrentView] = useState<'form' | 'dashboard'>('form');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [challengerName, setChallengerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [activeBlock, setActiveBlock] = useState<ChecklistBlock>(CHECKLIST_BLOCKS[0]);
  const [savedChecklists, setSavedChecklists] = useState<SavedChecklist[]>([]);
  const [activeChecklistId, setActiveChecklistId] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [theme, setTheme] = useState<'theme-brutalist' | 'theme-dark'>(
    (localStorage.getItem('app-theme') as 'theme-brutalist' | 'theme-dark') || 'theme-brutalist'
  );

  const handleChangeTheme = (newTheme: 'theme-brutalist' | 'theme-dark') => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Load history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('project_intake_checklist_history');
    if (history) {
      try {
        setSavedChecklists(JSON.parse(history));
      } catch (e) {
        console.error('Error parsing checklist history:', e);
      }
    }
  }, []);

  const handleCheckboxChange = (id: string) => {
    setChecks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleBlockAll = (block: ChecklistBlock, e: React.MouseEvent) => {
    e.stopPropagation();
    const allCheckboxIds = block.checkboxes.map(c => c.id);
    const allChecked = allCheckboxIds.every(id => checks[id] === true);
    setChecks(prev => {
      const nextChecks = { ...prev };
      allCheckboxIds.forEach(id => {
        nextChecks[id] = !allChecked;
      });
      return nextChecks;
    });
  };

  const getSuitabilityStatus = (): 'Geschikt' | 'Niet Geschikt' => {
    const allCheckboxIds = CHECKLIST_BLOCKS.flatMap(b => b.checkboxes.map(c => c.id));
    const allChecked = allCheckboxIds.every(id => checks[id] === true);
    return allChecked ? 'Geschikt' : 'Niet Geschikt';
  };

  const handleSave = () => {
    if (!projectName.trim()) {
      setValidationError('Vul a.u.b. een projectnaam in.');
      return;
    }
    setValidationError('');

    const suitability = getSuitabilityStatus();
    const newChecklist: SavedChecklist = {
      id: activeChecklistId || Date.now(),
      date,
      projectName,
      projectDescription,
      challengerName,
      status: suitability,
      checks,
      notes
    };

    const updated = [newChecklist, ...savedChecklists.filter(c => c.id !== newChecklist.id)];
    setSavedChecklists(updated);
    localStorage.setItem('project_intake_checklist_history', JSON.stringify(updated));
    setShowSuccessModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Weet u zeker dat u deze intake wilt verwijderen?')) {
      const updated = savedChecklists.filter(c => c.id !== id);
      setSavedChecklists(updated);
      localStorage.setItem('project_intake_checklist_history', JSON.stringify(updated));
    }
  };

  const loadChecklist = (item: SavedChecklist) => {
    setActiveChecklistId(item.id);
    setProjectName(item.projectName);
    setProjectDescription(item.projectDescription);
    setChallengerName(item.challengerName);
    setDate(item.date);
    setChecks(item.checks);
    setNotes(item.notes);
    setValidationError('');
    setShowSuccessModal(false);
    setCurrentView('form');
  };


  const handleStartNew = () => {
    setActiveChecklistId(null);
    setProjectName('');
    setProjectDescription('');
    setChallengerName('');
    setDate(new Date().toISOString().split('T')[0]);
    setChecks({});
    setNotes('');
    setValidationError('');
    setShowSuccessModal(false);
    setCurrentView('form');
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintItem = (item: SavedChecklist) => {
    loadChecklist(item);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const renderBlockIcon = (blockId: string) => {
    switch (blockId) {
      case 'uitdager_1':
        return (
          <div className="hidden sm:flex w-14 h-14 bg-amber-100 border-2 border-slate-800 rounded-xl items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] print:border-slate-300 print:shadow-none">
            <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
              <path d="M3 13h18" />
              <path d="M12 11v4" />
            </svg>
          </div>
        );
      case 'uitdaging':
        return (
          <div className="hidden sm:flex w-14 h-14 bg-slate-100 border-2 border-slate-800 rounded-xl items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] print:border-slate-300 print:shadow-none">
            <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="m12 8 1.5 3H17l-2.5 2 1 3.5-3.5-2.5-3.5 2.5 1-3.5-2.5-2h3.5L12 8Z" fill="#F9D448" />
            </svg>
          </div>
        );
      case 'uitdager_2':
        return (
          <div className="hidden sm:flex w-14 h-14 bg-orange-100 border-2 border-slate-800 rounded-xl items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] print:border-slate-300 print:shadow-none">
            <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7" r="3" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h2" />
              <circle cx="17" cy="15" r="2.5" />
              <path d="m19 17 2 2" />
            </svg>
          </div>
        );
      case 'wat_kan_niet':
        return (
          <div className="hidden sm:flex w-14 h-14 bg-red-100 border-2 border-slate-800 rounded-xl items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] print:border-slate-300 print:shadow-none">
            <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="9" x2="8.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="16" y1="9" x2="16.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M8 16c1.5-1.5 4.5-1.5 6 0" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'aanpassing':
        return (
          <div className="hidden sm:flex w-14 h-14 bg-amber-50 border-2 border-slate-800 rounded-xl items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] print:border-slate-300 print:shadow-none">
            <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              <line x1="3" y1="3" x2="21" y2="21" stroke="red" strokeWidth="2.5" />
            </svg>
          </div>
        );
      case 'overig':
        return (
          <div className="hidden sm:flex w-14 h-14 bg-purple-100 border-2 border-slate-800 rounded-xl items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] print:border-slate-300 print:shadow-none">
            <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const suitability = getSuitabilityStatus();

  return (
    <div className={`min-h-screen ${theme} bg-bg-app text-text-app flex flex-col font-sans relative overflow-x-clip antialiased`}>
      <Header 
        logo={<FFLogo onClick={handleStartNew} />}
        subtitle="Project Intake Checklist"
        actions={[
          {
            label: 'Home',
            icon: <Home className="w-3.5 h-3.5" />,
            href: '../fysiek_fabriek_portal/',
            variant: 'secondary'
          },
          {
            label: 'Geschiedenis',
            onClick: () => setCurrentView('dashboard'),
            isActive: currentView === 'dashboard',
            variant: 'secondary'
          },
          {
            label: 'Nieuwe Intake',
            icon: <Plus className="w-4 h-4" />,
            onClick: handleStartNew,
            variant: 'primary'
          }
        ]}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start">
        {currentView === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form & Checklist Grid (A4 view) */}
            <div className="lg:col-span-8 space-y-6 print:w-full print:border-none print:shadow-none">
              
              {/* Projectpaspoort Block */}
              <div className="bg-white border-width-app border-color-app p-6 rounded-app-card shadow-app print:hidden">
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">
                  Projectpaspoort
                </h2>
                {validationError && (
                  <div className="bg-amber-50 border-2 border-slate-800 p-3.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Projectnaam *
                    </label>
                    <input 
                      type="text"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      placeholder="Bijv. Ergonomische deurgreep"
                      className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:bg-white print:border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Uitdager (Naam)
                    </label>
                    <input 
                      type="text"
                      value={challengerName}
                      onChange={e => setChallengerName(e.target.value)}
                      placeholder="Naam van de uitdager"
                      className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:bg-white print:border-slate-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Projectomschrijving
                    </label>
                    <textarea 
                      value={projectDescription}
                      onChange={e => setProjectDescription(e.target.value)}
                      placeholder="Beschrijf kort de uitdaging en de beoogde oplossing..."
                      rows={2}
                      className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:bg-white print:border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Digital A4 Checklist Grid */}
              <div className="bg-white border-width-app border-color-app p-8 rounded-app-card shadow-app relative print:border-none print:p-0 print:shadow-none">
                
                {/* Print Title Block */}
                <div className="hidden print:flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-5">
                  <div>
                    <h1 className="text-2xl font-black uppercase text-slate-900">Checklist uitdagingen</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Fokus FysiekFabriek</p>
                  </div>
                  <div className="text-right text-xs font-bold text-slate-700 max-w-sm">
                    <p>Project: <span className="font-black text-slate-900">{projectName || 'N.v.t.'}</span></p>
                    <p>Uitdager: <span className="font-black text-slate-900">{challengerName || 'N.v.t.'}</span></p>
                    <p>Datum: <span className="font-black text-slate-900">{date}</span></p>
                    {projectDescription && (
                      <p className="text-[10px] text-slate-500 italic font-medium mt-1 leading-tight text-right break-words max-w-[240px]">
                        Omschrijving: {projectDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6 print:space-y-0 print:grid print:grid-cols-2 print:gap-4">
                  {CHECKLIST_BLOCKS.map(block => {
                    const blockChecked = block.checkboxes.every(c => checks[c.id] === true);
                    return (
                      <div 
                        key={block.id}
                        onClick={() => setActiveBlock(block)}
                        onMouseEnter={() => setActiveBlock(block)}
                        className={`border-2 rounded-2xl transition-all duration-200 overflow-hidden cursor-pointer shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] print:shadow-none print:border-slate-300 print:break-inside-avoid ${block.borderClass} ${
                          activeBlock.id === block.id 
                            ? 'ring-2 ring-slate-800/10 scale-[1.01] translate-y-[-2px] border-slate-900' 
                            : 'hover:translate-y-[-1px] hover:border-slate-900'
                        }`}
                      >
                        {/* Header bar of the block */}
                        <div className={`py-2.5 px-4 flex items-center justify-between border-b-2 border-slate-800 print:border-slate-300 ${block.headerBg}`}>
                          <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">{block.title}</h3>
                          <div 
                            role="button"
                            onClick={(e) => handleToggleBlockAll(block, e)}
                            className="w-5 h-5 bg-white border-2 border-slate-800 rounded flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer print:border-slate-300 print:bg-white shrink-0"
                            title={blockChecked ? "Deselecteer alle criteria" : "Selecteer alle criteria"}
                          >
                            {blockChecked && <Check className="w-4 h-4 text-emerald-600 stroke-[3.5]" />}
                          </div>
                        </div>

                        {/* Integrated clickable bullet checklist */}
                        <div className="p-4 bg-white flex items-start gap-4">
                          {renderBlockIcon(block.id)}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 flex-1">
                            {block.checkboxes.map(cb => (
                              <label key={cb.id} className="flex items-start gap-3 cursor-pointer group text-xs font-semibold text-slate-700 py-1 leading-normal">
                                {/* Screen Checkbox Input */}
                                <input 
                                  type="checkbox"
                                  checked={!!checks[cb.id]}
                                  onChange={() => handleCheckboxChange(cb.id)}
                                  className="shrink-0 mt-0.5 print:hidden"
                                />
                                {/* Print Checkbox visual representation on paper */}
                                <span className="hidden print:flex items-center justify-center font-mono text-[9px] text-slate-800 shrink-0 mt-0.5 border border-slate-400 w-[14px] h-[14px] font-bold bg-white rounded">
                                  {checks[cb.id] ? '✓' : ' '}
                                </span>
                                <span className="group-hover:text-slate-900 transition-colors">{cb.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Opmerkingenveld voor afdrukken */}
                {notes && (
                  <div className="hidden print:block mt-6 border-t-2 border-slate-300 pt-4">
                    <h3 className="text-xs font-black uppercase text-slate-900 mb-1">Opmerkingen / Notities:</h3>
                    <p className="text-xs text-slate-700 leading-relaxed italic">{notes}</p>
                  </div>
                )}

                {/* Handtekeningen voor afdrukken */}
                <div className="hidden print:grid grid-cols-2 gap-8 mt-6 pt-4 border-t-2 border-slate-800">
                  <div className="space-y-10">
                    <p className="text-xs font-bold text-slate-500">Handtekening Uitdager:</p>
                    <div className="border-b border-slate-400 w-48"></div>
                  </div>
                  <div className="space-y-10">
                    <p className="text-xs font-bold text-slate-500">Handtekening FysiekFabriek Coach:</p>
                    <div className="border-b border-slate-400 w-48"></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Explanations & Controls */}
            <div className="lg:col-span-4 space-y-6 print:hidden">
              
              {/* Suitability Status Badge */}
              <div className="bg-white border-width-app border-color-app p-6 rounded-app-card shadow-app flex flex-col items-center text-center gap-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Project Status</h3>
                
                <div className={`px-4 py-2 border-2 border-slate-800 rounded-full font-black text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] ${
                  suitability === 'Geschikt' 
                    ? 'bg-emerald-100 text-emerald-800 border-slate-800' 
                    : 'bg-amber-50 text-amber-800 border-slate-800'
                }`}>
                  {suitability === 'Geschikt' ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Geschikt</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>In Beoordeling</span>
                    </>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-500 leading-relaxed px-2">
                  {suitability === 'Geschikt' 
                    ? 'Alle verplichte criteria zijn met succes aangekruist. Het project is geschikt voor de Fokus FysiekFabriek formule.' 
                    : 'Doorloop alle 6 gekleurde blokken en kruis alle checklists aan om de geschiktheid te bevestigen.'}
                </p>

                {/* Notes Input */}
                <div className="w-full border-t border-slate-200 pt-4 mt-2">
                  <label className="block text-left text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Notities / Opmerkingen
                  </label>
                  <textarea 
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Opmerkingen, specifieke twijfels of toelichtingen bij de intake..."
                    rows={3}
                    className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-200 pt-4 mt-2">
                  <button 
                    onClick={handleSave}
                    className="bg-[#F26522] hover:bg-orange-600 border-2 border-slate-800 text-white font-bold text-xs uppercase py-3 rounded-xl tracking-wider shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] cursor-pointer transition-all"
                  >
                    Opslaan
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 text-slate-800 font-bold text-xs uppercase py-3 rounded-xl tracking-wider shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Printen</span>
                  </button>
                </div>
              </div>

              {/* Interactive Explanation Card */}
              <div className={`border-width-app border-color-app p-6 rounded-app-card shadow-app bg-white transition-all duration-300 relative`}>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900" />
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-slate-800" />
                  <h3 className="font-black text-xs uppercase tracking-wider text-slate-800">
                    {activeBlock.explanation.title}
                  </h3>
                </div>

                <p className="text-xs font-semibold text-slate-650 leading-relaxed mb-4">
                  {activeBlock.explanation.text}
                </p>

                {/* Wel / Niet Examples lists */}
                {activeBlock.explanation.examples && (
                  <div className="space-y-4 border-t border-slate-150 pt-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-red-500 tracking-wider flex items-center gap-1">
                        ❌ NIET TOEGESTAAN:
                      </span>
                      <ul className="list-disc pl-4 text-[10px] font-semibold text-slate-600 space-y-1">
                        {activeBlock.explanation.examples.notAllowed.map((ex, idx) => (
                          <li key={idx}>{ex}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1">
                        🟢 WEL TOEGESTAAN:
                      </span>
                      <ul className="list-disc pl-4 text-[10px] font-semibold text-slate-600 space-y-1">
                        {activeBlock.explanation.examples.allowed.map((ex, idx) => (
                          <li key={idx}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] font-bold text-slate-400">
                  Tip: klik op een ander checklist-blok om de bijbehorende uitleg te laden.
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* History / Dashboard View */
          <div className="bg-white border-width-app border-color-app p-8 rounded-app-card shadow-app space-y-6">
            <div className="border-b-2 border-slate-200 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                Intake Dossier Geschiedenis
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                Overzicht van opgeslagen intakes via dit werkstation
              </p>
            </div>

            {savedChecklists.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold text-sm">Nog geen opgeslagen checklists gevonden.</p>
                <p className="text-slate-400 text-xs mt-1">Start een nieuwe intake en klik op 'Opslaan'.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-800">
                        <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-500">Datum</th>
                        <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-500">Projectnaam</th>
                        <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-500">Uitdager</th>
                        <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                        <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Acties</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedChecklists.map(item => (
                        <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="py-3.5 px-4 text-xs font-bold text-slate-700">{item.date}</td>
                          <td className="py-3.5 px-4 text-sm font-black text-slate-900">{item.projectName}</td>
                          <td className="py-3.5 px-4 text-xs font-bold text-slate-700">{item.challengerName || 'N.v.t.'}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border border-slate-800 ${
                              item.status === 'Geschikt' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button 
                              onClick={() => loadChecklist(item)}
                              className="bg-white hover:bg-slate-100 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
                            >
                              Openen
                            </button>
                            <button 
                              onClick={() => handlePrintItem(item)}
                              className="bg-slate-100 hover:bg-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="block md:hidden space-y-4">
                  {savedChecklists.map(item => (
                    <div key={item.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold">{item.date}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border border-slate-800 ${
                          item.status === 'Geschikt' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-base font-black text-slate-900">{item.projectName}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Uitdager: <span className="font-bold text-slate-700">{item.challengerName || 'N.v.t.'}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => loadChecklist(item)}
                            className="bg-white hover:bg-slate-100 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
                          >
                            Openen
                          </button>
                          <button 
                            onClick={() => handlePrintItem(item)}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer copyright="© 2026 Fokus FysiekFabriek. Alle rechten voorbehouden." theme={theme} onChangeTheme={handleChangeTheme} />

      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-800 p-8 rounded-app-card shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] max-w-sm w-full text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-slate-800 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase">Checklist Opgeslagen</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                De intake checklist voor <span className="font-bold text-slate-700">"{projectName}"</span> is succesvol bewaard in de geschiedenis.
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#F26522] hover:bg-orange-600 border-2 border-slate-800 text-white font-bold text-xs uppercase py-3 rounded-xl tracking-wider shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] transition-all cursor-pointer"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
