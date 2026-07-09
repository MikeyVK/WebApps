import React, { useState, useEffect } from 'react';

interface PresetProject {
  name: string;
  description: string;
  answers: Record<string, string | null>;
}

const PRESET_PROJECTS: PresetProject[] = [
  {
    name: "Aangepaste Spaghetti-lepel",
    description: "Een mechanisch vergrote greep voor een eetlepel zonder medische claim, puur voor ergonomisch comfort tijdens het eten.",
    answers: { q1: 'no', q2: 'no', q3: 'no', q4: 'no', q5: 'yes', q6: 'no', q7: 'optionA', q8: 'optionA' }
  },
  {
    name: "Drempelhulp voor Robothond",
    description: "Een simpele houten oprijplaat in huis zodat een recreatieve speelgoed- of robothond makkelijk over de drempel kan rijden.",
    answers: { q1: 'no', q2: 'no', q3: 'no', q4: 'no', q5: 'yes', q6: 'no', q7: 'optionA', q8: 'optionA' }
  },
  {
    name: "Universele Bekerhouder Rolstoel",
    description: "Een 3D-geprinte bekerhouder die met een klem aan de armleuning van de rolstoel wordt bevestigd, zonder schroeven of boren.",
    answers: { q1: 'no', q2: 'no', q3: 'no', q4: 'no', q5: 'no', q6: 'no', q7: 'optionA', q8: 'optionB' }
  },
  {
    name: "Wasbare Neopreen Armsteun",
    description: "Een op maat gemaakte neopreen hoes voor een armsteun die direct in contact komt met de huid voor meer dan 3 uur per dag.",
    answers: { q1: 'no', q2: 'no', q3: 'no', q4: 'no', q5: 'no', q6: 'yes', q7: 'optionA', q8: 'optionA' }
  },
  {
    name: "Bluetooth Schakelaar App",
    description: "Een mobiele applicatie die via Bluetooth een relaiskastje aanstuurt om de verlichting in de Fokus-woning te regelen.",
    answers: { q1: 'no', q2: 'no', q3: 'no', q4: 'yes', q5: 'no', q6: 'no', q7: 'optionB', q8: 'optionA' }
  },
  {
    name: "Aangepaste Joystick Rolstoel",
    description: "Het modificeren van de printplaat en joystick-besturing van een elektrische rolstoel voor fijnere controle.",
    answers: { q1: 'no', q2: 'no', q3: 'yes', q4: 'no', q5: 'no', q6: 'no', q7: 'optionB', q8: 'optionB' }
  },
  {
    name: "Mechanische Remverlenger",
    description: "Een verlengstuk voor de handrem van de rolstoel dat onder zware handmatige mechanische belasting staat tijdens het remmen.",
    answers: { q1: 'no', q2: 'yes', q3: 'no', q4: 'no', q5: 'no', q6: 'no', q7: 'optionB', q8: 'optionA' }
  }
];

interface FmeaHazard {
  id: number;
  hazard: string;
  severity: string;
  mitigation: string;
}

interface QuestionOption {
  value: string;
  label: string;
  desc: string;
}

interface TriageQuestion {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8';
  title: string;
  text: string;
  description: string;
  type: 'binary' | 'choice';
  icon: React.ReactNode;
  examples?: {
    red: string;
    ok: string;
  };
  options?: QuestionOption[];
}

interface TriageResult {
  status: 'ROOD' | 'GROEN' | 'ORANJE_MATIG' | 'ORANJE_LICHT' | 'IN_BEHANDELING';
  code?: string;
  title?: string;
  message: string;
  reasons?: string[];
}

export default function MaatwerkRisicoScan() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
    q8: null
  });
  
  const [fmeaHazards, setFmeaHazards] = useState<FmeaHazard[]>([
    { id: 1, hazard: 'Scherpe randen na 3D-printen', severity: '2', mitigation: 'Handmatig naschuren en randen afronden in CAD' },
    { id: 2, hazard: 'Losraken door trillingen', severity: '3', mitigation: 'Gebruik van borgmoeren en periodieke controle voorschrijven' }
  ]);
  const [newHazard, setNewHazard] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<string>('2');
  const [newMitigation, setNewMitigation] = useState<string>('');

  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [challengerName, setChallengerName] = useState<string>('');
interface ConfettiParticle {
  id: number;
  top: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
}

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  // Logic om het resultaat realtime of aan het einde te berekenen
  const getTriageResult = (customAnswers?: Record<string, string | null> | null): TriageResult => {
    const activeAnswers = customAnswers || answers;
    
    // Blok 1: Rood Filters (Harde uitsluitingen)
    if (activeAnswers.q1 === 'yes') return { status: 'ROOD', code: 'vital_functions', title: 'Vitale Functies', message: 'Dit project grijpt direct in op vitale fysiologische functies van de uitdager. Dit brengt onaanvaardbaar hoge risico\'s met zich mee voor co-creatie door studenten.' };
    if (activeAnswers.q2 === 'yes') return { status: 'ROOD', code: 'transfers_forces', title: 'Transfers & Lichaamskrachten', message: 'Dit project is onderhevig aan zware mechanische belasting of beïnvloedt actieve patiënttransfers. Bij falen is er direct risico op ernstig fysiek letsel.' };
    if (activeAnswers.q3 === 'yes') return { status: 'ROOD', code: 'hard_modification', title: 'Harde Modificatie', message: 'Dit project omvat een harde constructieve of elektronische ingreep in een bestaand CE-hulpmiddel. Hierdoor vervalt de fabrieksgarantie en verschuift alle aansprakelijkheid.' };
    if (activeAnswers.q4 === 'yes') return { status: 'ROOD', code: 'active_electronics_software', title: 'Actieve Elektronica of Software', message: 'Dit project maakt gebruik van actieve elektronica, een stroomvoorziening of standalone software (apps). Vanwege de complexe MDR-classificatie (Rule 11 voor software) en elektromagnetische compatibiliteit (EMC) is dit niet toegestaan binnen FysiekFabriek.' };

    // Blok 2: Groene Afslag
    if (activeAnswers.q5 === 'yes') {
      return { status: 'GROEN', code: 'comfort_recreation', title: 'Lifehacks, Comfort & Vrijetijd', message: 'Gefeliciteerd! Dit project dient uitsluitend een ergonomisch of vrijetijdsdoel en valt buiten de wetgevingskaders van de MDR.' };
    }

    // Blok 3: Oranje Scenario's (MDR-licht)
    const hasUnansweredOranje = [activeAnswers.q6, activeAnswers.q7, activeAnswers.q8].some(val => val === null);
    if (hasUnansweredOranje && !customAnswers) {
      return { status: 'IN_BEHANDELING', message: 'Bezig met analyseren...' };
    }

    let isModerate = false;
    const reasons: string[] = [];

    if (activeAnswers.q6 === 'yes') {
      isModerate = true;
      reasons.push('Langdurig of drukgeladen direct huidcontact (risico op decubitus/weefselschade).');
    }
    if (activeAnswers.q7 === 'optionB') {
      isModerate = true;
      reasons.push('Bij mechanisch falen verliest de uitdager direct zijn zelfredzaamheid of ontstaat een onveilige situatie.');
    }
    if (activeAnswers.q8 === 'optionB') {
      isModerate = true;
      reasons.push('Het product wordt bevestigd aan een bestaand CE-gemarkeerd hulpmiddel (zachte modificatie). Beoordeling op onbedoelde effecten is vereist.');
    }

    if (isModerate) {
      return { 
        status: 'ORANJE_MATIG', 
        code: 'orange_moderate', 
        reasons,
        message: 'Dit project valt formeel onder de MDR (laag risico) maar heeft specifieke risicofactoren. Co-creatie mag, mits er een digitaal technisch dossier wordt opgesteld en een expert (Michel) het ontwerp fiateert.'
      };
    } else {
      return { 
        status: 'ORANJE_LICHT', 
        code: 'orange_light',
        message: 'Dit project heeft een medische/compenserende insteek met een zeer laag risicoprofiel. Co-creatie is toegestaan onder naleving van de basis-kwaliteitschecklist.'
      };
    }
  };

  const triage = getTriageResult();

  useEffect(() => {
    if (step === 'result' && triage.status === 'GROEN') {
      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899'];
      const particles: ConfettiParticle[] = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3
      }));
      
      const setupTimer = setTimeout(() => {
        setConfettiParticles(particles);
        setShowConfetti(true);
      }, 0);

      const timer = setTimeout(() => {
        setShowConfetti(false);
        setConfettiParticles([]);
      }, 5000);

      return () => {
        clearTimeout(setupTimer);
        clearTimeout(timer);
      };
    }
  }, [step, triage.status]);

  const questions: TriageQuestion[] = [
    {
      id: 'q1',
      title: '1. Vitale Functies',
      text: 'Grijpt het product direct of indirect in op vitale functies?',
      description: 'Denk hierbij aan ademhaling, actieve voeding via sonde, medicatietoediening (bijv. microlax-pompen), of actieve medische bewakingssystemen.',
      type: 'binary',
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      examples: {
        red: "Beugel voor beademingsslang, sondevloeistof-regelaar, gemotoriseerde microlax-tangen of actieve decubitus-matrassen.",
        ok: "Een bekerhouder, smartphone-statief, ergonomische bestekgreep of extra grip op een handmatige huiskraan."
      }
    },
    {
      id: 'q2',
      title: '2. Transfers & Lichaamskrachten',
      text: 'Moet het product het volledige lichaamsgewicht dragen of ondersteunen?',
      description: 'Denk aan hulpmiddelen voor actieve transfers (bijv. tilliften, sta-op-hulpen, mechanische remverlengers, of kritische structurele frame-onderdelen).',
      type: 'binary',
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      examples: {
        red: "Tilliften, sta-op-hulp beugels, kritische structurele frame-onderdelen of een mechanische remverlenger.",
        ok: "Een zachte opvulling voor een armsteun, een bekerclip op een tafelblad of een lichte penhouder."
      }
    },
    {
      id: 'q3',
      title: '3. Modificatie aan Bestaand CE-Hulpmiddel',
      text: 'Gaan jullie een "harde" modificatie uitvoeren aan een bestaand CE-hulpmiddel?',
      description: 'Bijvoorbeeld boren in een rolstoelframe, solderen of splitsen in bestaande kabels, of het fysiek aanpassen van de fabrikant-onderdelen.',
      type: 'binary',
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      examples: {
        red: "Boren in het dragende aluminium frame van een rolstoel, solderen/splitsen in de originele motorkabels.",
        ok: "Een bekerhouder of tassenhaak die met een klemverbinding schroefloos op de armleuning is bevestigd."
      }
    },
    {
      id: 'q4',
      title: '4. Actieve Elektronica & Software',
      text: 'Bevat de aanpassing software, apps, of actieve elektronische componenten?',
      description: 'Denk aan standalone software (zoals besturings-apps of sturingsprogramma\'s), microcontrollers, sensoren, of onderdelen die op stroom (batterij of netstroom) werken. Deze vallen onder zware MDR Rule 11 eisen en EMC-veiligheidsrichtlijnen.',
      type: 'binary',
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9V9z" />
        </svg>
      ),
      examples: {
        red: "Een bluetooth-app die via een relaiskastje de verlichting regelt, een verwarmd kussen op accu's.",
        ok: "Een volledig mechanische drukknopvergroter of een mechanische schuifhendel."
      }
    },
    {
      id: 'q5',
      title: '5. Beoogd Comfort & Vrijetijdsdoel',
      text: 'Is er uitsluitend sprake van een comfort-, recreatie- of ergonomisch doel?',
      description: 'Het hulpmiddel herstelt of compenseert geen fysiologische functie, maar verhoogt het comfort of maakt een hobby mogelijk waarbij falen geen direct letsel of verlies van primaire zelfredzaamheid veroorzaakt. (Bijv. schilderspenseelhouder, Netflix-tabletsteun, drempelhulp voor speelgoed-robothond).',
      type: 'binary',
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      examples: {
        red: "Een kraan-draaihulp (compenseert direct een ADL-beperking voor hygiëne, dus een formeel medisch compensatiedoel).",
        ok: "Een houder voor een schilderskwast, een Netflix-tabletsteun, drempelhulp voor een robothond of speelgoed."
      }
    },
    {
      id: 'q6',
      title: '6. Huidcontact & Druk',
      text: 'Komt het hulpmiddel langdurig of onder mechanische druk in direct contact met de blote huid?',
      description: 'Denk aan direct huidcontact langer dan 2 uur aaneengesloten, of klemverbindingen die constante druk uitoefenen op kwetsbaar weefsel (risico op decubitus/huiddefecten).',
      type: 'binary',
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11M3 11a9 9 0 019-9m0 0a9 9 0 019 9m-9-9v12m0 0a9 9 0 019 9m-9-9m-5.436-5.436l.054-.09A13.916 13.916 0 0112 11" />
        </svg>
      ),
      examples: {
        red: "Een zitschaal inlay, orthese-aanpassing of een armsteunkussen dat meer dan 2 uur continu strak op de blote huid drukt.",
        ok: "Een bestekgreep met een elastisch bandje dat alleen tijdens de maaltijd kortstondig de hand raakt."
      }
    },
    {
      id: 'q7',
      title: '7. Gevolgen van Mechanisch Falen',
      text: 'Wat is het directe gevolg als het product tijdens normaal gebruik plotseline afbreekt of weigert?',
      description: 'Bepaal de ernst van een onverwacht mechanisch of functioneel defect.',
      type: 'choice',
      options: [
        { value: 'optionA', label: 'Optie A: Licht ongemak', desc: 'Hooguit lichte irritatie, morsen of kortstondig ongemak (bijv. gemorst glas drinken of een pen die valt).' },
        { value: 'optionB', label: 'Optie B: Verlies van zelfredzaamheid of veiligheid', desc: 'De uitdager raakt zijn zelfredzaamheid kwyt (kan bijv. de kamer niet zelfstandig verlaten, niet communiceren) of er ontstaat een onveilige situatie tot derden ingrijpen.' }
      ],
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      examples: {
        red: "Een mechanische houder voor een deuropener-knop (als deze breekt, raakt de uitdager opgesloten in de kamer).",
        ok: "Een bekerhouder of een spaghetti-lepel (bij breuk morst alleen wat drinken of eten, geen direct gevaar)."
      }
    },
    {
      id: 'q8',
      title: '8. Bevestiging (Zachte Modificatie)',
      text: 'Wordt het hulpmiddel bevestigd aan een bestaand CE-gemarkeerd basishulpmiddel?',
      description: 'Zachte modificaties worden aan een bestaand product gehangen zonder ingrijpende aanpassingen.',
      type: 'choice',
      options: [
        { value: 'optionA', label: 'Optie A: Volledig losstaand', desc: 'Het is een autonoom, losstaand hulpmiddel (bijv. een aangepaste beker, lepel of vrijetijdstool).' },
        { value: 'optionB', label: 'Optie B: Zachte op- of aanbouw', desc: 'Het wordt mechanisch bevestigd (bijv. geklemd) maar kan zonder gereedschap of schade worden verwijderd en hindert de werking van de rolstoel/tillift niet.' }
      ],
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      examples: {
        red: "Een clip-on werkblad dat over de armleuningen van een rolstoel schuift of een zware laptoptafel.",
        ok: "Een volledig losse ergonomische spaghetti-lepel of een losse bestekgreep."
      }
    }
  ];

  const getCurrentGlow = () => {
    if (step === 'intro') return 'none';
    if (step === 'result') {
      const res = getTriageResult();
      if (res.status === 'ROOD') return 'red';
      if (res.status === 'GROEN') return 'green';
      return 'orange';
    }

    if (answers.q1 === 'yes' || answers.q2 === 'yes' || answers.q3 === 'yes' || answers.q4 === 'yes') {
      return 'red';
    }
    if (answers.q5 === 'yes') {
      return 'green';
    }
    if (currentQ >= 5) {
      return 'orange';
    }
    return 'pulse';
  };

  const handleAnswer = (val: string) => {
    const nextAnswers = { ...answers, [questions[currentQ].id]: val };
    setAnswers(nextAnswers);

    if ((currentQ === 0 || currentQ === 1 || currentQ === 2 || currentQ === 3) && val === 'yes') {
      setStep('result');
      return;
    }
    if (currentQ === 4 && val === 'yes') {
      setStep('result');
      return;
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep('result');
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      setStep('intro');
    }
  };

  const selectPreset = (preset: PresetProject) => {
    setProjectName(preset.name);
    setProjectDescription(preset.description);
    setAnswers(preset.answers);
    setStep('result');
  };

  const startTriage = () => {
    setAnswers({
      q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null
    });
    setCurrentQ(0);
    setStep('quiz');
  };

  const addHazard = () => {
    if (!newHazard || !newMitigation) return;
    setFmeaHazards([
      ...fmeaHazards,
      {
        id: Date.now(),
        hazard: newHazard,
        severity: newSeverity,
        mitigation: newMitigation
      }
    ]);
    setNewHazard('');
    setNewMitigation('');
  };

  const removeHazard = (id: number) => {
    setFmeaHazards(fmeaHazards.filter(h => h.id !== id));
  };

  const copyReportToClipboard = () => {
    const reportText = `
=============================================
FYSIEKFABRIEK TRIAGE-RAPPORT
=============================================
Projectnaam: ${projectName || 'Niet opgegeven'}
Uitdager: ${challengerName || 'Niet opgegeven'}
Beschrijving: ${projectDescription || 'Niet opgegeven'}
Datum: ${new Date().toLocaleDateString('nl-NL')}

TRIAGE RESULTAAT: ${triage.status}
Type Classificatie: ${triage.title || 'MDR Proportioneel'}

Toelichting:
${triage.message}

${triage.reasons ? `Specifieke risicofactoren:\n${triage.reasons.map(r => `- ${r}`).join('\n')}` : ''}

GELIEERDE ACTIES & PROCESBORGING:
${triage.status === 'ROOD' ? `
- !!! OVERDRAGEN AAN GECERTIFICEERD ADAPTATIETECHNICUS !!!
- Studenten mogen niet aan dit project bouwen.
- Neem contact op met Michel Verkaik of een revalidatie-werkplaats.` : ''}

${triage.status === 'ORANJE_MATIG' ? `
- Verplicht opstellen van digitaal mini-technisch dossier.
- Verplichte peer-review & vrijgave door Michel Verkaik.
- Hanteer de FMEA-risicoanalyse.` : ''}

${triage.status === 'ORANJE_LICHT' ? `
- Zelfcontrole aan de hand van de basiseisen-checklist.
- Registreer de gebruikte materialen (traceerbaarheid).` : ''}

${triage.status === 'GROEN' ? `
- Vrije co-creatie door studenten en makers.
- Lever op met een standaard gebruikersinstructie en de FysiekFabriek disclaimer.` : ''}

FMEA-Lite Risicomatrix (voor Oranje projecten):
${fmeaHazards.map(h => `- Risico: ${h.hazard} (Ernst: ${h.severity}/5) -> Oplossing: ${h.mitigation}`).join('\n')}

Gegenereerd met de FysiekFabriek Triage Tool.
=============================================
    `;

    const textArea = document.createElement("textarea");
    textArea.value = reportText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Rapport is gekopieerd naar het klembord!');
    } catch (err) {
      console.error('Kopieerfout: ', err);
    }
    document.body.removeChild(textArea);
  };

  const glowClass = getCurrentGlow();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased">
      {/* Confetti Animation Layer */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              className="absolute w-3 h-3 rounded-sm opacity-80 animate-ping"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                backgroundColor: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 py-5 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">FysiekFabriek</h1>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">MDR Triage & Stoplicht Tool</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="../" className="text-xs font-bold text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1.5 bg-slate-700/40 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Terug naar Home</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        
        {/* Left Column: Interactive Stoplight Visualizer */}
        <div className="lg:col-span-3 flex flex-col items-center justify-start gap-6">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-xl w-full max-w-xs flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Live Stoplicht Status</h3>
            
            {/* The actual physical stoplight case */}
            <div className="w-32 bg-slate-950 rounded-3xl p-5 shadow-inner border border-slate-800 flex flex-col gap-6 items-center relative">
              
              {/* Red Light */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 border-slate-900 transition-all duration-300 ${
                  glowClass === 'red' 
                    ? 'bg-red-500 shadow-[0_0_35px_rgba(239,68,68,0.9)] scale-105 animate-pulse' 
                    : 'bg-red-950/70 opacity-40'
                }`} />
                {glowClass === 'red' && <span className="absolute -inset-2 rounded-full border border-red-400/30 animate-ping pointer-events-none" />}
              </div>

              {/* Orange Light */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 border-slate-900 transition-all duration-300 ${
                  glowClass === 'orange' 
                    ? 'bg-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.9)] scale-105 animate-pulse' 
                    : 'bg-amber-950/70 opacity-40'
                }`} />
                {glowClass === 'orange' && <span className="absolute -inset-2 rounded-full border border-amber-400/30 animate-ping pointer-events-none" />}
              </div>

              {/* Green Light */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 border-slate-900 transition-all duration-300 ${
                  glowClass === 'green' 
                    ? 'bg-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.9)] scale-105 animate-pulse' 
                    : 'bg-emerald-950/70 opacity-40'
                }`} />
                {glowClass === 'green' && <span className="absolute -inset-2 rounded-full border border-emerald-400/30 animate-ping pointer-events-none" />}
              </div>
              
              {/* Gentle pulse light when active but undecided */}
              {glowClass === 'pulse' && (
                <div className="absolute inset-0 bg-blue-500/5 rounded-3xl animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Live Verdict Tag */}
            <div className="mt-6 text-center w-full">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Actueel oordeel</span>
              <div className="inline-block py-1.5 px-4 rounded-full text-sm font-extrabold tracking-wide uppercase shadow-sm">
                {step === 'intro' && <span className="text-slate-400 bg-slate-700/40 py-1 px-3 rounded-full">Standby</span>}
                {step === 'quiz' && (
                  <span className="text-sky-400 bg-sky-950/40 py-1 px-3 rounded-full animate-pulse">Analyseren...</span>
                )}
                {step === 'result' && (
                  <>
                    {triage.status === 'ROOD' && <span className="text-red-400 bg-red-950/40 py-1 px-3 rounded-full">ROOD (Professioneel)</span>}
                    {triage.status === 'GROEN' && <span className="text-emerald-400 bg-emerald-950/40 py-1 px-3 rounded-full font-bold">GROEN (Lifehack)</span>}
                    {triage.status === 'ORANJE_MATIG' && <span className="text-amber-400 bg-amber-950/40 py-1 px-3 rounded-full">ORANJE (Dossier + Review)</span>}
                    {triage.status === 'ORANJE_LICHT' && <span className="text-amber-400 bg-amber-950/40 py-1 px-3 rounded-full">ORANJE (Lichte checklist)</span>}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Informative Info block */}
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-5 shadow-lg w-full max-w-xs text-xs text-slate-400 space-y-3">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-700/60 pb-2">Actieve Software & Elektronica</h4>
            <p><strong>Nieuwe Regelgevende Blokken:</strong> Grijpt een project in op stroomvoorziening, sensoren, printplaten, of standalone apps? Dan verschuift het risicoprofiel direct naar <strong>Rood</strong>.</p>
            <p><strong>Waarom?</strong> Elektromagnetische storingen en softwarefouten (Rule 11) kunnen onverwacht optreden bij medisch kwetsbare gebruikers. Dit valt daarom buiten de studentenformule.</p>
          </div>
        </div>

        {/* Middle Column: Dynamic Wizard Cards / Results Screen */}
        <div className={`${
          step === 'intro' ? 'lg:col-span-9' : 'lg:col-span-6'
        } flex flex-col justify-start`}>
          
          {/* INTRO STEP */}
          {step === 'intro' && (
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 animate-fade-in">
              <div className="space-y-3">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-950/50 px-3 py-1.5 rounded-md">Fase 1: Project Classificatie</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Welkom bij de FysiekFabriek Triage Tool</h2>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Deze interactieve tool helpt studenten, makers en uitdagers om direct te classificeren of een projectveiligheidsrisico past binnen de informele FysiekFabriek formule, of dat het overgedragen moet worden aan een professioneel adaptatietechnicus.
                </p>
              </div>

              {/* Project Context Form */}
              <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Projectgegevens (Optioneel)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Naam van het Project</label>
                    <input 
                      type="text" 
                      placeholder="bijv. Bekerhouder voor Rolstoel" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Naam Uitdager / Cliënt</label>
                    <input 
                      type="text" 
                      placeholder="Naam van de eindgebruiker" 
                      value={challengerName}
                      onChange={(e) => setChallengerName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Beschrijving Uitdaging</label>
                    <textarea 
                      placeholder="Wat is het probleem en wat willen jullie gaan maken?" 
                      rows={2}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Trigger */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={startTriage}
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Start Nieuwe Triage</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {/* Presets Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-700/60">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Snel testen met voorbeeld-projecten</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PRESET_PROJECTS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectPreset(p)}
                      className="text-left bg-slate-900/40 hover:bg-slate-900/80 border border-slate-700/50 rounded-xl p-3.5 transition-all hover:border-slate-600 flex flex-col justify-between group"
                    >
                      <div>
                        <h5 className="font-bold text-xs text-slate-200 group-hover:text-sky-400 transition-colors">{p.name}</h5>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-3.5 flex items-center gap-1 self-start">
                        Laad test-case
                        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE QUIZ WIZARD */}
          {step === 'quiz' && (
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative transition-all duration-300">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>Vraag {currentQ + 1} van {questions.length}</span>
                <span className="text-sky-400 bg-sky-950/50 px-2 py-1 rounded-md">{questions[currentQ].title}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question card */}
              <div className="bg-slate-900/50 border border-slate-700/60 rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-start">
                <div className="bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700 shrink-0">
                  {questions[currentQ].icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-white leading-snug">{questions[currentQ].text}</h3>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">{questions[currentQ].description}</p>
                </div>
              </div>

              {/* Specific Question Examples (Sub-panel) */}
              {questions[currentQ].examples && (
                <div className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <span>💡 Praktijkvoorbeelden ter vergelijking:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 space-y-1">
                      <span className="font-extrabold text-red-400 flex items-center gap-1">
                        <span>🔴</span> Rood (Niet toegestaan)
                      </span>
                      <p className="text-slate-300 leading-relaxed">{questions[currentQ].examples?.red}</p>
                    </div>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 space-y-1">
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                        <span>🟢</span> Toegestaan (FF-Formule)
                      </span>
                      <p className="text-slate-300 leading-relaxed">{questions[currentQ].examples?.ok}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-slate-700/60">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/50 font-bold transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Terug</span>
                </button>

                {/* Answers actions */}
                {questions[currentQ].type === 'binary' ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswer('no')}
                      className="px-8 py-3.5 bg-slate-700 hover:bg-slate-600 text-slate-100 hover:text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95"
                    >
                      Nee
                    </button>
                    <button
                      onClick={() => handleAnswer('yes')}
                      className="px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-red-500/10 active:scale-95"
                    >
                      Ja
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full sm:w-auto">
                    {questions[currentQ].options?.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(opt.value)}
                        className="text-left px-5 py-3.5 bg-slate-700/80 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-100 hover:text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex flex-col"
                      >
                        <span className="text-sm font-extrabold">{opt.label}</span>
                        <span className="text-xs text-slate-300 font-normal mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESULTS SCREEN */}
          {step === 'result' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Main result badge */}
              <div className={`border rounded-3xl p-6 md:p-8 shadow-xl space-y-4 relative overflow-hidden ${
                triage.status === 'ROOD' ? 'bg-red-950/40 border-red-500/50 text-red-100' :
                triage.status === 'GROEN' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100' :
                'bg-amber-950/40 border-amber-500/50 text-amber-100'
              }`}>
                
                {/* Visual Glow Header */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${
                  triage.status === 'ROOD' ? 'bg-red-500' :
                  triage.status === 'GROEN' ? 'bg-emerald-500' :
                  'bg-amber-500'
                }`}></div>

                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl shadow-md ${
                    triage.status === 'ROOD' ? 'bg-red-900/50 border border-red-500' :
                    triage.status === 'GROEN' ? 'bg-emerald-900/50 border border-emerald-500' :
                    'bg-amber-900/50 border border-amber-500'
                  }`}>
                    {triage.status === 'ROOD' && (
                      <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    )}
                    {triage.status === 'GROEN' && (
                      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {(triage.status === 'ORANJE_MATIG' || triage.status === 'ORANJE_LICHT') && (
                      <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Resultaat Triage</span>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">{triage.title || 'MDR Proportioneel'}</h2>
                  </div>
                </div>

                <p className="text-slate-200 text-sm md:text-base leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-700/40">
                  {triage.message}
                </p>

                {/* If orange, display reasons */}
                {triage.reasons && triage.reasons.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gedetecteerde Risicofactoren:</span>
                    <ul className="space-y-1.5">
                      {triage.reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-amber-300 flex items-start gap-2">
                          <span className="text-amber-400 shrink-0">⚠️</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* ACTION PLAN SECTION */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Geadviseerd Actieplan & Procesborging</span>
                </h3>

                {/* ROOD ROUTE PLAN */}
                {triage.status === 'ROOD' && (
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-4 flex gap-4 items-start text-red-300/90">
                      <span className="text-2xl animate-pulse">🛑</span>
                      <div>
                        <h4 className="font-extrabold text-white text-base">Let op: Co-creatie niet toegestaan</h4>
                        <p className="text-xs mt-1">Dit project overschrijdt de veilige grenzen voor studententeams of hobbyisten. Vanwege vitale impact, mechanische belasting, of de aanwezigheid van actieve stroom/software mag dit product niet in co-creatie gebouwd worden.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-bold text-white text-sm">Vervolgstappen:</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-xs">
                        <li><strong>Wijs het project af voor co-creatie:</strong> Leg de uitdaging niet neer bij studenten of hobbyisten.</li>
                        <li><strong>Professionele overdracht:</strong> Geef de uitdaging rechtstreeks door aan een gecertificeerd professioneel adaptatietechnicus (zoals Michel Verkaik) of de revalidatiewerkplaats van Rijndam Revalidatie.</li>
                        <li><strong>Dossierarchivering:</strong> Sla dit triagerapport op in de database van FysiekFabriek als bewijs van actieve risicobeheersing en conformiteit.</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* ORANJE - MATIG PLAN */}
                {triage.status === 'ORANJE_MATIG' && (
                  <div className="space-y-5 text-sm text-slate-300">
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex gap-4 items-start text-amber-300/90">
                      <span className="text-2xl">📋</span>
                      <div>
                        <h4 className="font-extrabold text-white text-base">Zwaardere Oranje Route: Dossier & Expert-Check</h4>
                        <p className="text-xs mt-1">Samenwerking is mogelijk, maar we moeten aan de strenge traceerbaarheids- en kwaliteitswensen van het Nederlandse VWS/IGJ kabinet voldoen.</p>
                      </div>
                    </div>

                    {/* Checklists and wizards */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-white text-sm">Vereiste Processtappen:</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                          <h5 className="font-bold text-xs text-sky-400 uppercase">1. Digitaal Mini-Technisch Dossier</h5>
                          <p className="text-[11px] text-slate-400">Studenten moeten bij oplevering een online dossier vullen met de materiaalspecificaties (filamenten, coatings) en de risicoanalyse. Dit dossier is digitaal opvraagbaar voor de cliënt.</p>
                        </div>
                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                          <h5 className="font-bold text-xs text-amber-400 uppercase">2. Expert Peer-Review (Michel Verkaik)</h5>
                          <p className="text-[11px] text-slate-400">Voor de overdracht moet een gecertificeerd expert het 3D-ontwerp of fysieke prototype keuren. Zonder zijn digitale accreditatie mag het product niet geleverd worden.</p>
                        </div>
                      </div>

                      {/* FMEA Wizard integration */}
                      <div className="border-t border-slate-700/60 pt-4 space-y-3">
                        <h4 className="font-bold text-white text-sm">Risicoanalyse & Beheersing (FMEA-lite Wizard)</h4>
                        <p className="text-xs text-slate-400">Breng samen met de studenten de gevaren van dit specifieke ontwerp in kaart en koppel direct maatregelen om het risico beheersbaar te maken.</p>
                        
                        {/* Hazard List */}
                        <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/60 text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <tr>
                                <th className="p-3">Gevaar / Risico</th>
                                <th className="p-3 text-center">Ernst (1-5)</th>
                                <th className="p-3">Beheersmaatregel</th>
                                <th className="p-3 text-right">Actie</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/60">
                              {fmeaHazards.map((h) => (
                                <tr key={h.id} className="hover:bg-slate-800/40">
                                  <td className="p-3 font-semibold text-slate-200">{h.hazard}</td>
                                  <td className="p-3 text-center">
                                    <span className={`px-2 py-0.5 rounded font-extrabold ${
                                      parseInt(h.severity) >= 4 ? 'bg-red-950 text-red-400 border border-red-500/30' :
                                      parseInt(h.severity) === 3 ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                                      'bg-sky-950 text-sky-400 border border-sky-500/30'
                                    }`}>
                                      {h.severity}/5
                                    </span>
                                  </td>
                                  <td className="p-3 text-slate-300">{h.mitigation}</td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick={() => removeHazard(h.id)} 
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                      title="Verwijder risico"
                                    >
                                      🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Add hazard form */}
                        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/50 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          <div className="sm:col-span-5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gevaar</label>
                            <input 
                              type="text" 
                              placeholder="bijv. Kunststof adapter breekt onder druk" 
                              value={newHazard}
                              onChange={(e) => setNewHazard(e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ernst (1-5)</label>
                            <select 
                              value={newSeverity}
                              onChange={(e) => setNewSeverity(e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                            >
                              <option value="1">1 (Verwaarloosbaar)</option>
                              <option value="2">2 (Licht)</option>
                              <option value="3">3 (Matig)</option>
                              <option value="4">4 (Ernst)</option>
                              <option value="5">5 (Katastrofaal)</option>
                            </select>
                          </div>
                          <div className="sm:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Beheersmaatregel</label>
                            <input 
                              type="text" 
                              placeholder="bijv. Minimale wanddikte 4mm en PETG" 
                              value={newMitigation}
                              onChange={(e) => setNewMitigation(e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-1 text-right">
                            <button
                              onClick={addHazard}
                              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-1.5 px-3 rounded-lg transition-colors text-xs"
                            >
                              Voeg
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ORANJE - LICHT PLAN */}
                {triage.status === 'ORANJE_LICHT' && (
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex gap-4 items-start text-amber-300/90">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <h4 className="font-extrabold text-white text-base">Lichte Oranje Route: Zelfcontrole</h4>
                        <p className="text-xs mt-1">Dit project compenseert weliswaar een beperking (dus formeel MDR), maar heeft een minimaal risicoprofiel.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-white text-sm">Af te vinken kwaliteitschecklist voor studenten:</h4>
                      <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-700/60 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer py-1 hover:text-white">
                          <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500/40" defaultChecked />
                          <span>Het product heeft geen scherpe hoeken, splinters of randen.</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer py-1 hover:text-white">
                          <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500/40" defaultChecked />
                          <span>Gebruikte materialen zijn gecertificeerd huidvriendelijk (non-toxic biocompatibel PLA/PETG).</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer py-1 hover:text-white">
                          <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500/40" />
                          <span>Het product is eenvoudig te reinigen met een milde zeep of milde alcoholoplossing.</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer py-1 hover:text-white">
                          <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500/40" />
                          <span>Het product bevat geen kleine, loszittende onderdelen die per ongeluk ingeslikt kunnen worden.</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* GROEN ROUTE PLAN */}
                {triage.status === 'GROEN' && (
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 flex gap-4 items-start text-emerald-300/90">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <h4 className="font-extrabold text-white text-base">Vrije co-creatie toegestaan!</h4>
                        <p className="text-xs mt-1">Geen zware medische procedures of certificering nodig. Studenten kunnen vrij ontwerpen, brainstormen en bouwen binnen de creatieve kaders van FysiekFabriek.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-white text-sm">Aandachtspunten:</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs">
                        <li><strong>Gebruikershandleiding:</strong> Lever het product op met een simpele en visuele instructiekaart voor de uitdager (hoe te gebruiken, wassen of opbergen).</li>
                        <li><strong>Disclaimer:</strong> Voeg de standaard FysiekFabriek disclaimer toe waarin staat dat dit geen medisch hulpmiddel is maar een ergonomische 'lifehack'.</li>
                        <li><strong>Open Source:</strong> Deel je 3D-ontwerpbestanden (STL/STEP) en instructies op de FysiekFabriek website, zodat andere uitdagers hier in de toekomst ook profijt van kunnen hebben!</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* REPORT ACTIONS & EXPORTS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800 border border-slate-700 rounded-2xl p-4">
                <button
                  onClick={() => setStep('intro')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/50 font-bold transition-all text-xs flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19" />
                  </svg>
                  <span>Nieuwe Triage</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={copyReportToClipboard}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Kopieer Triage-rapport</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Live Answers & Progress Tracker */}
        {step !== 'intro' && (
          <div className="lg:col-span-3 flex flex-col gap-6 animate-fade-in">
            <div className="bg-slate-800 rounded-3xl border border-slate-700 p-5 shadow-xl w-full space-y-4">
              <div className="border-b border-slate-700 pb-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Triage Voortgang</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Klik op een beantwoord blok om terug te gaan</p>
              </div>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const answer = answers[q.id];
                  const isAnswered = answer !== null;
                  const isCurrent = currentQ === idx && step === 'quiz';
                  
                  let badgeColor = "bg-slate-900 text-slate-500 border-slate-800";
                  let badgeText = "Openstaand";
                  
                  if (isAnswered) {
                    if (answer === 'yes') {
                      badgeColor = "bg-red-950/60 text-red-400 border-red-500/30";
                      badgeText = "Ja";
                    } else if (answer === 'no') {
                      badgeColor = "bg-emerald-950/60 text-emerald-400 border-emerald-500/30";
                      badgeText = "Nee";
                    } else {
                      const option = q.options?.find(o => o.value === answer);
                      badgeColor = "bg-amber-950/60 text-amber-400 border-amber-500/30";
                      badgeText = option ? option.label.split(':')[0] : answer;
                    }
                  } else if (isCurrent) {
                    badgeColor = "bg-sky-950 text-sky-400 border-sky-500/50 animate-pulse";
                    badgeText = "Actief...";
                  }

                  return (
                    <div 
                      key={q.id} 
                      onClick={() => {
                        if (step === 'quiz' && isAnswered) {
                          setCurrentQ(idx);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-xs transition-all ${
                        isCurrent 
                          ? 'bg-slate-700/50 border-sky-500/40 ring-1 ring-sky-500/20 shadow-md shadow-sky-500/5' 
                          : isAnswered && step === 'quiz' 
                          ? 'bg-slate-900/40 border-slate-700/60 hover:bg-slate-700/20 cursor-pointer hover:border-slate-500/40' 
                          : 'bg-slate-900/10 border-slate-800/40 opacity-55'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-semibold ${isCurrent ? 'text-sky-400' : isAnswered ? 'text-slate-200' : 'text-slate-500'}`}>
                          Vraag {idx + 1}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold border ${badgeColor}`}>
                          {badgeText}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-1">{q.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>© 2026 FysiekFabriek & Michel Verkaik Adaptatietechniek. Alle rechten voorbehouden.</p>
          <p className="opacity-60 text-[10px]">
            Deze tool is gebaseerd op de EU MDR 2017/745 verordeningen, de BNC Kamerbrief (december 2025 / februari 2026) en de risico-evaluatiemethodiek van Michel Verkaik.
          </p>
        </div>
      </footer>
    </div>
  );
}
