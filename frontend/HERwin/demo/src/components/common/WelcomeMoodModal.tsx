import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  MessageSquareText,
  Home,
  ArrowRight,
  X,
  Check,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MoodCharacter } from '../mascots/MoodCharacters';
import { MascotBrain } from '../mascots/MascotBrain';
import { MoodType } from '../../types';
import { getCommonProblems } from '../../data/commonProblems';

interface WelcomeMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DestinationType = 'home' | 'chatbot' | 'paint';

export const WelcomeMoodModal: React.FC<WelcomeMoodModalProps> = ({ isOpen, onClose }) => {
  const {
    currentMood,
    setCurrentMood,
    setActiveScreen,
    setMindText,
    openAiModal,
    addCheckIn,
    language
  } = useApp();

  // Selected mood state: 'calm' | 'moderate' | 'frustrated'
  const [selectedState, setSelectedState] = useState<'calm' | 'moderate' | 'frustrated'>(() => {
    if (currentMood === 'frustrated') return 'frustrated';
    if (currentMood === 'calm') return 'calm';
    return 'moderate';
  });

  // Target screen destination (defaults automatically to the mood's matched screen)
  const [destination, setDestination] = useState<DestinationType>(() => {
    if (currentMood === 'frustrated') return 'paint';
    if (currentMood === 'calm') return 'home';
    return 'chatbot';
  });

  // Multiple problem selection state
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>(['mod_rev']);
  const [customDetail, setCustomDetail] = useState<string>('');

  if (!isOpen) return null;

  const labels = {
    en: {
      tag: "Welcome to Nefes",
      title: "How are you feeling right now?",
      subtitle: "Select your current mood to personalize your session:",
      calmTitle: "Calm",
      calmDesc: "Peaceful & steady",
      calmDestBadge: "Home",
      moderateTitle: "Moderate",
      moderateDesc: "Reflective & in-between",
      moderateDestBadge: "Chatbot",
      frustratedTitle: "Frustrated",
      frustratedDesc: "Tense or overwhelmed",
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
      closeLabel: "I'll choose later",
      destinations: {
        home: {
          name: "Home",
          action: "Proceed to Home",
          hint: "Motivational speeches, calendar & gentle routine"
        },
        chatbot: {
          name: "Chatbot",
          action: "Proceed to Chatbot",
          hint: "Express feelings & get step-by-step guidance from AI"
        },
        paint: {
          name: "Paint",
          action: "Proceed to Paint",
          hint: "Express yourself freely on the creative canvas"
        }
      }
    },
    fr: {
      tag: "Bienvenue sur Nefes",
      title: "Comment te sens-tu en ce moment ?",
      subtitle: "Choisis ton humeur pour orienter ta séance :",
      calmTitle: "Calme",
      calmDesc: "Paisible & sereine",
      calmDestBadge: "Accueil",
      moderateTitle: "Modéré",
      moderateDesc: "Partagée & pensive",
      moderateDestBadge: "Chatbot",
      frustratedTitle: "Frustrée",
      frustratedDesc: "Tendue ou bloquée",
      frustratedDestBadge: "Peinture",
      commonProblemsHeading: "Qu'est-ce qui te préoccupe ?",
      commonProblemsSub: "Choisis une ou plusieurs difficultés du moment :",
      selectedCount: "sélectionné(s)",
      selectAll: "Tout choisir",
      clearAll: "Effacer",
      customDetailPlaceholder: "+ Ajouter une précision ou matière (optionnel)...",
      destinationLabel: "Destination suivante :",
      destinationHint: "Adapté à ton humeur",
      proceedBtn: "Continuer",
      closeLabel: "Je choisirai plus tard",
      destinations: {
        home: {
          name: "Accueil",
          action: "Continuer vers l'Accueil",
          hint: "Discours motivants, calendrier et rythme doux"
        },
        chatbot: {
          name: "Chatbot",
          action: "Continuer vers le Chatbot",
          hint: "Exprime tes sentiments et reçois un plan pas-à-pas"
        },
        paint: {
          name: "Peinture",
          action: "Continuer vers le Tableau",
          hint: "Libère tes idées et émotions sur la toile créative"
        }
      }
    },
    derja: {
      tag: "Mar7ba bik fi Nefes",
      title: "Kifech 7assa rou7ek tawa ?",
      subtitle: "Ekhtar jawwek bech n3awnouk b tari9a mwef9a :",
      calmTitle: "Hédi / ريّق",
      calmDesc: "Merta7 w reka7",
      calmDestBadge: "Ed-dar",
      moderateTitle: "3adi / معتدل",
      moderateDesc: "Fi nos thniya",
      moderateDestBadge: "Chatbot",
      frustratedTitle: "Faddit / فادد",
      frustratedDesc: "Mtawter wala bloqué",
      frustratedDestBadge: "Lawwen",
      commonProblemsHeading: "Chnouwa eli m9al9ek tawa ?",
      commonProblemsSub: "Tnajjem tekhtar mochkla wala akther men mochkla fard wa9t :",
      selectedCount: "moukhadad",
      selectAll: "Ekhtar el koll",
      clearAll: "Fassa5",
      customDetailPlaceholder: "+ Zid fekra wala esm el module (ikhtiyari)...",
      destinationLabel: "Fin theb tkammel :",
      destinationHint: "Mwafe9 m3a jawwek",
      proceedBtn: "Kammel / واصل",
      closeLabel: "Taw nekhtar ba3d",
      destinations: {
        home: {
          name: "Ed-dar",
          action: "Kammel l'Ed-dar",
          hint: "Klem mchajja3, calendrier w jaw merta7"
        },
        chatbot: {
          name: "Chatbot",
          action: "Kammel lel Chatbot",
          hint: "Faragh 9albek w 5odh khotowat sahla mel AI"
        },
        paint: {
          name: "Lawwen",
          action: "Kammel l'Espace Lawwen",
          hint: "Lawwen w rassem fekretk bech tfarragh mokhek"
        }
      }
    }
  };

  const cur = labels[language] || labels.en;
  const currentProblems = getCommonProblems(selectedState as MoodType, language);

  // Switch mood state and automatically pair the recommended destination
  const handlePickState = (state: 'calm' | 'moderate' | 'frustrated') => {
    setSelectedState(state);
    const problems = getCommonProblems(state as MoodType, language);
    if (problems.length > 0) {
      setSelectedProblemIds([problems[0].id]);
    } else {
      setSelectedProblemIds([]);
    }

    if (state === 'calm') {
      setDestination('home');
    } else if (state === 'moderate') {
      setDestination('chatbot');
    } else if (state === 'frustrated') {
      setDestination('paint');
    }
  };

  // Toggle problem pill selection (Multi-select)
  const toggleProblem = (problemId: string) => {
    setSelectedProblemIds((prev) => {
      if (prev.includes(problemId)) {
        return prev.filter((id) => id !== problemId);
      } else {
        return [...prev, problemId];
      }
    });
  };

  // Select all problems for current mood
  const handleSelectAll = () => {
    setSelectedProblemIds(currentProblems.map((p) => p.id));
  };

  // Clear all problem selections
  const handleClearAll = () => {
    setSelectedProblemIds([]);
  };

  // Main Proceed action replacing "Send to AI"
  const handleProceed = () => {
    const activeMood = selectedState;
    const selectedList = currentProblems.filter((p) => selectedProblemIds.includes(p.id));

    let summaryText = selectedList.map((p) => p.label).join(', ');
    if (!summaryText) {
      summaryText = `Feeling ${activeMood}`;
    }
    if (customDetail.trim()) {
      summaryText += ` (${customDetail.trim()})`;
    }

    setCurrentMood(activeMood as MoodType);
    addCheckIn(activeMood as MoodType, `Initial check-in: ${summaryText}`);
    localStorage.setItem('nefes_welcome_mood_picked', 'true');
    onClose();

    if (destination === 'chatbot') {
      // Direct to AI Chatbot session populated with selected struggles
      openAiModal(summaryText, true, activeMood as MoodType);
    } else if (destination === 'paint') {
      // Direct to Paint Screen
      setMindText(summaryText);
      setActiveScreen('paint');
    } else {
      // Direct to Home Dashboard
      setMindText(summaryText);
      setActiveScreen('home');
    }
  };

  // Dynamic theme colors per mood
  const moodTheme = {
    calm: {
      activeBorder: 'border-[#6F8D45]',
      activeBg: 'bg-[#F4F8EC]',
      activeRing: 'ring-2 ring-[#6F8D45]/30',
      activeBadge: 'bg-[#6F8D45]',
      chipActiveBg: 'bg-[#3D5834] text-white border-[#2B3E1F] shadow-xs',
      chipCheckBadge: 'bg-white/20 text-white',
      accentText: 'text-[#3D5834]'
    },
    moderate: {
      activeBorder: 'border-[#438990]',
      activeBg: 'bg-[#EDF7F8]',
      activeRing: 'ring-2 ring-[#438990]/30',
      activeBadge: 'bg-[#438990]',
      chipActiveBg: 'bg-[#184F54] text-white border-[#0E3236] shadow-xs',
      chipCheckBadge: 'bg-white/20 text-white',
      accentText: 'text-[#184F54]'
    },
    frustrated: {
      activeBorder: 'border-[#CE4C64]',
      activeBg: 'bg-[#FDF0F3]',
      activeRing: 'ring-2 ring-[#CE4C64]/30',
      activeBadge: 'bg-[#CE4C64]',
      chipActiveBg: 'bg-[#872132] text-white border-[#540F1B] shadow-xs',
      chipCheckBadge: 'bg-white/20 text-white',
      accentText: 'text-[#872132]'
    }
  }[selectedState];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn font-sans">
      <div className="bg-[#FFFDF7] rounded-3xl w-full max-w-lg max-h-[94vh] overflow-y-auto shadow-2xl border border-[#ECE7D4] relative p-5 sm:p-6 text-[#202019]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#555447] transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot & Welcome Header */}
        <div className="text-center mb-4 pt-1">
          <div className="flex justify-center mb-2">
            <MascotBrain size="md" animated={true} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F8D45] flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F8D45A]" />
            {cur.tag}
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-[#202019] mt-0.5">
            {cur.title}
          </h2>
          <p className="text-xs text-[#737264] mt-0.5 max-w-sm mx-auto">
            {cur.subtitle}
          </p>
        </div>

        {/* STEP 1: MOOD SELECTION (3 Options) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {/* Card 1: Calm */}
          <button
            type="button"
            onClick={() => handlePickState('calm')}
            className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 cursor-pointer border-2 relative ${
              selectedState === 'calm'
                ? 'bg-[#F4F8EC] border-[#6F8D45] shadow-md ring-2 ring-[#6F8D45]/30 scale-[1.02]'
                : 'bg-white hover:bg-[#F9FBF5] border-[#D9E3C5] shadow-2xs hover:scale-[1.01]'
            }`}
          >
            <div className="relative mb-1">
              <MoodCharacter mood="calm" size={44} selected={selectedState === 'calm'} />
              {selectedState === 'calm' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6F8D45] text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-[#3D5834]">
              {cur.calmTitle}
            </span>
            <span className="text-[10px] text-[#737264] line-clamp-1 mt-0.5 hidden sm:block">
              {cur.calmDesc}
            </span>
            <span className="mt-1.5 text-[9px] font-bold bg-[#E8E9AE] text-[#3D5834] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Home className="w-2.5 h-2.5" />
              {cur.calmDestBadge}
            </span>
          </button>

          {/* Card 2: Moderate */}
          <button
            type="button"
            onClick={() => handlePickState('moderate')}
            className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 cursor-pointer border-2 relative ${
              selectedState === 'moderate'
                ? 'bg-[#EDF7F8] border-[#438990] shadow-md ring-2 ring-[#438990]/30 scale-[1.02]'
                : 'bg-white hover:bg-[#F2FBFC] border-[#C8E0E2] shadow-2xs hover:scale-[1.01]'
            }`}
          >
            <div className="relative mb-1">
              <MoodCharacter mood="moderate" size={44} selected={selectedState === 'moderate'} />
              {selectedState === 'moderate' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#438990] text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-[#184F54]">
              {cur.moderateTitle}
            </span>
            <span className="text-[10px] text-[#737264] line-clamp-1 mt-0.5 hidden sm:block">
              {cur.moderateDesc}
            </span>
            <span className="mt-1.5 text-[9px] font-bold bg-[#EDF7F8] border border-[#7FB3B8] text-[#184F54] px-2 py-0.5 rounded-full flex items-center gap-1">
              <MessageSquareText className="w-2.5 h-2.5" />
              {cur.moderateDestBadge}
            </span>
          </button>

          {/* Card 3: Frustrated */}
          <button
            type="button"
            onClick={() => handlePickState('frustrated')}
            className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 cursor-pointer border-2 relative ${
              selectedState === 'frustrated'
                ? 'bg-[#FDF0F3] border-[#CE4C64] shadow-md ring-2 ring-[#CE4C64]/30 scale-[1.02]'
                : 'bg-white hover:bg-[#FFF5F7] border-[#F5C2CB] shadow-2xs hover:scale-[1.01]'
            }`}
          >
            <div className="relative mb-1">
              <MoodCharacter mood="frustrated" size={44} selected={selectedState === 'frustrated'} />
              {selectedState === 'frustrated' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#CE4C64] text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-[#872132]">
              {cur.frustratedTitle}
            </span>
            <span className="text-[10px] text-[#737264] line-clamp-1 mt-0.5 hidden sm:block">
              {cur.frustratedDesc}
            </span>
            <span className="mt-1.5 text-[9px] font-bold bg-[#FDF0F3] border border-[#F47C91] text-[#872132] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Palette className="w-2.5 h-2.5" />
              {cur.frustratedDestBadge}
            </span>
          </button>
        </div>

        {/* STEP 2: COMMON PROBLEMS (PLACED AFTER MOOD SELECTION WITH MULTI-SELECT) */}
        <div className="bg-[#FAF6EC] border border-[#ECE7D4] rounded-2xl p-4 transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${moodTheme.accentText}`}>
              <Sparkles className="w-3.5 h-3.5 text-[#F8D45A]" />
              {cur.commonProblemsHeading}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#ECE7D4] text-[#555447]">
                {selectedProblemIds.length} {cur.selectedCount}
              </span>
              {selectedProblemIds.length < currentProblems.length ? (
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

          <p className="text-[11px] text-[#737264] mb-3">
            {cur.commonProblemsSub}
          </p>

          {/* Multi-Select Common Problem Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {currentProblems.map((p) => {
              const isSelected = selectedProblemIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProblem(p.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? moodTheme.chipActiveBg
                      : 'bg-white hover:bg-[#F2EDE0] text-[#2D2C25] border-[#DDD6C0] shadow-2xs'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
                      isSelected
                        ? moodTheme.chipCheckBadge
                        : 'border border-[#C5BFAD] text-transparent'
                    }`}
                  >
                    <Check className={`w-2.5 h-2.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </span>
                  <span>{p.label}</span>
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
            className="w-full bg-white border border-[#DDD6C0] rounded-xl px-3 py-2 text-xs text-[#202019] placeholder:text-[#8C8A7B] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]/40 transition-all"
          />
        </div>

        {/* STEP 3: DESTINATION CHOICE & PROCEED BUTTON (REPLACING "SEND TO AI") */}
        <div className="mt-4 pt-1 space-y-2.5">
          {/* Destination Switcher Row */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-[#555447] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#6F8D45]" />
              {cur.destinationLabel}
            </span>
            <span className="text-[10px] text-[#8C8A7B]">
              {cur.destinationHint}
            </span>
          </div>

          {/* 3 Destination options (Home, Chatbot, Paint) */}
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
            className="w-full bg-[#1C1C17] hover:bg-black text-white text-xs sm:text-sm font-bold py-3 px-4 sm:px-5 rounded-2xl shadow-md flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99] mt-2"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-[#A8BC78] animate-pulse flex-shrink-0" />
              <span className="truncate">
                {cur.destinations[destination].action}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-300 group-hover:text-white flex-shrink-0 ml-2">
              <span>{cur.proceedBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Quick Subtitle Hint for Destination */}
          <p className="text-[10px] text-center text-[#8C8A7B]">
            {cur.destinations[destination].hint}
          </p>
        </div>

        {/* Bottom Helper Close */}
        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#8C8A7B] hover:text-[#202019] transition-colors cursor-pointer"
          >
            {cur.closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
