import React, { useState, useEffect } from 'react';
import { 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  Plus, 
  ClipboardList, 
  Heart, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Layers, 
  Cpu, 
  ShieldAlert, 
  RotateCw, 
  Printer, 
  Home, 
  Info, 
  ArrowRight,
  Ban,
  Eye
} from 'lucide-react';

interface Question {
  id: number;
  phase: number;
  category: string;
  headerColor: string;
  phaseName: string;
  title: string;
  questionText: string;
  description: string;
  icon: React.ComponentType<any>;
  expectedAnswer: boolean;
  failTitle: string;
  failMessage: string;
  failReason: string;
  hasExamples?: boolean;
  examplesRed?: string[];
  examplesGreen?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    phase: 1,
    category: "De uitdager",
    headerColor: "bg-[#F6D55C]", // Yellow
    phaseName: "Fase 1: De Uitdager & De Uitdaging",
    title: "Fysieke beperking",
    questionText: "Heeft de uitdager een fysieke beperking?",
    description: "FysiekFabriek richt zich specifiek op mensen met een fysieke uitdaging.",
    icon: User,
    expectedAnswer: true,
    failTitle: "Doelgroep sluit niet aan",
    failMessage: "Je kunt geen uitdaging inbrengen bij FysiekFabriek.",
    failReason: "FysiekFabriek is uitsluitend bedoeld voor mensen met een fysieke beperking."
  },
  {
    id: 2,
    phase: 1,
    category: "De uitdager",
    headerColor: "bg-[#F6D55C]", // Yellow
    phaseName: "Fase 1: De Uitdager & De Uitdaging",
    title: "Meerderjarig",
    questionText: "Is de uitdager meerderjarig (18+)?",
    description: "Onze makers en processen zijn ontworpen om samen te werken met volwassen deelnemers.",
    icon: ShieldAlert,
    expectedAnswer: true,
    failTitle: "Leeftijd sluit niet aan",
    failMessage: "Je kunt geen uitdaging inbrengen bij FysiekFabriek.",
    failReason: "FysiekFabriek richt zich momenteel uitsluitend op uitdagingen van meerderjarige personen."
  },
  {
    id: 3,
    phase: 1,
    category: "De uitdager",
    headerColor: "bg-[#F6D55C]", // Yellow
    phaseName: "Fase 1: De Uitdager & De Uitdaging",
    title: "Handelingsbekwaam & Eigen regie",
    questionText: "Is de uitdager handelingsbekwaam en kan deze eigen regie voeren en keuzes maken?",
    description: "De uitdager moet in staat zijn eigen keuzes te maken en daarvoor verantwoordelijkheid te dragen.",
    icon: Activity,
    expectedAnswer: true,
    failTitle: "Regievoering sluit niet aan",
    failMessage: "Je kunt geen uitdaging inbrengen bij FysiekFabriek.",
    failReason: "FysiekFabriek is voor mensen om met eigen regie over het eigen leven een oplossing te vinden. De uitdager moet keuzes kunnen maken en verantwoordelijkheid kunnen dragen."
  },
  {
    id: 4,
    phase: 1,
    category: "De uitdaging",
    headerColor: "bg-[#D0D6DC]", // Grey
    phaseName: "Fase 1: De Uitdager & De Uitdaging",
    title: "Over het eigen leven",
    questionText: "Gaat de uitdaging over het eigen leven van de uitdager?",
    description: "Er worden bij FysiekFabriek alleen oplossingen gezocht voor één specifieke persoon. De oplossing is altijd maatwerk: Design-for-one.",
    icon: Heart,
    expectedAnswer: true,
    failTitle: "De uitdaging past niet bij FysiekFabriek",
    failMessage: "De uitdaging past niet bij FysiekFabriek.",
    failReason: "Er worden bij FysiekFabriek uitsluitend maatwerkoplossingen ontworpen voor de specifieke uitdager zelf (Design-for-one)."
  },
  {
    id: 5,
    phase: 1,
    category: "De uitdaging",
    headerColor: "bg-[#D0D6DC]", // Grey
    phaseName: "Fase 1: De Uitdager & De Uitdaging",
    title: "Gewone dagelijkse activiteit",
    questionText: "Is de uitdaging bedoeld om een gewone dagelijkse activiteit mogelijk of makkelijker te maken?",
    description: "Er worden alleen voorwerpen gemaakt die uitsluitend een ergonomisch, recreatief of huishoudelijk comfortdoel dienen en geen medische of compenserende claim hebben.",
    icon: Home,
    expectedAnswer: true,
    failTitle: "De uitdaging dient geen comfortdoel",
    failMessage: "De uitdaging past niet bij FysiekFabriek.",
    failReason: "Voorwerpen moeten uitsluitend een ergonomisch, recreatief of huishoudelijk comfortdoel dienen en geen medische of compenserende claim hebben."
  },
  {
    id: 6,
    phase: 1,
    category: "De uitdager",
    headerColor: "bg-[#F8C899]", // Peach
    phaseName: "Fase 1: De Uitdager & De Uitdaging",
    title: "Lichaamsmogelijkheden",
    questionText: "Weet de uitdager wat diens lichaam kan en aankan en is er sprake van een stabiele situatie?",
    description: "Het is belangrijk dat er sprake is van een stabiele situatie. FysiekFabriek is geen zorg en kan hierin niet adviseren.",
    icon: Info,
    expectedAnswer: true,
    failTitle: "Instabiele medische situatie of onvoldoende lichaamskennis",
    failMessage: "Dit past helaas niet binnen de kaders van FysiekFabriek.",
    failReason: "Het is noodzakelijk dat de uitdager zelf goed weet wat die wel en niet kan en wat goed is voor diens lijf. FysiekFabriek is geen zorg."
  },
  {
    id: 7,
    phase: 1,
    category: "De uitdager",
    headerColor: "bg-[#F8C899]", // Peach
    phaseName: "Fase 1: De Uitdager & De Uitdaging",
    title: "Bestaande hulp & advies",
    questionText: "Heeft de uitdager bestaande oplossingen geprobeerd en hierbij hulp/advies gehad (bijv. van een ergotherapeut)?",
    description: "FysiekFabriek is bedoeld voor uitdagingen waarvoor geen bestaande oplossing of gangbaar hulpmiddel beschikbaar is.",
    icon: ClipboardList,
    expectedAnswer: true,
    failTitle: "Eerst reguliere wegen bewandelen",
    failMessage: "De vraag past momenteel niet bij FysiekFabriek.",
    failReason: "FysiekFabriek maakt wat er nog niet is. Kijk eerst goed naar bestaande hulpmiddelen of ga bijvoorbeeld langs bij een ergotherapeut."
  },
  {
    id: 8,
    phase: 2,
    category: "Wat kan niet",
    headerColor: "bg-[#F3A3A3]", // Pink
    phaseName: "Fase 2: Wat Kan Niet (Uitsluitingscriteria)",
    title: "Vitale functies",
    questionText: "Zoek je een oplossing voor problemen met vitale functies?",
    description: "Denk aan ademhaling, actieve voeding via sonde, medicatietoediening zoals microlax, of actieve medische bewakingssystemen.",
    icon: Activity,
    expectedAnswer: false,
    hasExamples: true,
    examplesRed: ["beugel beademingsslang", "sondevloeistof-regelaar", "gemotoriseerde microlax-tangen"],
    examplesGreen: ["bekerhouder", "smartphone-statief", "ergonomische bestekgreep", "extra grip handmatige huiskraan"],
    failTitle: "Oplossing omvat vitale functies",
    failMessage: "De oplossing kan niet bij FysiekFabriek gemaakt worden.",
    failReason: "FysiekFabriek ontwerpt geen oplossingen voor vitale levensfuncties of medische bewakingssystemen vanwege veiligheidsvoorschriften."
  },
  {
    id: 9,
    phase: 2,
    category: "Wat kan niet",
    headerColor: "bg-[#F3A3A3]", // Pink
    phaseName: "Fase 2: Wat Kan Niet (Uitsluitingscriteria)",
    title: "Lichaamsgewicht dragen",
    questionText: "Zoek je een oplossing die het volledige lichaamsgewicht moet dragen?",
    description: "Wij maken geen gecertificeerde liftsystemen of dragende constructies, maar comfortondersteuning is wel mogelijk.",
    icon: Layers,
    expectedAnswer: false,
    hasExamples: true,
    examplesRed: ["Tilliften", "sta-op-hulp beugels", "mechanische remverlenger"],
    examplesGreen: ["zachte opvulling voor armsteun", "bekerclip op een tafelblad", "lichte penhouder"],
    failTitle: "Oplossing draagt volledig lichaamsgewicht",
    failMessage: "De oplossing kan niet bij FysiekFabriek gemaakt worden.",
    failReason: "Voorwerpen die het volledige lichaamsgewicht dragen, mogen wegens strenge certificerings- en veiligheidseisen niet gemaakt worden."
  },
  {
    id: 10,
    phase: 2,
    category: "Wat kan niet",
    headerColor: "bg-[#F3A3A3]", // Pink
    phaseName: "Fase 2: Wat Kan Niet (Uitsluitingscriteria)",
    title: "Software & Actieve elektronica",
    questionText: "Bevat de oplossing software, apps of actieve elektronische componenten?",
    description: "Denk aan microcontrollers, Bluetooth-apps of componenten die op zware accu's of netstroom werken.",
    icon: Cpu,
    expectedAnswer: false,
    hasExamples: true,
    examplesRed: ["bluetooth-app dat via relaiskastje verlichting regelt", "verwarmd kussen dat op accu's werkt"],
    examplesGreen: ["volledig mechanische drukknopvergroter", "mechanische schuifhendel"],
    failTitle: "Software of actieve elektronica gedetecteerd",
    failMessage: "De oplossing kan niet bij FysiekFabriek gemaakt worden.",
    failReason: "FysiekFabriek richt zich uitsluitend op mechanische, ergonomische en passieve hulpmiddelen."
  },
  {
    id: 11,
    phase: 2,
    category: "Let op: bestaande hulpmiddelen",
    headerColor: "bg-[#E3BA9E]", // Brown
    phaseName: "Fase 2: Wat Kan Niet (Uitsluitingscriteria)",
    title: "Bestaand hulpmiddel aanpassen",
    questionText: "Wil je een bestaand gecertificeerd hulpmiddel aanpassen door middel van boren, zagen of lassen?",
    description: "Bestaande hulpmiddelen worden niet constructief aangepast om garantie en CE-keuringen te behouden.",
    icon: FileText,
    expectedAnswer: false,
    hasExamples: true,
    examplesRed: ["Boren, zagen, lassen etc. aan/in een rolstoel of ander hulpmiddel"],
    examplesGreen: ["Voorwerp met een schroefloze klemverbinding bevestigen (bijv. tassenhaak of bekerhouder)"],
    failTitle: "Modificatie bestaand hulpmiddel gedetecteerd",
    failMessage: "De oplossing kan niet bij FysiekFabriek gemaakt worden.",
    failReason: "Er mag NOOIT geboord, gezaagd of gelast worden aan of in gecertificeerde rolstoelen of andere fabrieksmatige hulpmiddelen."
  }
];

export default function ProjectIntakeScan() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    targetUser: "",
    description: ""
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [formError, setFormError] = useState("");

  // Laad geschiedenis uit localStorage
  useEffect(() => {
    const localData = localStorage.getItem('project_intake_scan_history');
    if (localData) {
      try {
        setSavedProjects(JSON.parse(localData));
      } catch (e) {
        console.error("Fout bij laden van projecten", e);
      }
    }
  }, []);

  const saveProjectsToLocalStorage = (updatedList: any[]) => {
    setSavedProjects(updatedList);
    localStorage.setItem('project_intake_scan_history', JSON.stringify(updatedList));
  };

  const handleStartNew = () => {
    setProjectInfo({ title: "", targetUser: "", description: "" });
    setAnswers({});
    setCurrentQuestionIndex(0);
    setFormError("");
    setCurrentView('setup');
  };

  const handleStartWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectInfo.title.trim()) {
      setFormError("Vul a.u.b. een titel in voor deze uitdaging.");
      return;
    }
    if (!projectInfo.targetUser.trim()) {
      setFormError("Voor wie is de oplossing bedoeld?");
      return;
    }
    if (!projectInfo.description.trim()) {
      setFormError("Geef een beknopte omschrijving van de gewenste oplossing.");
      return;
    }
    setFormError("");
    setCurrentView('wizard');
  };

  const handleAnswer = (answerValue: boolean) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    if (!currentQuestion) return;

    const updatedAnswers = { ...answers, [currentQuestion.id]: answerValue };
    setAnswers(updatedAnswers);

    const isFailed = answerValue !== currentQuestion.expectedAnswer;

    if (isFailed) {
      const newResult = {
        id: Date.now(),
        date: new Date().toLocaleDateString('nl-NL'),
        project: projectInfo,
        answers: updatedAnswers,
        status: 'failed',
        failedAtQuestion: currentQuestion
      };
      const updatedList = [newResult, ...savedProjects];
      saveProjectsToLocalStorage(updatedList);
      setCurrentView('result');
    } else {
      if (currentQuestionIndex === QUESTIONS.length - 1) {
        const newResult = {
          id: Date.now(),
          date: new Date().toLocaleDateString('nl-NL'),
          project: projectInfo,
          answers: updatedAnswers,
          status: 'success',
          failedAtQuestion: null
        };
        const updatedList = [newResult, ...savedProjects];
        saveProjectsToLocalStorage(updatedList);
        setCurrentView('result');
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setCurrentView('setup');
    }
  };

  const handleGoBackToQuestion = (questionId: number) => {
    const qIndex = QUESTIONS.findIndex(q => q.id === questionId);
    if (qIndex !== -1) {
      setCurrentQuestionIndex(qIndex);
      setCurrentView('wizard');

      const cleanedAnswers: Record<number, boolean> = {};
      QUESTIONS.forEach(q => {
        if (q.id < questionId && answers[q.id] !== undefined) {
          cleanedAnswers[q.id] = answers[q.id];
        }
      });
      setAnswers(cleanedAnswers);

      if (savedProjects.length > 0) {
        const updatedList = savedProjects.slice(1);
        saveProjectsToLocalStorage(updatedList);
      }
    }
  };

  const handleDeleteProject = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedProjects.filter(p => p.id !== id);
    saveProjectsToLocalStorage(filtered);
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  const activeQuestion = QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round((currentQuestionIndex / QUESTIONS.length) * 100);
  const currentResult = savedProjects[0] || null;

  const isYellowHeaderChecked = answers[1] === true && answers[2] === true && answers[3] === true;
  const isGreyHeaderChecked = answers[4] === true && answers[5] === true;
  const isPeachHeaderChecked = answers[6] === true && answers[7] === true;
  const isPinkHeaderChecked = answers[8] === false && answers[9] === false && answers[10] === false;
  const isBrownHeaderChecked = answers[11] === false;

  return (
    <div className="min-h-screen bg-amber-50/20 text-slate-900 font-sans flex flex-col selection:bg-orange-100 print:bg-white print:text-black">
      
      <style>{`
        @media print {
          body, html {
            background-color: white !important;
            color: black !important;
          }
          header, footer, .print-hidden, button, .print-hide {
            display: none !important;
          }
          .print-full-layout {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Brand Header */}
      <header className="bg-white border-b-4 border-slate-800 sticky top-0 z-40 print:hidden shadow-[0_4px_0px_0px_rgba(30,41,59,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="bg-slate-900 text-white p-3 border-2 border-slate-900 rounded-2xl flex items-center justify-center transform rotate-[-2deg] shadow-[2px_2px_0px_0px_rgba(242,101,34,1)]">
              <span className="font-extrabold text-lg tracking-wider">FF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Fokus</span>
              <span className="font-black text-2xl tracking-tight text-slate-900 uppercase">
                Fysiek<span className="text-[#F26522]">Fabriek</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="/"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] text-slate-800 flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Naar Home Portal</span>
            </a>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 border-2 border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] ${currentView === 'dashboard' ? 'text-white bg-slate-900' : 'text-slate-800 bg-white'}`}
            >
              Geschiedenis
            </button>
            <button 
              onClick={handleStartNew}
              className="bg-[#F26522] hover:bg-orange-600 border-2 border-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nieuwe Intake</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
        
        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto w-full">
            
            {/* Welkomst hero card */}
            <div className="border-4 border-slate-800 bg-white p-8 sm:p-12 text-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] space-y-6 relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
              <div className="border-b-4 border-slate-800 pb-6">
                <span className="text-xs font-black uppercase tracking-widest text-[#F26522]">Welkom Bij Fokus FysiekFabriek</span>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase mt-1 leading-none text-slate-900">
                  Checklist uitdagingen
                </h1>
                <p className="text-lg font-bold text-slate-500 mt-2">Toetsing & intake-verificatie voor maatwerk hulpmiddelen.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <p className="text-slate-700 text-sm leading-relaxed font-semibold">
                  Dit interactieve controlepaneel helpt je bij het toetsen en vastleggen van een specifieke hulpvraag. Doorloop de 11 criteria om direct uitsluitsel te krijgen of de uitdaging aansluit bij de kaders van de FysiekFabriek.
                </p>
                <div className="bg-[#C4BDF3]/20 border-2 border-dashed border-[#C4BDF3] rounded-2xl p-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-[#4C4973]">Snelle Richtlijn:</h4>
                    <p className="text-xs text-slate-600 font-medium">We maken uitsluitend mechanische, passieve oplossingen die ergonomisch comfort bieden en geen vitale of dragende functies overnemen.</p>
                  </div>
                  <button 
                    onClick={handleStartNew}
                    className="mt-4 bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 text-white font-bold uppercase tracking-wider text-xs py-3.5 px-6 rounded-xl transition-all shadow-[3px_3px_0px_0px_rgba(242,101,34,1)] flex items-center justify-center space-x-2"
                  >
                    <span>Start de Checklist</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* List of previously tested challenges */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-4 border-slate-800 pb-2">
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-700 flex items-center space-x-2">
                  <ClipboardList className="w-5 h-5 text-[#F26522]" />
                  <span>Beoordeelde Uitdagingen</span>
                </h2>
                <span className="text-xs font-black uppercase tracking-wider text-white bg-slate-900 border-2 border-slate-900 px-3 py-1 rounded-full">
                  {savedProjects.length} dossiers
                </span>
              </div>

              {savedProjects.length === 0 ? (
                <div className="bg-white border-4 border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
                  <ClipboardList className="w-12 h-12 mx-auto text-slate-300" />
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">Geen dossiers gevonden</p>
                    <p className="text-xs text-slate-500 font-medium">Er zijn nog geen beoordeelde intakes opgeslagen op dit apparaat.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedProjects.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        const filtered = savedProjects.filter(item => item.id !== p.id);
                        setSavedProjects([p, ...filtered]);
                        setProjectInfo(p.project);
                        setAnswers(p.answers);
                        setCurrentView('result');
                      }}
                      className="bg-white border-2 border-slate-800 p-6 rounded-2xl hover:shadow-[4px_4px_0px_0px_rgba(242,101,34,1)] shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex flex-col justify-between relative group"
                    >
                      <button 
                        onClick={(e) => handleDeleteProject(p.id, e)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Verwijder dossier"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{p.date}</span>
                          {p.status === 'success' ? (
                            <span className="bg-emerald-100 border-2 border-slate-800 text-emerald-800 text-[10px] font-black uppercase px-3 py-1 rounded-full">Geschikt</span>
                          ) : (
                            <span className="bg-rose-100 border-2 border-slate-800 text-rose-800 text-[10px] font-black uppercase px-3 py-1 rounded-full">Uitsluiting</span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-extrabold text-lg uppercase tracking-tight text-slate-900 group-hover:text-[#F26522] transition-colors">{p.project.title}</h3>
                          <p className="text-xs text-slate-500 font-bold mt-0.5">Deelnemer: {p.project.targetUser}</p>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2 font-semibold leading-relaxed">{p.project.description}</p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t-2 border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                        <span>Checklist voltooid</span>
                        <span className="text-slate-900 font-black uppercase hover:underline flex items-center space-x-1">
                          <span>Inzien</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: SETUP PROJECTPASPOORT */}
        {currentView === 'setup' && (
          <div className="max-w-xl mx-auto w-full bg-white border-4 border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] animate-fadeIn">
            <div className="border-b-4 border-slate-800 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#F26522]">Dossieraanmaak</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mt-1">Projectpaspoort</h2>
              <p className="text-xs text-slate-500 font-bold mt-1">Leg de basisgegevens vast om de checklist te starten.</p>
            </div>

            <form onSubmit={handleStartWizard} className="space-y-6">
              {formError && (
                <div className="border-2 border-rose-800 bg-rose-50 text-rose-900 p-4 text-xs font-bold flex items-start space-x-2 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600" htmlFor="title">
                  Titel van de uitdaging
                </label>
                <input 
                  type="text"
                  id="title"
                  placeholder="Bijv. Rolstoel-bekerhouder of Klembare schildersezel"
                  value={projectInfo.title}
                  onChange={(e) => setProjectInfo({ ...projectInfo, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-800 rounded-xl focus:border-[#F26522] outline-none text-sm transition-colors shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600" htmlFor="targetUser">
                  Wie is de uitdager?
                </label>
                <input 
                  type="text"
                  id="targetUser"
                  placeholder="Bijv. Mijzelf of Sophie"
                  value={projectInfo.targetUser}
                  onChange={(e) => setProjectInfo({ ...projectInfo, targetUser: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-800 rounded-xl focus:border-[#F26522] outline-none text-sm transition-colors shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600" htmlFor="description">
                  Omschrijving van het vraagstuk
                </label>
                <textarea 
                  id="description"
                  rows={3}
                  placeholder="Wat is er precies nodig en welke dagelijkse handeling moet hiermee worden vergemakkelijkt?"
                  value={projectInfo.description}
                  onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-800 rounded-xl focus:border-[#F26522] outline-none text-sm transition-colors shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]"
                />
              </div>

              <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-center">
                <button 
                  type="button"
                  onClick={() => setCurrentView('dashboard')}
                  className="text-slate-500 hover:text-slate-900 text-xs font-black uppercase tracking-wider py-2 px-4 rounded-lg"
                >
                  Annuleren
                </button>
                <button 
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(242,101,34,1)] flex items-center space-x-1.5"
                >
                  <span>Start de Toetsing</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW: INTERACTIVE WIZARD CARD */}
        {currentView === 'wizard' && activeQuestion && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn max-w-6xl mx-auto w-full">
            
            {/* Left 2 Columns: Wizard Card */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Progress Stepper Box */}
              <div className="bg-white border-2 border-slate-800 rounded-2xl p-6 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {activeQuestion.phaseName}
                  </span>
                  <h3 className="font-black text-slate-900 text-sm uppercase mt-0.5">Vraag {currentQuestionIndex + 1} van {QUESTIONS.length}</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Voortgang</span>
                    <span className="font-extrabold text-xs text-slate-900">{progressPercent}%</span>
                  </div>
                  <div className="w-20 h-2 bg-slate-100 border border-slate-300 rounded-full overflow-hidden">
                     <div className="bg-slate-950 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Main Question Card */}
              <div className="bg-white border-4 border-slate-800 rounded-3xl shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] min-h-[380px] flex flex-col justify-between overflow-hidden">
                
                {/* Header segment representing colored category */}
                <div className={`${activeQuestion.headerColor || 'bg-slate-200'} border-b-4 border-slate-800 px-8 py-4 flex items-center justify-between`}>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    {activeQuestion.category}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 bg-white border-2 border-slate-800 px-2 py-0.5 rounded-lg">
                    Stap {activeQuestion.id}
                  </span>
                </div>

                <div className="p-8 sm:p-10 space-y-6 flex-1">
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                      {activeQuestion.questionText}
                    </h2>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-2xl">
                      {activeQuestion.description}
                    </p>
                  </div>

                  {/* Rendering explicit Red/Green examples if present */}
                  {activeQuestion.hasExamples && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-slate-100">
                      
                      {/* RED: EXCLUSIONS */}
                      <div className="border-2 border-slate-800 rounded-xl p-4 space-y-2 bg-rose-50/50">
                        <div className="flex items-center space-x-1.5 text-xs font-black uppercase text-rose-800">
                          <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>NOOIT / NIET:</span>
                        </div>
                        <ul className="space-y-1">
                          {activeQuestion.examplesRed?.map((ex, i) => (
                            <li key={i} className="text-[11px] font-bold text-rose-950 flex items-start space-x-1">
                              <span>•</span>
                              <span className="first-letter:uppercase">{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* GREEN: INCLUSIONS */}
                      <div className="border-2 border-slate-800 rounded-xl p-4 space-y-2 bg-emerald-50/50">
                        <div className="flex items-center space-x-1.5 text-xs font-black uppercase text-emerald-800">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>WEL / TOEGESTAAN:</span>
                        </div>
                        <ul className="space-y-1">
                          {activeQuestion.examplesGreen?.map((ex, i) => (
                            <li key={i} className="text-[11px] font-bold text-emerald-950 flex items-start space-x-1">
                              <span>•</span>
                              <span className="first-letter:uppercase">{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  )}

                  {/* Vraag 6 Specific Choice Context */}
                  {activeQuestion.id === 6 && (
                    <div className="bg-amber-50/50 border-2 border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                      <p className="font-black uppercase text-slate-900 flex items-center space-x-1">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        <span>Keuzerichtlijn Formulering:</span>
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                        De uitdager moet voldoende inzicht en stabiele controle over diens lichaam hebben. 
                        <strong> FysiekFabriek is geen zorg.</strong>
                      </p>
                    </div>
                  )}

                </div>

                {/* Yes/No Interaction Bar */}
                <div className="bg-slate-50 p-6 border-t-4 border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <button 
                    onClick={handlePrev}
                    className="order-3 sm:order-1 inline-flex items-center justify-center space-x-1 text-slate-500 hover:text-slate-900 text-xs font-black uppercase tracking-wider"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Terug</span>
                  </button>

                  <div className="order-1 sm:order-2 flex gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => handleAnswer(false)}
                      className="flex-1 sm:flex-initial px-8 py-3.5 border-2 border-slate-800 bg-white hover:bg-rose-50 text-slate-900 font-black uppercase text-xs tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)]"
                    >
                      Nee
                    </button>
                    <button 
                      onClick={() => handleAnswer(true)}
                      className="flex-1 sm:flex-initial px-8 py-3.5 border-2 border-slate-800 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(242,101,34,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(242,101,34,1)]"
                    >
                      Ja
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Live Visual Checklist Preview */}
            <div className="space-y-4">
              <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
                <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Checklist Uitdagingen</span>
                  <Eye className="w-4 h-4 text-slate-500" />
                </div>

                <div className="space-y-4 text-xs font-bold text-slate-900">
                  
                  {/* Card 1 Yellow */}
                  <div className="border-2 border-slate-800 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                    <div className="bg-[#F6D55C] px-3 py-1.5 border-b-2 border-slate-800 flex justify-between items-center">
                      <span className="font-black text-[10px] uppercase text-slate-950">De uitdager</span>
                      <div className={`w-5 h-5 border-2 border-slate-800 rounded flex items-center justify-center transition-all duration-200 ${
                        isYellowHeaderChecked ? 'bg-slate-900 border-slate-900' : 'bg-white'
                      }`}>
                        {isYellowHeaderChecked && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3] animate-scaleIn" />
                        )}
                      </div>
                    </div>
                    <ul className="p-2.5 space-y-2 text-[10px] font-bold">
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[1] === true ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 0 ? 'text-slate-900 font-black animate-pulse bg-amber-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[1] === true ? '✓' : '•'}</span>
                        <span>heeft een fysieke beperking</span>
                      </li>
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[2] === true ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 1 ? 'text-slate-900 font-black animate-pulse bg-amber-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[2] === true ? '✓' : '•'}</span>
                        <span>is meerderjarig</span>
                      </li>
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[3] === true ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 2 ? 'text-slate-900 font-black animate-pulse bg-amber-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[3] === true ? '✓' : '•'}</span>
                        <span>en handelingsbekwaam: kan eigen regie voeren, keuzes maken</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 2 Grey */}
                  <div className="border-2 border-slate-800 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                    <div className="bg-[#D0D6DC] px-3 py-1.5 border-b-2 border-slate-800 flex justify-between items-center">
                      <span className="font-black text-[10px] uppercase text-slate-950">De uitdaging</span>
                      <div className={`w-5 h-5 border-2 border-slate-800 rounded flex items-center justify-center transition-all duration-200 ${
                        isGreyHeaderChecked ? 'bg-slate-900 border-slate-900' : 'bg-white'
                      }`}>
                        {isGreyHeaderChecked && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3] animate-scaleIn" />
                        )}
                      </div>
                    </div>
                    <ul className="p-2.5 space-y-2 text-[10px] font-bold">
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[4] === true ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 3 ? 'text-slate-900 font-black animate-pulse bg-slate-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[4] === true ? '✓' : '•'}</span>
                        <span>gaat over het eigen leven</span>
                      </li>
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[5] === true ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 4 ? 'text-slate-900 font-black animate-pulse bg-slate-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[5] === true ? '✓' : '•'}</span>
                        <span>om een gewone dagelijkse activiteit mogelijk of makkelijker te maken</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 3 Peach */}
                  <div className="border-2 border-slate-800 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                    <div className="bg-[#F8C899] px-3 py-1.5 border-b-2 border-slate-800 flex justify-between items-center">
                      <span className="font-black text-[10px] uppercase text-slate-950">De uitdager</span>
                      <div className={`w-5 h-5 border-2 border-slate-800 rounded flex items-center justify-center transition-all duration-200 ${
                        isPeachHeaderChecked ? 'bg-slate-900 border-slate-900' : 'bg-white'
                      }`}>
                        {isPeachHeaderChecked && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3] animate-scaleIn" />
                        )}
                      </div>
                    </div>
                    <ul className="p-2.5 space-y-2 text-[10px] font-bold">
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[6] === true ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 5 ? 'text-slate-900 font-black animate-pulse bg-orange-50/50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[6] === true ? '✓' : '•'}</span>
                        <span>weet wat diens lichaam kan en aankan</span>
                      </li>
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[7] === true ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 6 ? 'text-slate-900 font-black animate-pulse bg-orange-50/50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[7] === true ? '✓' : '•'}</span>
                        <span>heeft bestaande oplossingen geprobeerd en hierbij hulp/advies gehad</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 4 Pink */}
                  <div className="border-2 border-slate-800 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                    <div className="bg-[#F3A3A3] px-3 py-1.5 border-b-2 border-slate-800 flex justify-between items-center">
                      <span className="font-black text-[10px] uppercase text-slate-950">Wat kan niet</span>
                      <div className={`w-5 h-5 border-2 border-slate-800 rounded flex items-center justify-center transition-all duration-200 ${
                        isPinkHeaderChecked ? 'bg-slate-900 border-slate-900' : 'bg-white'
                      }`}>
                        {isPinkHeaderChecked && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3] animate-scaleIn" />
                        )}
                      </div>
                    </div>
                    <ul className="p-2.5 space-y-2 text-[10px] font-bold">
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[8] === false ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 7 ? 'text-slate-900 font-black animate-pulse bg-rose-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[8] === false ? '✓' : '•'}</span>
                        <span>geen problemen met vitale functies</span>
                      </li>
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[9] === false ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 8 ? 'text-slate-900 font-black animate-pulse bg-rose-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[9] === false ? '✓' : '•'}</span>
                        <span>draagt niet het volledige lichaamsgewicht</span>
                      </li>
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[10] === false ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 9 ? 'text-slate-900 font-black animate-pulse bg-rose-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[10] === false ? '✓' : '•'}</span>
                        <span>geen software, apps of actieve elektronica</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 5 Brown */}
                  <div className="border-2 border-slate-800 rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                    <div className="bg-[#E3BA9E] px-3 py-1.5 border-b-2 border-slate-800 flex justify-between items-center">
                      <span className="font-black text-[10px] uppercase text-slate-950">Let op: bestaande</span>
                      <div className={`w-5 h-5 border-2 border-slate-800 rounded flex items-center justify-center transition-all duration-200 ${
                        isBrownHeaderChecked ? 'bg-slate-900 border-slate-900' : 'bg-white'
                      }`}>
                        {isBrownHeaderChecked && (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3] animate-scaleIn" />
                        )}
                      </div>
                    </div>
                    <ul className="p-2.5 space-y-2 text-[10px] font-bold">
                      <li className={`flex items-start space-x-1 transition-all ${
                        answers[11] === false ? 'text-emerald-700 font-semibold' : currentQuestionIndex === 10 ? 'text-slate-900 font-black animate-pulse bg-amber-50 rounded px-1' : 'text-slate-400 font-normal'
                      }`}>
                        <span>{answers[11] === false ? '✓' : '•'}</span>
                        <span>geen constructieve aanpassing (boren, zagen, lassen etc)</span>
                      </li>
                    </ul>
                  </div>

                </div>

                <div className="pt-4 border-t-2 border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">Dossier Context:</span>
                  <span className="text-xs font-black text-slate-800 tracking-tight mt-1 uppercase block truncate">{projectInfo.title}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: RESULT SCREEN */}
        {currentView === 'result' && currentResult && (
          <div className="max-w-4xl mx-auto w-full space-y-6 animate-fadeIn print-full-layout">
            
            {/* Upper Status Ribbon */}
            {currentResult.status === 'success' ? (
              <div className="border-4 border-slate-800 bg-slate-900 text-white p-8 rounded-3xl shadow-[6px_6px_0px_0px_rgba(242,101,34,1)] space-y-2 print:hidden">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statusbeoordeling</span>
                <h2 className="text-3xl font-black uppercase tracking-tight">De uitdaging is geschikt!</h2>
                <p className="text-slate-300 text-xs font-semibold">De ingediende casus past volledig binnen de uitsluitingskaders en richtlijnen van Fokus FysiekFabriek.</p>
              </div>
            ) : (
              <div className="border-4 border-slate-800 bg-white text-slate-900 p-8 rounded-3xl shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] space-y-3 print:hidden">
                <div className="flex items-center space-x-2">
                  <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider border-2 border-slate-900">
                    Uitsluiting
                  </span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">Toetsing niet geslaagd</h2>
                <p className="text-slate-500 text-xs font-semibold">De hulpvraag conflicteert met één of meerdere richtlijnen. Pas de details aan of bekijk de toelichtende adviezen hieronder.</p>
                <div className="pt-2">
                  <button
                    onClick={() => handleGoBackToQuestion(currentResult.failedAtQuestion?.id)}
                    className="inline-flex items-center space-x-1.5 bg-[#F26522] border-2 border-slate-800 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Pas antwoord aan</span>
                  </button>
                </div>
              </div>
            )}

            {/* Official Report Container */}
            <div className="bg-white border-4 border-slate-800 rounded-3xl shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] overflow-hidden print-full-layout">
              
              {/* Checklist Sheet Header */}
              <div className="p-8 sm:p-10 border-b-4 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 print-full-layout">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Fokus FysiekFabriek Dossier</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight mt-1">Checklist Uitdagingen</h3>
                </div>
                <div className="flex items-center space-x-2 print:hidden">
                  <button 
                    onClick={handlePrint}
                    className="border-2 border-slate-800 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] cursor-pointer"
                  >
                    <Printer className="w-4 h-4 inline mr-1" />
                    <span>Opslaan als PDF</span>
                  </button>
                  <button 
                    onClick={handleStartNew}
                    className="bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(242,101,34,1)] cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4 inline mr-1" />
                    <span>Nieuwe Toetsing</span>
                  </button>
                </div>
              </div>

              {/* Dossier Report Body */}
              <div className="p-8 sm:p-10 space-y-8 print-full-layout">
                
                {/* Section A: Passport Data */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-1.5 font-mono">Projectpaspoort</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Titel van de uitdaging</span>
                      <p className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">{currentResult.project.title}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Uitdager / Deelnemer</span>
                      <p className="font-bold text-slate-900 text-sm uppercase tracking-tight">{currentResult.project.targetUser}</p>
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Gewenste Oplossing</span>
                      <p className="text-slate-700 text-xs font-semibold leading-relaxed bg-slate-50 p-4 rounded-xl border-2 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,0.1)] whitespace-pre-wrap">
                        {currentResult.project.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section B: Detail Assessment */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-1.5 font-mono">Toetsingsdetails</h4>
                  
                  {currentResult.status === 'success' ? (
                    <div className="border-2 border-slate-800 rounded-xl bg-slate-50 p-6 space-y-2">
                      <div className="flex items-center space-x-2 text-slate-900 font-black uppercase text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>Project is Toegelaten</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                        De omschrijving en antwoorden voldoen aan alle richtlijnen. Er is geen sprake van modificatie aan bestaande gecertificeerde hulpmiddelen, en er zijn geen softwarematige of zware mechanische uitsluitingsfactoren gedetecteerd.
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-slate-800 rounded-xl p-6 space-y-5 bg-slate-50">
                      <div className="flex items-center space-x-2 text-slate-900 font-black uppercase text-sm">
                        <AlertCircle className="w-5 h-5 text-[#F26522]" />
                        <span>Knelpunt gedetecteerd: {currentResult.failedAtQuestion?.title}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Gedetecteerde afwijking:</span>
                        <p className="text-sm sm:text-base font-black uppercase bg-white border-2 border-slate-800 p-4 rounded-lg shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                          "{currentResult.failedAtQuestion?.failMessage}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Toelichting:</span>
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold bg-white p-4 rounded-lg border-2 border-slate-200">
                          {currentResult.failedAtQuestion?.failReason}
                        </p>
                      </div>

                      <div className="pt-4 border-t-2 border-slate-200 space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-900">Vervolgstappen & Adviezen:</span>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 font-semibold">
                          <li className="flex items-start space-x-2">
                            <span className="text-slate-900 font-bold">•</span>
                            <span>Herdefinieer de uitdaging om binnen een puur comfort- of ergonomisch kader te vallen.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-slate-900 font-bold">•</span>
                            <span>Zoek bij medische of zorggerelateerde vragen contact met een behandelend ergotherapeut.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-slate-900 font-bold">•</span>
                            <span>Zorg dat er geen destructieve handelingen zoals boren of lassen nodig zijn.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section C: Complete checklist visualization */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-1.5 font-mono">Gezamenlijke Checklist Toetsing</h4>
                  
                  <div className="space-y-2">
                    {QUESTIONS.map((q, i) => {
                      const wasAnswered = currentResult?.answers?.[q.id] !== undefined;
                      const answer = currentResult?.answers?.[q.id];
                      const isCorrect = wasAnswered && answer === q.expectedAnswer;
                      const isCurrentFailed = currentResult?.failedAtQuestion?.id === q.id;

                      let indicator = <div className="w-1.5 h-1.5 bg-slate-200" />;
                      let statusText = "Niet bereikt";

                      if (isCorrect) {
                        indicator = <Check className="w-3 h-3 text-emerald-700" />;
                        statusText = "Voldoet";
                      } else if (isCurrentFailed) {
                        indicator = <X className="w-3 h-3 text-rose-700" />;
                        statusText = "Uitsluiting";
                      }

                      const isClickable = statusText === "Voldoet" || statusText === "Uitsluiting";

                      return (
                        <div 
                          key={q.id} 
                          onClick={() => isClickable && handleGoBackToQuestion(q.id)}
                          className={`flex items-center justify-between p-3.5 border-2 rounded-xl text-xs font-bold transition-all ${
                            isClickable 
                              ? 'border-slate-800 text-slate-900 hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]' 
                              : 'border-slate-200 text-slate-400 cursor-default bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] text-slate-400 w-4">{i + 1}.</span>
                            <span className="uppercase tracking-tight">{q.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isClickable && (
                              <span className="text-[9px] text-[#F26522] uppercase font-black hover:underline mr-2 print:hidden">Aanpassen</span>
                            )}
                            <span className="text-[9px] font-black uppercase tracking-wider">{statusText}</span>
                            <div className="w-5 h-5 border-2 border-slate-800 bg-white rounded flex items-center justify-center">
                              {indicator}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Official print timestamp footer */}
              <div className="hidden print:block text-center text-[9px] text-slate-400 p-8 border-t border-slate-100">
                Gegenereerd door Fokus FysiekFabriek Checklisttoets op {currentResult.date}
              </div>

            </div>

            {/* Back to Dashboard Button */}
            <div className="text-center print:hidden">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 mx-auto py-2.5 px-4 rounded-xl border-2 border-transparent hover:border-slate-850 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Terug naar dashboard</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Footer block */}
      <footer className="bg-white border-t-4 border-slate-800 py-6 text-center text-[10px] font-black uppercase tracking-wider text-slate-400 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Fokus FysiekFabriek. Alle rechten voorbehouden.</p>
        </div>
      </footer>

    </div>
  );
}
