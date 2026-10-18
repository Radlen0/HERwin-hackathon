import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  MessageSquareText,
  Home,
  ArrowRight,
  Check,
  Compass
} from 'lucide-react';
import { MoodCharacter } from './components/mascots/MoodCharacters';
import { MascotBrain } from './components/mascots/MascotBrain';
import { MoodType, Language } from './types';

export type DestinationType = 'home' | 'chatbot' | 'paint';

export interface UniversalProblem {
  id: string;
  en: string;
  fr: string;
  derja: string;
}

// Common problems that remain identical across all moods
export const COMMON_PROBLEMS_LIST: UniversalProblem[] = [
  {
    id: 'prob_rev',
    en: 'Overwhelmed by revision',
    fr: 'Submergé(e) par les révisions',
    derja: 'Daya3 m3a el revision'
  },
  {
    id: 'prob_focus',
    en: 'Hard to focus today',
    fr: "Difficile de se concentrer aujourd'hui",
    derja: 'Mochkel fi tarkiz lyoum'
  },
  {
    id: 'prob_exam',
    en: 'Pre-exam anxiety',
    fr: 'Anxiété pré-examen',
    derja: 'Stress 9bal el imti7an'
  },
  {
    id: 'prob_start',
    en: "Don't know where to start",
    fr: 'Par quoi commencer en premier ?',
    derja: 'Ma na3rech mnin nebda'
  },
  {
    id: 'prob_drain',
    en: 'Mentally drained after lectures',
    fr: 'Épuisé(e) mentalement après les cours',
    derja: 'T3ebt men kothret les cours'
  },
  {
    id: 'prob_procrast',
    en: 'Procrastination paralysis',
    fr: 'Bloqué(e) dans la procrastination',
    derja: 'N2ajjel fel khedma w ma najamtech nebda'
  },
  {
    id: 'prob_bug',
    en: 'Code / project stuck for hours',
    fr: 'Projet ou code bloqué depuis des heures',
    derja: 'Khedma wa9fa swaye3'
  },
  {
    id: 'prob_sleep',
    en: 'Lack of sleep & fatigue',
    fr: 'Manque de sommeil & fatigue',
    derja: '9ellet noum w fchala'
  }
];

export interface WelcomeScreenProps {
  onProceed: (data: {
    mood: MoodType;
    selectedProblems: string[];
    customDetail: string;
    destination: DestinationType;
    language: Language;
  }) => void;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onProceed,
  currentLanguage = 'en',
  onLanguageChange
}) => {
  // Language selection: English, French, Tunisian Derja
  const [lang, setLang] = useState<Language>(() => {
    return currentLanguage || (localStorage.getItem('nefes_final_lang') as Language) || 'en';
  });

  // Selected mood state: calm | moderate | frustrated
  const [selectedMood, setSelectedMood] = useState<'calm' | 'moderate' | 'frustrated'>('moderate');

  // Selected destination (pre-selected by mood: calm -> home, moderate -> chatbot, frustrated -> paint)
  const [destination, setDestination] = useState<DestinationType>('chatbot');

  // Multi-select problems state (same list across all moods; selections persist when mood changes)
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>(['prob_rev']);
  const [customDetail, setCustomDetail] = useState<string>('');

  // Localized texts
  const labels = {
    en: {
      brand: "MIRA",
      tag: "Academic Well-being",
      title: "How are you feeling right now?",
      subtitle: "Choose your mood and any struggles to shape your session:",
      calmTitle: "Calm",
      calmDesc: "Peaceful & steady",
      calmDestBadge: "Home",
      moderateTitle: "Moderate",
      moderateDesc: "In-between & reflective",
      moderateDestBadge: "MiraAI Chat",
      frustratedTitle: "Frustrated",
      frustratedDesc: "Tense or blocked",
      frustratedDestBadge: "Paint",
      commonProblemsHeading: "What are you experiencing?",
      commonProblemsSub: "Select one or more struggles that apply to you right now:",
      selectedCount: "selected",
      selectAll: "Select all",
      clearAll: "Clear",
      customDetailPlaceholder: "+ Add specific note or course name (optional)...",
      destinationLabel: "Where to proceed next:",
      destinationHint: "Pre-selected for your mood",
      proceedBtn: "Proceed",
      destinations: {
        home: {
          name: "Home",
          action: "Proceed to Home",
          hint: "Daily inspirations, dashboard & well-being toolkit"
        },
        chatbot: {
          name: "MiraAI",
          action: "Proceed to MiraAI Chat",
          hint: "Share thoughts & get step-by-step guidance from MiraAI"
        },
        paint: {
          name: "Paint",
          action: "Proceed to Paint",
          hint: "Express yourself freely on the creative canvas"
        }
      }
    },
    fr: {
      brand: "MIRA",
      tag: "Bien-être Étudiant",
      title: "Comment te sens-tu en ce moment ?",
      subtitle: "Choisis ton humeur et tes difficultés pour orienter ta séance :",
      calmTitle: "Calme",
      calmDesc: "Paisible & sereine",
      calmDestBadge: "Accueil",
      moderateTitle: "Modéré",
      moderateDesc: "Partagée & pensive",
      moderateDestBadge: "Chat MiraAI",
      frustratedTitle: "Frustrée",
      frustratedDesc: "Tendue ou bloquée",
      frustratedDestBadge: "Peinture",
      commonProblemsHeading: "Qu'est-ce qui te préoccupe ?",
      commonProblemsSub: "Sélectionne une ou plusieurs difficultés du moment :",
      selectedCount: "sélectionné(s)",
      selectAll: "Tout choisir",
      clearAll: "Effacer",
      customDetailPlaceholder: "+ Ajouter une précision ou matière (optionnel)...",
      destinationLabel: "Destination suivante :",
      destinationHint: "Adapté à ton humeur",
      proceedBtn: "Continuer",
      destinations: {
        home: {
          name: "Accueil",
          action: "Continuer vers l'Accueil",
          hint: "Inspirations quotidiennes, tableau de bord et outils"
        },
        chatbot: {
          name: "MiraAI",
          action: "Continuer vers MiraAI",
          hint: "Exprime tes sentiments et reçois un plan pas-à-pas de MiraAI"
        },
        paint: {
          name: "Peinture",
          action: "Continuer vers le Tableau",
          hint: "Libère tes idées et émotions sur la toile créative"
        }
      }
    },
    derja: {
      brand: "MIRA • ميرا",
      tag: "Rtiye7 el Etudiant",
      title: "Kifech 7assa rou7ek tawa ?",
      subtitle: "Ekhtar jawwek w chnouwa m9al9ek bech n3awnouk :",
      calmTitle: "Hédi / ريّق",
      calmDesc: "Merta7 w reka7",
      calmDestBadge: "Ed-dar",
      moderateTitle: "3adi / معتدل",
      moderateDesc: "Fi nos thniya",
      moderateDestBadge: "Chat MiraAI",
      frustratedTitle: "Faddit / فادد",
      frustratedDesc: "Mtawter wala bloqué",
      frustratedDestBadge: "Lawwen",
      commonProblemsHeading: "Chnouwa eli m9al9ek tawa ?",
      commonProblemsSub: "Tnajjem tekhtar akther men mochkla fard wa9t :",
      selectedCount: "ikhtiyarat",
      selectAll: "Ekhtar el koll",
      clearAll: "Fassa5",
      customDetailPlaceholder: "+ Zid fekra wala esm el module (ikhtiyari)...",
      destinationLabel: "Fin theb tkammel :",
      destinationHint: "Mwafe9 m3a jawwek",
      proceedBtn: "Kammel / واصل",
      destinations: {
        home: {
          name: "Ed-dar",
          action: "Kammel l'Ed-dar",
          hint: "Inspirations 3D, tableau de bord w khidmet el app"
        },
        chatbot: {
          name: "MiraAI",
          action: "Kammel lel Chat m3a MiraAI",
          hint: "Faragh 9albek w 5odh khotowat sahla men MiraAI"
        },
        paint: {
          name: "Lawwen",
          action: "Kammel l'Espace Lawwen",
          hint: "Lawwen w rassem fekretk bech tfarragh mokhek"
        }
      }
    }
  };

  const cur = labels[lang] || labels.en;

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('nefes_final_lang', newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  // Switch mood and update default destination
  const handleMoodSelect = (mood: 'calm' | 'moderate' | 'frustrated') => {
    setSelectedMood(mood);
    if (mood === 'calm') {
      setDestination('home');
    } else if (mood === 'moderate') {
      setDestination('chatbot');
    } else if (mood === 'frustrated') {
      setDestination('paint');
    }
  };

  // Toggle problem pill selection (Multi-Select)
  const toggleProblem = (id: string) => {
    setSelectedProblemIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedProblemIds(COMMON_PROBLEMS_LIST.map((p) => p.id));
  };

  const handleClearAll = () => {
    setSelectedProblemIds([]);
  };

  // Proceed directly to the chosen screen (No intermediate recorded screen)
  const handleProceed = () => {
    const selectedProblemObjects = COMMON_PROBLEMS_LIST.filter((p) => selectedProblemIds.includes(p.id));
    const problemLabels = selectedProblemObjects.map((p) => {
      if (lang === 'fr') return p.fr;
      if (lang === 'derja') return p.derja;
      return p.en;
    });

    const checkInData = {
      mood: selectedMood as MoodType,
      selectedProblems: problemLabels,
      customDetail: customDetail.trim(),
      destination,
      language: lang
    };

    localStorage.setItem('nefes_final_checkin', JSON.stringify(checkInData));

    // Immediately trigger navigation to target screen!
    onProceed(checkInData);
  };

  // Dynamic theme styling matching mood
  const theme = {
    calm: {
      accentText: 'text-[#3D5834]',
      cardBgActive: 'bg-[#F4F8EC]',
      cardBorderActive: 'border-[#6F8D45]',
      cardRingActive: 'ring-2 ring-[#6F8D45]/30',
      badgeBg: 'bg-[#6F8D45]',
      chipActive: 'bg-[#3D5834] text-white border-[#2B3E1F] shadow-xs',
      chipCheck: 'bg-white/20 text-white',
      destActive: 'bg-[#3D5834] text-white border-[#2B3E1F]'
    },
    moderate: {
      accentText: 'text-[#184F54]',
      cardBgActive: 'bg-[#EDF7F8]',
      cardBorderActive: 'border-[#438990]',
      cardRingActive: 'ring-2 ring-[#438990]/30',
      badgeBg: 'bg-[#438990]',
      chipActive: 'bg-[#184F54] text-white border-[#0E3236] shadow-xs',
      chipCheck: 'bg-white/20 text-white',
      destActive: 'bg-[#184F54] text-white border-[#0E3236]'
    },
    frustrated: {
      accentText: 'text-[#872132]',
      cardBgActive: 'bg-[#FDF0F3]',
      cardBorderActive: 'border-[#CE4C64]',
      cardRingActive: 'ring-2 ring-[#CE4C64]/30',
      badgeBg: 'bg-[#CE4C64]',
      chipActive: 'bg-[#872132] text-white border-[#540F1B] shadow-xs',
      chipCheck: 'bg-white/20 text-white',
      destActive: 'bg-[#872132] text-white border-[#540F1B]'
    }
  }[selectedMood];

  return (
    <div className="min-h-screen bg-[#FFF9E9] flex items-center justify-center p-3 sm:p-5 font-sans selection:bg-[#E8E9AE] text-[#202019]">
      {/* FLOATING PANEL (NO TOP NAV BAR) */}
      <div className="bg-[#FFFDF7] rounded-3xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#ECE7D4] relative p-5 sm:p-6 overflow-hidden my-auto animate-fadeIn">
        
        {/* Panel Header Controls (Brand & Language Selector inside the card) */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ECE7D4]/60">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-[#202019] tracking-tight">
              {cur.brand}
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-[11px] font-medium text-[#737264]">{cur.tag}</span>
          </div>

          {/* Clean Language Dropdown */}
          <select
            value={lang}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="text-[11px] font-bold bg-white border border-[#DDD6C0] rounded-xl px-2.5 py-1 text-[#434237] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3D5834] shadow-2xs"
            aria-label="Select Language"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="derja">تونسية</option>
          </select>
        </div>

        <div>
          {/* Mascot & Welcome Header */}
          <div className="text-center mb-5 pt-1">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF5E2] border border-[#ECE7D4] flex items-center justify-center shadow-2xs">
                <MascotBrain size="sm" animated={false} />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#202019]">
              {cur.title}
            </h1>
            <p className="text-xs text-[#737264] mt-1 max-w-sm mx-auto leading-relaxed">
              {cur.subtitle}
            </p>
          </div>

          {/* STEP 1: MOOD SELECTION (3 CARDS) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
            {/* Calm Card */}
            <button
              type="button"
              onClick={() => handleMoodSelect('calm')}
              className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 cursor-pointer border-2 relative ${
                selectedMood === 'calm'
                  ? 'bg-[#F4F8EC] border-[#6F8D45] shadow-md ring-2 ring-[#6F8D45]/30 scale-[1.02]'
                  : 'bg-white hover:bg-[#F9FBF5] border-[#D9E3C5] shadow-2xs hover:scale-[1.01]'
              }`}
            >
              <div className="relative mb-1">
                <MoodCharacter mood="calm" size={42} selected={selectedMood === 'calm'} />
                {selectedMood === 'calm' && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6F8D45] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-[#3D5834]">
                {cur.calmTitle}
              </span>
              <span className="text-[9.5px] text-[#737264] line-clamp-1 mt-0.5 hidden sm:block">
                {cur.calmDesc}
              </span>
              <span className="mt-1.5 text-[9px] font-bold bg-[#E8E9AE] text-[#3D5834] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Home className="w-2.5 h-2.5" />
                {cur.calmDestBadge}
              </span>
            </button>

            {/* Moderate Card */}
            <button
              type="button"
              onClick={() => handleMoodSelect('moderate')}
              className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 cursor-pointer border-2 relative ${
                selectedMood === 'moderate'
                  ? 'bg-[#EDF7F8] border-[#438990] shadow-md ring-2 ring-[#438990]/30 scale-[1.02]'
                  : 'bg-white hover:bg-[#F2FBFC] border-[#C8E0E2] shadow-2xs hover:scale-[1.01]'
              }`}
            >
              <div className="relative mb-1">
                <MoodCharacter mood="moderate" size={42} selected={selectedMood === 'moderate'} />
                {selectedMood === 'moderate' && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#438990] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-[#184F54]">
                {cur.moderateTitle}
              </span>
              <span className="text-[9.5px] text-[#737264] line-clamp-1 mt-0.5 hidden sm:block">
                {cur.moderateDesc}
              </span>
              <span className="mt-1.5 text-[9px] font-bold bg-[#EDF7F8] border border-[#7FB3B8] text-[#184F54] px-2 py-0.5 rounded-full flex items-center gap-1">
                <MessageSquareText className="w-2.5 h-2.5" />
                {cur.moderateDestBadge}
              </span>
            </button>

            {/* Frustrated Card */}
            <button
              type="button"
              onClick={() => handleMoodSelect('frustrated')}
              className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 cursor-pointer border-2 relative ${
                selectedMood === 'frustrated'
                  ? 'bg-[#FDF0F3] border-[#CE4C64] shadow-md ring-2 ring-[#CE4C64]/30 scale-[1.02]'
                  : 'bg-white hover:bg-[#FFF5F7] border-[#F5C2CB] shadow-2xs hover:scale-[1.01]'
              }`}
            >
              <div className="relative mb-1">
                <MoodCharacter mood="frustrated" size={42} selected={selectedMood === 'frustrated'} />
                {selectedMood === 'frustrated' && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#CE4C64] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-[#872132]">
                {cur.frustratedTitle}
              </span>
              <span className="text-[9.5px] text-[#737264] line-clamp-1 mt-0.5 hidden sm:block">
                {cur.frustratedDesc}
              </span>
              <span className="mt-1.5 text-[9px] font-bold bg-[#FDF0F3] border border-[#F47C91] text-[#872132] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Palette className="w-2.5 h-2.5" />
                {cur.frustratedDestBadge}
              </span>
            </button>
          </div>

          {/* STEP 2: COMMON PROBLEMS (SAME ACROSS ALL MOODS, MULTI-SELECT) */}
          <div className="bg-[#FAF6EC] border border-[#ECE7D4] rounded-2xl p-3.5 sm:p-4 mb-4 transition-all duration-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold tracking-tight ${theme.accentText}`}>
                {cur.commonProblemsHeading}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#ECE7D4] text-[#555447]">
                  {selectedProblemIds.length} {cur.selectedCount}
                </span>
                {selectedProblemIds.length < COMMON_PROBLEMS_LIST.length ? (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[10px] font-semibold text-[#6F8D45] hover:underline cursor-pointer"
                  >
                    {cur.selectAll}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[10px] font-semibold text-[#8C8A7B] hover:underline cursor-pointer"
                  >
                    {cur.clearAll}
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-[#737264] mb-2.5">
              {cur.commonProblemsSub}
            </p>

            {/* Multi-Select Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_PROBLEMS_LIST.map((p) => {
                const isSelected = selectedProblemIds.includes(p.id);
                const label = lang === 'fr' ? p.fr : lang === 'derja' ? p.derja : p.en;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProblem(p.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? theme.chipActive
                        : 'bg-white hover:bg-[#F2EDE0] text-[#2D2C25] border-[#DDD6C0] shadow-2xs'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
                        isSelected
                          ? theme.chipCheck
                          : 'border border-[#C5BFAD] text-transparent'
                      }`}
                    >
                      <Check className={`w-2.5 h-2.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    </span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Optional Custom Detail Input */}
            <input
              type="text"
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              placeholder={cur.customDetailPlaceholder}
              className="w-full bg-white border border-[#DDD6C0] rounded-xl px-3 py-2 text-xs text-[#202019] placeholder:text-[#8C8A7B] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]/40 transition-all shadow-2xs"
            />
          </div>

          {/* STEP 3: DESTINATION CHOICE & PROCEED BUTTON (HOME, CHATBOT, PAINT) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[#555447] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#6F8D45]" />
                {cur.destinationLabel}
              </span>
              <span className="text-[10px] text-[#8C8A7B]">
                {cur.destinationHint}
              </span>
            </div>

            {/* 3 Destinations: Home, Chatbot, Paint */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDestination('home')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  destination === 'home'
                    ? 'bg-[#3D5834] text-white border-[#2B3E1F] shadow-sm ring-1 ring-[#6F8D45]/40'
                    : 'bg-white hover:bg-[#F9F7EF] text-[#555447] border-[#ECE7D4]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>{cur.destinations.home.name}</span>
              </button>

              <button
                type="button"
                onClick={() => setDestination('chatbot')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  destination === 'chatbot'
                    ? 'bg-[#184F54] text-white border-[#0E3236] shadow-sm ring-1 ring-[#438990]/40'
                    : 'bg-white hover:bg-[#F9F7EF] text-[#555447] border-[#ECE7D4]'
                }`}
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>{cur.destinations.chatbot.name}</span>
              </button>

              <button
                type="button"
                onClick={() => setDestination('paint')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  destination === 'paint'
                    ? 'bg-[#872132] text-white border-[#540F1B] shadow-sm ring-1 ring-[#CE4C64]/40'
                    : 'bg-white hover:bg-[#F9F7EF] text-[#555447] border-[#ECE7D4]'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{cur.destinations.paint.name}</span>
              </button>
            </div>

            {/* Main PROCEED Button */}
            <button
              type="button"
              onClick={handleProceed}
              className="w-full bg-[#1C1C17] hover:bg-black text-white text-xs sm:text-sm font-bold py-3.5 px-4 sm:px-5 rounded-2xl shadow-md flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99] mt-2"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="truncate font-semibold">
                  {cur.destinations[destination].action}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 group-hover:text-white flex-shrink-0 ml-2">
                <span>{cur.proceedBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <p className="text-[10px] text-center text-[#8C8A7B]">
              {cur.destinations[destination].hint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
