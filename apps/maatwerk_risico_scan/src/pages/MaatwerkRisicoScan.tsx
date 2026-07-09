import React, { useState } from 'react';
import metadata from '../../../../apps-metadata.json';
import { AppMetadata } from '@shared/types/metadata';

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
  const appMeta = (metadata.apps as AppMetadata[]).find(app => app.id === 'maatwerk_risico_scan');
  const appTheme = appMeta?.defaultTheme || 'theme-brutalist';

  const [step, setStep] = useState<'dashboard' | 'setup' | 'wizard' | 'result'>('dashboard');
  const [activeScanId, setActiveScanId] = useState<number | null>(null);
  const [savedScans, setSavedScans] = useState<any[]>(() => {
    const localData = localStorage.getItem('maatwerk_risico_scan_history');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        console.error("Fout bij laden van geschiedenis", e);
      }
    }
    return [];
  });
  const [formError, setFormError] = useState<string>('');

  const [currentQ, setCurrentQ] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({
    q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null
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
    if (step === 'dashboard' || step === 'setup') return 'none';
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

    const isRood = (currentQ === 0 || currentQ === 1 || currentQ === 2 || currentQ === 3) && val === 'yes';
    const isGroen = currentQ === 4 && val === 'yes';
    const isLast = currentQ === questions.length - 1;

    if (isRood || isGroen || isLast) {
      const res = getTriageResult(nextAnswers);
      const newScan = {
        id: activeScanId || Date.now(),
        date: new Date().toLocaleDateString('nl-NL'),
        projectName,
        projectDescription,
        challengerName,
        answers: nextAnswers,
        status: res.status,
        fmeaHazards
      };
      
      const updatedList = [newScan, ...savedScans.filter(s => s.id !== newScan.id)];
      setSavedScans(updatedList);
      localStorage.setItem('maatwerk_risico_scan_history', JSON.stringify(updatedList));
      setStep('result');
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      setStep('setup');
    }
  };

  const selectPreset = (preset: PresetProject) => {
    const scanId = Date.now();
    setActiveScanId(scanId);
    setProjectName(preset.name);
    setProjectDescription(preset.description);
    setChallengerName('Preset Deelnemer');
    setAnswers(preset.answers);
    const defaultFmea: FmeaHazard[] = [
      { id: 1, hazard: 'Scherpe randen na 3D-printen', severity: '2', mitigation: 'Handmatig naschuren en randen afronden in CAD' },
      { id: 2, hazard: 'Losraken door trillingen', severity: '3', mitigation: 'Gebruik van borgmoeren en periodieke controle voorschrijven' }
    ];
    setFmeaHazards(defaultFmea);

    const res = getTriageResult(preset.answers);
    const newScan = {
      id: scanId,
      date: new Date().toLocaleDateString('nl-NL'),
      projectName: preset.name,
      projectDescription: preset.description,
      challengerName: 'Preset Deelnemer',
      answers: preset.answers,
      status: res.status,
      fmeaHazards: defaultFmea
    };

    const updatedList = [newScan, ...savedScans.filter(s => s.id !== scanId)];
    setSavedScans(updatedList);
    localStorage.setItem('maatwerk_risico_scan_history', JSON.stringify(updatedList));
    setStep('result');
  };

  const startScan = () => {
    if (!projectName || !challengerName || !projectDescription) {
      setFormError('Vul a.u.b. alle verplichte velden van het projectpaspoort in.');
      return;
    }
    setFormError('');
    const scanId = Date.now();
    setActiveScanId(scanId);
    setAnswers({
      q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null
    });
    setFmeaHazards([
      { id: 1, hazard: 'Scherpe randen na 3D-printen', severity: '2', mitigation: 'Handmatig naschuren en randen afronden in CAD' },
      { id: 2, hazard: 'Losraken door trillingen', severity: '3', mitigation: 'Gebruik van borgmoeren en periodieke controle voorschrijven' }
    ]);
    setCurrentQ(0);
    setStep('wizard');
  };

  const deleteScan = (id: number) => {
    const updated = savedScans.filter(s => s.id !== id);
    setSavedScans(updated);
    localStorage.setItem('maatwerk_risico_scan_history', JSON.stringify(updated));
  };

  const loadScan = (scan: any) => {
    setActiveScanId(scan.id);
    setProjectName(scan.projectName);
    setProjectDescription(scan.projectDescription);
    setChallengerName(scan.challengerName);
    setAnswers(scan.answers);
    setFmeaHazards(scan.fmeaHazards || []);
    setStep('result');
  };

  const addHazard = () => {
    if (!newHazard || !newMitigation) return;
    const updated = [
      ...fmeaHazards,
      {
        id: Date.now(),
        hazard: newHazard,
        severity: newSeverity as any,
        mitigation: newMitigation
      }
    ];
    setFmeaHazards(updated);
    setNewHazard('');
    setNewMitigation('');
    
    const updatedList = savedScans.map(s => s.id === activeScanId ? { ...s, fmeaHazards: updated } : s);
    setSavedScans(updatedList);
    localStorage.setItem('maatwerk_risico_scan_history', JSON.stringify(updatedList));
  };

  const removeHazard = (id: number) => {
    const updated = fmeaHazards.filter(h => h.id !== id);
    setFmeaHazards(updated);
    
    const updatedList = savedScans.map(s => s.id === activeScanId ? { ...s, fmeaHazards: updated } : s);
    setSavedScans(updatedList);
    localStorage.setItem('maatwerk_risico_scan_history', JSON.stringify(updatedList));
  };
  const copyReportToClipboard = () => {
    const reportText = `
=============================================
FYSIEKFABRIEK SCAN-RAPPORT
=============================================
Projectnaam: ${projectName || 'Niet opgegeven'}
Uitdager: ${challengerName || 'Niet opgegeven'}
Beschrijving: ${projectDescription || 'Niet opgegeven'}
Datum: ${new Date().toLocaleDateString('nl-NL')}

SCAN RESULTAAT: ${triage.status}
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

Gegenereerd met de FysiekFabriek Scan Tool.
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
    <div className={`min-h-screen ${appTheme} bg-bg-app text-text-app flex flex-col font-sans relative overflow-x-hidden antialiased`}>
      {/* Confetti Animation Layer */}
      {/* Header */}
      <header className="bg-white border-b-app border-color-app py-5 px-6 sticky top-0 z-40 print:hidden shadow-app-small">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-3 border-2 border-slate-900 rounded-2xl flex items-center justify-center transform rotate-[-2deg] shadow-[2px_2px_0px_0px_rgba(242,101,34,1)]">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">FysiekFabriek</h1>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">MDR Risico Scan & Stoplicht Tool</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="../" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-app-btn border-2 border-color-app">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Terug naar Home</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        
        {/* Left Column: Interactive Stoplight Visualizer */}
        <div className="lg:col-span-3 flex flex-col items-center justify-start gap-6 print:hidden">
          <div className="bg-slate-900 text-slate-100 rounded-app-card border-width-app border-slate-850 p-6 shadow-app w-full max-w-xs flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest mb-6 text-center">Live Stoplicht Status</h3>
            
            {/* The actual physical stoplight case */}
            <div className="w-32 bg-slate-950 rounded-3xl p-5 shadow-inner border border-slate-850 flex flex-col gap-6 items-center relative">
              
              {/* Red Light */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 border-slate-900 transition-all duration-300 ${
                  glowClass === 'red' 
                    ? 'bg-red-500 shadow-[0_0_35px_rgba(239,68,68,0.9)] scale-105 animate-pulse' 
                    : 'bg-red-500/10 border-red-500/20'
                }`} />
                {glowClass === 'red' && <span className="absolute -inset-2 rounded-full border border-red-400/30 animate-ping pointer-events-none" />}
              </div>

              {/* Orange Light */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 border-slate-900 transition-all duration-300 ${
                  glowClass === 'orange' 
                    ? 'bg-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.9)] scale-105 animate-pulse' 
                    : 'bg-amber-500/10 border-amber-500/20'
                }`} />
                {glowClass === 'orange' && <span className="absolute -inset-2 rounded-full border border-amber-400/30 animate-ping pointer-events-none" />}
              </div>

              {/* Green Light */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 border-slate-900 transition-all duration-300 ${
                  glowClass === 'green' 
                    ? 'bg-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.9)] scale-105 animate-pulse' 
                    : 'bg-emerald-500/10 border-emerald-500/20'
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
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Actueel oordeel</span>
              <div className="inline-block py-1.5 px-4 rounded-full text-sm font-extrabold tracking-wide uppercase shadow-sm">
                {(step === 'dashboard' || step === 'setup') && (
                  <span className="text-slate-400 bg-slate-800 py-1 px-3 rounded-full border border-slate-700">Standby</span>
                )}
                {step === 'wizard' && (
                  <span className="text-sky-400 bg-sky-950/85 py-1 px-3 rounded-full border border-sky-800/30 animate-pulse">Analyseren...</span>
                )}
                {step === 'result' && (
                  <>
                    {triage.status === 'ROOD' && <span className="text-red-400 bg-red-950/85 py-1 px-3 rounded-full border border-red-800/30">ROOD (Professioneel)</span>}
                    {triage.status === 'GROEN' && <span className="text-emerald-400 bg-emerald-950/85 py-1 px-3 rounded-full border border-emerald-800/30 font-bold">GROEN (Lifehack)</span>}
                    {triage.status === 'ORANJE_MATIG' && <span className="text-amber-400 bg-amber-950/85 py-1 px-3 rounded-full border border-amber-800/30">ORANJE (Dossier + Review)</span>}
                    {triage.status === 'ORANJE_LICHT' && <span className="text-amber-400 bg-amber-950/85 py-1 px-3 rounded-full border border-amber-800/30">ORANJE (Lichte checklist)</span>}
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Quick Informative Info block */}
          <div className="bg-white rounded-app-card border-2 border-color-app p-5 shadow-app-small w-full max-w-xs text-xs text-slate-600 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">Actieve Software & Elektronica</h4>
            <p><strong>Nieuwe Regelgevende Blokken:</strong> Grijpt een project in op stroomvoorziening, sensoren, printplaten, of standalone apps? Dan verschuift het risicoprofiel direct naar <strong>Rood</strong>.</p>
            <p><strong>Waarom?</strong> Elektromagnetische storingen en softwarefouten (Rule 11) kunnen onverwacht optreden bij medisch kwetsbare gebruikers. Dit valt daarom buiten de studentenformule.</p>
          </div>
        </div>

        {/* Middle Column: Dynamic Wizard Cards / Results Screen */}
        <div className={`${
          step === 'dashboard' || step === 'setup' ? 'lg:col-span-9' : 'lg:col-span-6'
        } flex flex-col justify-start`}>
          {/* DASHBOARD VIEW */}
          {step === 'dashboard' && (
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto w-full">
              {/* Welkomst hero card */}
              <div className="border-width-app border-color-app bg-white p-8 sm:p-12 text-slate-900 rounded-app-card shadow-app space-y-6 relative overflow-hidden mb-8">
                <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
                <div className="border-b-app border-color-app pb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-[#F26522]">FysiekFabriek Maatwerk</span>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase mt-1 leading-none text-slate-900">
                    Maatwerk Risico Scan
                  </h1>
                  <p className="text-lg font-bold text-slate-500 mt-2">MDR Risico Scan & Stoplichtanalyse voor patiëntspecifieke hulpmiddelen.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <p className="text-slate-700 text-sm leading-relaxed font-semibold">
                    Dit interactieve controlepaneel helpt studenten, makers en uitdagers om direct te classificeren of een projectveiligheidsrisico past binnen de kaders van de FysiekFabriek co-creatie formule, of dat het moet worden overgedragen aan een adaptatietechnicus.
                  </p>
                  <div className="bg-[#C4BDF3]/20 border-2 border-dashed border-[#C4BDF3] rounded-2xl p-4 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase text-[#4C4973]">Snelle Richtlijn:</h4>
                      <p className="text-xs text-slate-600 font-medium">We bouwen uitsluitend mechanische lifehacks die ergonomisch comfort bieden en geen vitale functies beïnvloeden.</p>
                    </div>
                    <button 
                      onClick={() => setStep('setup')}
                      className="mt-4 bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 text-white font-bold uppercase tracking-wider text-xs py-3.5 px-6 rounded-app-btn transition-all shadow-[3px_3px_0px_0px_rgba(242,101,34,1)] flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Start Nieuwe Scan</span>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-700">Voorbeeld-projecten laden</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PRESET_PROJECTS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectPreset(p)}
                      className="text-left bg-white hover:bg-slate-50 border-2 border-color-app rounded-app-btn p-4 transition-all shadow-app-small flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#F26522] transition-colors">{p.name}</h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#F26522] mt-4 flex items-center gap-1">
                        Laad test-case
                        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Scans List */}
              <div className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-700">Eerdere Risico Scans</h2>
                {savedScans.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-300 rounded-app-card p-12 text-center text-slate-500 font-bold">
                    Geen eerdere scans gevonden. Start een nieuwe scan of laad een preset.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedScans.map((scan) => (
                      <div 
                        key={scan.id}
                        onClick={() => loadScan(scan)}
                        className="bg-white border-width-app border-color-app rounded-app-card p-6 shadow-app-small hover:shadow-app transition-all flex flex-col justify-between group relative cursor-pointer"
                      >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteScan(scan.id);
                          }}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Verwijder scan"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{scan.date}</span>
                            {scan.status === 'ROOD' && <span className="bg-red-100 border-2 border-color-app text-red-800 text-[10px] font-black uppercase px-3 py-0.5 rounded-full">Uitsluiting</span>}
                            {scan.status === 'GROEN' && <span className="bg-emerald-100 border-2 border-color-app text-emerald-800 text-[10px] font-black uppercase px-3 py-0.5 rounded-full">Geschikt</span>}
                            {(scan.status === 'ORANJE_MATIG' || scan.status === 'ORANJE_LICHT') && <span className="bg-amber-100 border-2 border-color-app text-amber-800 text-[10px] font-black uppercase px-3 py-0.5 rounded-full">MDR Licht</span>}
                          </div>

                          <div>
                            <h3 className="font-extrabold text-lg uppercase tracking-tight text-slate-900 group-hover:text-[#F26522] transition-colors">{scan.projectName}</h3>
                            <p className="text-xs text-slate-500 font-bold mt-0.5">Uitdager: {scan.challengerName}</p>
                            <p className="text-xs text-slate-600 mt-2 line-clamp-2 font-semibold leading-relaxed">{scan.projectDescription}</p>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t-2 border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span>Scan voltooid</span>
                          <span className="text-slate-900 font-black uppercase hover:underline flex items-center space-x-1">
                            <span>Inzien</span>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETUP VIEW */}
          {step === 'setup' && (
            <div className="max-w-xl mx-auto w-full bg-white border-width-app border-color-app rounded-app-card p-8 sm:p-10 space-y-6 shadow-app animate-fadeIn">
              <div className="border-b-app border-color-app pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#F26522]">Dossieraanmaak</span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mt-1">Projectpaspoort</h2>
                <p className="text-xs text-slate-500 font-bold mt-1">Leg de basisgegevens vast om de risico scan te starten.</p>
              </div>

              {formError && (
                <div className="border-2 border-rose-800 bg-rose-50 text-rose-900 p-4 text-xs font-bold flex items-start space-x-2 rounded-app-btn">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                    Titel van de uitdaging
                  </label>
                  <input 
                    type="text"
                    placeholder="Bijv. Rolstoel-bekerhouder of Klembare schildersezel"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-color-app rounded-app-btn focus:border-brand-primary outline-none text-sm transition-colors shadow-app-small"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                    Wie is de uitdager?
                  </label>
                  <input 
                    type="text"
                    placeholder="Bijv. Mijzelf of Sophie"
                    value={challengerName}
                    onChange={(e) => setChallengerName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-color-app rounded-app-btn focus:border-brand-primary outline-none text-sm transition-colors shadow-app-small"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                    Omschrijving van het vraagstuk
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Wat is er precies nodig en welke handeling moet hiermee worden vergemakkelijkt?"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-color-app rounded-app-btn focus:border-brand-primary outline-none text-sm transition-colors shadow-app-small"
                  />
                </div>

                <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-center">
                  <button 
                    type="button"
                    onClick={() => setStep('dashboard')}
                    className="text-slate-500 hover:text-slate-900 text-xs font-black uppercase tracking-wider py-2 px-4 rounded-app-btn cursor-pointer"
                  >
                    Annuleren
                  </button>
                  <button 
                    type="button"
                    onClick={startScan}
                    className="bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 text-white px-5 py-3 rounded-app-btn text-xs font-black uppercase tracking-wider transition-all shadow-app-small flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Start de Scan</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WIZARD VIEW */}
          {step === 'wizard' && (
            <div className="bg-white border-width-app border-color-app rounded-app-card p-6 md:p-8 space-y-6 shadow-app animate-fadeIn relative">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>Vraag {currentQ + 1} van {questions.length}</span>
                <span className="text-[#F26522] bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md font-black">{questions[currentQ].title}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-[#F26522] h-full transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question card */}
              <div className="bg-slate-50 border-2 border-color-app rounded-app-btn p-6 flex flex-col md:flex-row gap-5 items-start">
                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-color-app shrink-0">
                  {questions[currentQ].icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug">{questions[currentQ].text}</h3>
                  <p className="text-slate-600 text-sm md:text-base font-semibold leading-relaxed">{questions[currentQ].description}</p>
                </div>
              </div>

              {/* Specific Question Examples (Sub-panel) */}
              {questions[currentQ].examples && (
                <div className="bg-slate-50 border-2 border-color-app rounded-app-btn p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 uppercase tracking-wider">
                    <span>💡 Praktijkvoorbeelden:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-rose-50 border-2 border-rose-250 rounded-xl p-3 space-y-1">
                      <span className="font-black text-rose-800 flex items-center gap-1">
                        <span>🔴</span> Rood (Uitsluiting)
                      </span>
                      <p className="text-rose-700 font-semibold leading-relaxed">{questions[currentQ].examples?.red}</p>
                    </div>
                    <div className="bg-emerald-50 border-2 border-emerald-250 rounded-xl p-3 space-y-1">
                      <span className="font-black text-emerald-800 flex items-center gap-1">
                        <span>🟢</span> Geschikt (FF-Kader)
                      </span>
                      <p className="text-emerald-700 font-semibold leading-relaxed">{questions[currentQ].examples?.ok}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 rounded-app-btn border-2 border-color-app hover:bg-slate-50 text-slate-900 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Terug</span>
                </button>

                {/* Answers actions */}
                {questions[currentQ].type === 'binary' ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswer('no')}
                      className="px-8 py-3.5 bg-slate-950 hover:bg-slate-800 border-2 border-slate-955 text-white font-extrabold rounded-app-btn transition-all shadow-app-small cursor-pointer"
                    >
                      Nee
                    </button>
                    <button
                      onClick={() => handleAnswer('yes')}
                      className="px-8 py-3.5 bg-red-600 hover:bg-red-500 border-2 border-red-650 text-white font-extrabold rounded-app-btn transition-all shadow-app-small cursor-pointer"
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
                        className="text-left px-5 py-3.5 bg-white hover:bg-slate-50 border-2 border-color-app text-slate-900 font-bold rounded-app-btn transition-all shadow-app-small flex flex-col cursor-pointer"
                      >
                        <span className="text-sm font-extrabold">{opt.label}</span>
                        <span className="text-xs text-slate-650 font-normal mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESULT VIEW */}
          {step === 'result' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Main result badge */}
              <div className={`border-width-app border-color-app rounded-app-card p-6 md:p-8 shadow-app space-y-4 relative overflow-hidden ${
                triage.status === 'ROOD' ? 'bg-rose-50 text-rose-900' :
                triage.status === 'GROEN' ? 'bg-emerald-50 text-emerald-900' :
                'bg-amber-50 text-amber-900'
              }`}>
                
                <div className={`absolute top-0 left-0 w-full h-1.5 ${
                  triage.status === 'ROOD' ? 'bg-red-500' :
                  triage.status === 'GROEN' ? 'bg-emerald-500' :
                  'bg-amber-500'
                }`}></div>

                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border-2 ${
                    triage.status === 'ROOD' ? 'bg-white border-red-500 text-red-500' :
                    triage.status === 'GROEN' ? 'bg-white border-emerald-500 text-emerald-500' :
                    'bg-white border-amber-500 text-amber-500'
                  }`}>
                    {triage.status === 'ROOD' && (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    )}
                    {triage.status === 'GROEN' && (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {(triage.status === 'ORANJE_MATIG' || triage.status === 'ORANJE_LICHT') && (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resultaat Scan</span>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">{triage.title || 'MDR Proportioneel'}</h2>
                  </div>
                </div>

                <p className="text-slate-700 text-sm md:text-base font-semibold leading-relaxed bg-white/70 p-4 rounded-xl border border-slate-200">
                  {triage.message}
                </p>

                {triage.reasons && triage.reasons.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Gedetecteerde Risicofactoren:</span>
                    <ul className="space-y-1.5">
                      {triage.reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-amber-900 font-bold flex items-start gap-2">
                          <span className="text-amber-500 shrink-0">⚠️</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-2 print:hidden">
                  <button
                    onClick={() => setStep('wizard')}
                    className="inline-flex items-center space-x-1.5 bg-[#F26522] border-2 border-slate-800 hover:bg-orange-600 text-white px-5 py-2.5 rounded-app-btn text-xs font-black uppercase tracking-wider shadow-app-small transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Pas antwoord aan</span>
                  </button>
                </div>
              </div>

              {/* Official Report Container */}
              <div className="bg-white border-width-app border-color-app rounded-app-card shadow-app overflow-hidden print-full-layout mt-6">
                
                {/* Scan Sheet Header */}
                <div className="p-8 sm:p-10 border-b-app border-color-app flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 print-full-layout">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Fokus FysiekFabriek Dossier</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight mt-1 text-slate-900">Scan Uitdagingen</h3>
                  </div>
                  <div className="flex items-center space-x-2 print:hidden">
                    <button 
                      onClick={() => window.print()}
                      className="border-2 border-color-app bg-white hover:bg-slate-50 px-4 py-2.5 rounded-app-btn text-xs font-bold uppercase tracking-wider transition-all shadow-app-small cursor-pointer text-slate-800 animate-pulse"
                    >
                      <span>Opslaan als PDF</span>
                    </button>
                    <button 
                      onClick={() => setStep('dashboard')}
                      className="bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-app-btn text-xs font-bold uppercase tracking-wider transition-all shadow-app-small cursor-pointer"
                    >
                      <span>Nieuwe Scan</span>
                    </button>
                  </div>
                </div>

                {/* Dossier Report Body */}
                <div className="p-8 sm:p-10 space-y-8 print-full-layout text-slate-900">
                  
                  {/* Section A: Passport Data */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-1.5 font-mono">Projectpaspoort</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-bold block">PROJECTNAAM:</span>
                        <span className="font-extrabold text-sm text-slate-900">{projectName || 'Niet opgegeven'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">UITDAGER:</span>
                        <span className="font-extrabold text-sm text-slate-900">{challengerName || 'Niet opgegeven'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">DATUM TOETSING:</span>
                        <span className="font-extrabold text-sm text-slate-900">{new Date().toLocaleDateString('nl-NL')}</span>
                      </div>
                    </div>
                    <div className="pt-2 text-xs">
                      <span className="text-slate-400 font-bold block">OMSCHRIJVING:</span>
                      <p className="text-slate-700 leading-relaxed font-semibold mt-1">{projectDescription || 'Niet opgegeven'}</p>
                    </div>
                  </div>

                  {/* Section B: Triage result */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-1.5 font-mono">Risicobeoordeling</h4>
                    <div className="text-xs space-y-2">
                      <div>
                        <span className="text-slate-400 font-bold block">STATUS VERDICT:</span>
                        <span className="font-extrabold text-sm text-slate-900">{triage.status}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">TOELICHTING VERDICT:</span>
                        <p className="text-slate-700 leading-relaxed font-semibold mt-1">{triage.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* FMEA Matrix Section (for orange status) */}
                  {(triage.status === 'ORANJE_MATIG' || triage.status === 'ORANJE_LICHT') && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-1.5 font-mono">FMEA-Lite Risicomatrix (MDR-Licht)</h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b-2 border-slate-800 text-slate-500 font-bold">
                              <th className="py-2.5 pr-4 uppercase">Risico / Gevaar</th>
                              <th className="py-2.5 px-4 uppercase text-center w-24">Ernst (1-5)</th>
                              <th className="py-2.5 px-4 uppercase">Mitigerende Maatregel</th>
                              <th className="py-2.5 pl-4 uppercase text-right print:hidden w-16">Actie</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fmeaHazards.map((h) => {
                              const sevNum = parseInt(h.severity);
                              const sevClass = sevNum <= 2 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                               sevNum === 3 ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                               'bg-rose-100 text-rose-800 border-rose-300';
                              return (
                                <tr key={h.id} className="border-b border-slate-100 font-semibold text-slate-850 hover:bg-slate-50/50">
                                  <td className="py-3 pr-4 leading-normal">{h.hazard}</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-black ${sevClass}`}>
                                      {h.severity}/5
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 leading-normal">{h.mitigation}</td>
                                  <td className="py-3 pl-4 text-right print:hidden">
                                    <button 
                                      onClick={() => removeHazard(h.id)}
                                      className="text-slate-400 hover:text-red-500 cursor-pointer font-bold uppercase text-[9px] hover:underline"
                                    >
                                      Wis
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Add Hazard Form (hidden on print) */}
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 space-y-4 print:hidden">
                        <span className="text-[10px] font-black uppercase text-slate-500 block">Nieuw Risico Toevoegen:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          <div className="sm:col-span-5 space-y-1">
                            <label className="block text-[9px] font-black uppercase text-slate-400">Risico / Gevaar</label>
                            <input 
                              type="text"
                              placeholder="Bijv. Klemgevaar bij inklappen"
                              value={newHazard}
                              onChange={(e) => setNewHazard(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="block text-[9px] font-black uppercase text-slate-400">Ernst</label>
                            <select 
                              value={newSeverity}
                              onChange={(e) => setNewSeverity(e.target.value)}
                              className="w-full px-2 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none"
                            >
                              <option value="1">1 (Licht)</option>
                              <option value="2">2 (Laag)</option>
                              <option value="3">3 (Matig)</option>
                              <option value="4">4 (Hoog)</option>
                              <option value="5">5 (Kritiek)</option>
                            </select>
                          </div>
                          <div className="sm:col-span-4 space-y-1">
                            <label className="block text-[9px] font-black uppercase text-slate-400">Mitigatie (Oplossing)</label>
                            <input 
                              type="text"
                              placeholder="Bijv. Afronden hoeken, waarschuwing"
                              value={newMitigation}
                              onChange={(e) => setNewMitigation(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <button
                              onClick={addHazard}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-black uppercase cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section C: Complete scan visualization */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-1.5 font-mono">Gezamenlijke Scan Toetsing</h4>
                    
                    <div className="space-y-2">
                      {questions.map((q, i) => {
                        const wasAnswered = answers[q.id] !== null;
                        const answer = answers[q.id];
                        let statusText = "Niet bereikt";
                        let indicator = <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />;

                        if (wasAnswered) {
                          if (answer === 'yes') {
                            if (q.id === 'q1' || q.id === 'q2' || q.id === 'q3' || q.id === 'q4') {
                              indicator = <span className="text-red-500">✗</span>;
                              statusText = "Uitsluiting";
                            } else {
                              indicator = <span className="text-emerald-500">✓</span>;
                              statusText = "Voldoet";
                            }
                          } else if (answer === 'no') {
                            if (q.id === 'q1' || q.id === 'q2' || q.id === 'q3' || q.id === 'q4') {
                              indicator = <span className="text-emerald-500">✓</span>;
                              statusText = "Voldoet";
                            } else {
                              indicator = <span className="text-red-500">✗</span>;
                              statusText = "Uitsluiting";
                            }
                          } else {
                            indicator = <span className="text-amber-500">✓</span>;
                            statusText = "Voldoet";
                          }
                        }

                        return (
                          <div 
                            key={q.id} 
                            className={`flex items-center justify-between p-3.5 border rounded-xl text-xs font-bold transition-all ${
                              wasAnswered 
                                ? 'border-color-app text-slate-900 bg-white shadow-app-small' 
                                : 'border-slate-200 text-slate-400 bg-slate-50/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-[10px] text-slate-400 w-4">{i + 1}.</span>
                              <span className="uppercase tracking-tight">{q.title}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] font-black uppercase tracking-wider">{statusText}</span>
                              <div className="w-5 h-5 border-2 border-slate-200 bg-white rounded flex items-center justify-center font-bold text-[10px]">
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
                  Gegenereerd door Fokus FysiekFabriek Scantoets op {new Date().toLocaleDateString('nl-NL')}
                </div>

              </div>

              {/* REPORT ACTIONS & EXPORTS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border-2 border-color-app rounded-2xl p-4 print:hidden shadow-app-small">
                <button
                  onClick={() => setStep('dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-app-btn border-2 border-color-app text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Terug naar dashboard</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={copyReportToClipboard}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-app-btn transition-all shadow-app-small text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Kopieer Scan-rapport</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Live Answers & Progress Tracker */}
        {step === 'wizard' && (
          <div className="lg:col-span-3 flex flex-col gap-6 animate-fade-in print:hidden">
            <div className="bg-white rounded-app-card border-width-app border-color-app p-5 shadow-app w-full space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Scan Voortgang</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Klik op een beantwoord blok om terug te gaan</p>
              </div>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const answer = answers[q.id];
                  const isAnswered = answer !== null;
                  const isCurrent = currentQ === idx && step === 'wizard';
                  
                  let badgeColor = "bg-slate-100 text-slate-500 border-slate-200";
                  let badgeText = "Openstaand";
                  
                  if (isAnswered) {
                    if (answer === 'yes') {
                      badgeColor = "bg-rose-50 text-rose-800 border-rose-200";
                      badgeText = "Ja";
                    } else if (answer === 'no') {
                      badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
                      badgeText = "Nee";
                    } else {
                      const option = q.options?.find(o => o.value === answer);
                      badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
                      badgeText = option ? option.label.split(':')[0] : answer;
                    }
                  } else if (isCurrent) {
                    badgeColor = "bg-sky-50 text-sky-800 border-sky-200 animate-pulse";
                    badgeText = "Actief...";
                  }

                  return (
                    <div 
                      key={q.id} 
                      onClick={() => {
                        if (isAnswered) {
                          setCurrentQ(idx);
                        }
                      }}
                      className={`p-2.5 rounded-app-btn border-2 text-xs transition-all ${
                        isCurrent 
                          ? 'bg-slate-50 border-sky-500/50 shadow-app-small' 
                          : isAnswered 
                          ? 'bg-white border-color-app hover:bg-slate-50 cursor-pointer shadow-app-small' 
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-semibold ${isCurrent ? 'text-sky-800' : isAnswered ? 'text-slate-900' : 'text-slate-400'}`}>
                          Vraag {idx + 1}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black border ${badgeColor}`}>
                          {badgeText}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-1 font-semibold">{q.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t-app border-color-app py-6 px-6 text-center text-slate-500 text-xs mt-auto print:hidden">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-bold">© 2026 FysiekFabriek & Michel Verkaik Adaptatietechniek. Alle rechten voorbehouden.</p>
          <p className="opacity-60 text-[10px] font-semibold">
            Deze scan is gebaseerd op de EU MDR 2017/745 verordeningen en de risico-evaluatiemethodiek van Michel Verkaik.
          </p>
        </div>
      </footer>
    </div>
  );
}
