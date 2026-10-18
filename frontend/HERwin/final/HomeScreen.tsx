import React, { useCallback, useEffect, useState } from 'react';
import {
  MessageSquareText,
  Palette,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Compass,
  Wind,
  RefreshCw
} from 'lucide-react';
import { MascotBrain } from './components/mascots/MascotBrain';
import { InspirationalCarousel } from './components/InspirationalCarousel';
import { INSPIRATIONAL_MESSAGES, InspirationalMessage } from './data/inspirationalMessages';
import { fetchMotivationalSpeeches } from './services/backend';
import { MoodType, Language } from './types';

export interface HomeScreenProps {
  mood: MoodType;
  selectedProblems: string[];
  language: Language;
  onNavigateToChatbot: () => void;
  onNavigateToPaint: () => void;
  onNavigateToWelcome: () => void;
  onLanguageChange: (lang: Language) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  mood,
  selectedProblems,
  language,
  onNavigateToChatbot,
  onNavigateToPaint,
  onNavigateToWelcome,
  onLanguageChange
}) => {
  // Localized texts
  const t = {
    en: {
      brand: "MIRA",
      greeting: "Student Well-being",
      botIntroTitle: "Meet MiraAI",
      botIntroSubtitle: "Your quiet sounding board through university deadlines. Share what feels heavy, organize confusing lectures, and turn study anxiety into calm, manageable micro-steps.",
      botIntroAction: "Talk with MiraAI",
      currentFocusLabel: "Today's focus:",
      currentMoodPill: "Current Mood:",
      changeMood: "Change",
      inspirationsTitle: "Daily Reflection",
      inspirationsSubtitle: "3D interactive cards • Drag vertically or tap indicators to read",
      refreshInspirations: "Refresh inspirations",
      quickActionsTitle: "Spaces & Tools",
      quickActionsSubtitle: "Instant access to your well-being toolkit",
      chatbotCard: {
        tag: "Companion Chat",
        title: "Talk with MiraAI",
        desc: "Break down revision panic, unpack difficult lectures, and get tailored micro-actions.",
        btn: "Open Chat"
      },
      paintCard: {
        tag: "Creative Canvas",
        title: "Expressive Drawing Canvas",
        desc: "Release tension and clear your mind with expressive brush strokes and serene tones.",
        btn: "Open Canvas"
      },
      checkinCard: {
        tag: "Check-in",
        title: "Re-tune Mood & Struggles",
        desc: "Update how you feel or select new academic struggles from the welcome panel.",
        btn: "Update"
      },
      footerText: "Mira — Student Well-being Companion • Clean, Calm & University-Ready"
    },
    fr: {
      brand: "MIRA",
      greeting: "Bien-être Étudiant",
      botIntroTitle: "Découvrir MiraAI",
      botIntroSubtitle: "Ton espace de calme au cœur des études universitaires. Partage ce qui te pèse, structure tes révisions et avance par étapes douces et réalistes.",
      botIntroAction: "Parler avec MiraAI",
      currentFocusLabel: "Objectifs du jour :",
      currentMoodPill: "Humeur actuelle :",
      changeMood: "Modifier",
      inspirationsTitle: "Inspirations Quotidiennes",
      inspirationsSubtitle: "Cartes 3D interactives • Fais glisser verticalement pour lire",
      refreshInspirations: "Actualiser les inspirations",
      quickActionsTitle: "Espaces & Outils",
      quickActionsSubtitle: "Accède directement à tes outils de bien-être",
      chatbotCard: {
        tag: "Compagnon",
        title: "Parler avec MiraAI",
        desc: "Désamorce le stress des examens et reçois un plan de travail personnalisé et bienveillant.",
        btn: "Ouvrir le Chat"
      },
      paintCard: {
        tag: "Toile Créative",
        title: "Espace Peinture Libre",
        desc: "Libère la pression et dépose tes émotions en toute sérénité grâce aux couleurs.",
        btn: "Ouvrir la Toile"
      },
      checkinCard: {
        tag: "Point d'étape",
        title: "Réajuster mon humeur",
        desc: "Mets à jour ton état d'esprit ou sélectionne de nouveaux défis d'étude.",
        btn: "Modifier"
      },
      footerText: "Mira — Compagnon de bien-être étudiant • Serein, clair & adapté à l'université"
    },
    derja: {
      brand: "MIRA • ميرا",
      greeting: "Rtiye7 el Etudiant",
      botIntroTitle: "MiraAI Rfii9ak",
      botIntroSubtitle: "Blasset el rtiye7 w el hadwa fel 9raya. Farragh 9albek, 9assem khedmetk w na99es el stress m3a khotowat sahla w wadh7a.",
      botIntroAction: "Ahki m3a MiraAI",
      currentFocusLabel: "Machakel lyoum:",
      currentMoodPill: "Jawwek:",
      changeMood: "Baddel",
      inspirationsTitle: "Klem Mchajja3 w Rtiye7",
      inspirationsSubtitle: "Cartet 3D • Jarr el cartet l'fou9 w l'louta bech ta9ra",
      refreshInspirations: "Jadded el klem el mchajja3",
      quickActionsTitle: "Khidmet el App",
      quickActionsSubtitle: "Adkhol toul l'ay khidma theb 3liha",
      chatbotCard: {
        tag: "Rfii9ak",
        title: "T7addeth m3a MiraAI",
        desc: "Farragh 9albek, khodh khotowat sahla w 7ell 3o9det el revision.",
        btn: "Adkhol lel Chat"
      },
      paintCard: {
        tag: "Lawwen",
        title: "Espace Lawwen w Rassem",
        desc: "Lawwen w rassem fekretk bech tfarragh mokhek w tna99es el stress.",
        btn: "Adkhol l'Espace"
      },
      checkinCard: {
        tag: "Jawwek",
        title: "3awed ekhtar jawwek",
        desc: "Baddel el jaw mte3ek wala el machakel eli m9al9inek fel 9raya.",
        btn: "Baddel"
      },
      footerText: "Mira — Rfii9 el etudiant fel 9raya w el rtiye7"
    }
  }[language] || {
    brand: "MIRA",
    greeting: "Student Well-being",
    botIntroTitle: "Meet MiraAI",
    botIntroSubtitle: "Your quiet sounding board through university deadlines. Share what feels heavy, organize confusing lectures, and turn study anxiety into calm, manageable micro-steps.",
    botIntroAction: "Talk with MiraAI",
    currentFocusLabel: "Today's focus:",
    currentMoodPill: "Current Mood:",
    changeMood: "Change",
    inspirationsTitle: "Daily Reflection",
    inspirationsSubtitle: "3D interactive cards • Drag vertically or tap indicators to read",
    refreshInspirations: "Refresh inspirations",
    quickActionsTitle: "Spaces & Tools",
    quickActionsSubtitle: "Instant access to your well-being toolkit",
    chatbotCard: {
      tag: "Companion Chat",
      title: "Talk with MiraAI",
      desc: "Break down revision panic, unpack difficult lectures, and get tailored micro-actions.",
      btn: "Open Chat"
    },
    paintCard: {
      tag: "Creative Canvas",
      title: "Expressive Drawing Canvas",
      desc: "Release tension and clear your mind with expressive brush strokes and serene tones.",
      btn: "Open Canvas"
    },
    checkinCard: {
      tag: "Check-in",
      title: "Re-tune Mood & Struggles",
      desc: "Update how you feel or select new academic struggles from the welcome panel.",
      btn: "Update"
    },
    footerText: "Mira — Student Well-being Companion • Clean, Calm & University-Ready"
  };

  const [inspirations, setInspirations] = useState<InspirationalMessage[]>(INSPIRATIONAL_MESSAGES);
  const [isRefreshingInspirations, setIsRefreshingInspirations] = useState(false);

  const loadInspirations = useCallback(async () => {
    setIsRefreshingInspirations(true);
    try {
      const freshMessages = await fetchMotivationalSpeeches(language, mood);
      if (freshMessages.length > 0) {
        setInspirations(freshMessages);
      }
    } catch (err) {
      console.error('Failed to load inspirations from backend, keeping local set:', err);
    } finally {
      setIsRefreshingInspirations(false);
    }
  }, [language, mood]);

  useEffect(() => {
    loadInspirations();
  }, [loadInspirations]);

  return (
    <div className="min-h-screen w-full bg-[#FFF9E9] text-[#202019] font-sans selection:bg-[#E8E9AE] flex flex-col">
      {/* Top Header Bar */}
      <header className="w-full bg-[#FAF5E2] border-b border-[#ECE7D4] px-4 py-3 select-none flex-shrink-0 z-10 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-[#202019]">
              {t.brand}
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-medium text-[#737264] hidden sm:inline">
              {t.greeting}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Mood Badge */}
            <button
              onClick={onNavigateToWelcome}
              className="text-xs font-semibold bg-white border border-[#DDD6C0] text-[#3D5834] px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:bg-[#F9F7EF]"
              title="Update mood & struggles"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#5C7C3E]" />
              <span className="capitalize">{mood}</span>
            </button>

            {/* Language Dropdown */}
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="text-xs font-bold bg-white border border-[#DDD6C0] rounded-xl px-2.5 py-1 text-[#434237] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3D5834] shadow-2xs"
              aria-label="Select Language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="derja">تونسية</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Thoughtful, Human-Crafted Bot Introduction Pane (Anti-AI Slop) */}
        <section className="bg-[#FFFDF7] border border-[#ECE7D4] rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 max-w-2xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C7C3E]">
                {t.greeting}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-[11px] font-medium text-[#737264] capitalize">
                {mood} mode
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#202019] tracking-tight">
              {t.botIntroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#555447] mt-2 leading-relaxed">
              {t.botIntroSubtitle}
            </p>

            {/* Selected Struggles cleanly listed as unboxed text */}
            {selectedProblems.length > 0 && (
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 justify-center md:justify-start text-xs">
                <span className="text-[11px] font-semibold text-[#737264]">
                  {t.currentFocusLabel}
                </span>
                {selectedProblems.map((prob, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[11px] font-medium text-[#202019] bg-[#FAF5E2] border border-[#DDD6C0] px-2.5 py-0.5 rounded-lg"
                  >
                    {prob}
                  </span>
                ))}
              </div>
            )}

            {/* Direct conversation CTA button */}
            <div className="mt-4 flex justify-center md:justify-start">
              <button
                onClick={onNavigateToChatbot}
                className="inline-flex items-center gap-2 bg-[#1C1C17] hover:bg-black text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <MessageSquareText className="w-4 h-4 text-[#A8BC78]" />
                <span>{t.botIntroAction}</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-300" />
              </button>
            </div>
          </div>

          {/* Clean Mascot presentation */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FAF5E2] border border-[#ECE7D4] flex items-center justify-center shadow-2xs">
              <MascotBrain size="md" animated={false} />
            </div>
          </div>
        </section>

        {/* Responsive Grid: ON MOBILE, CAROUSEL IS IN FRONT DIRECTLY (order-1), FEATURE CARDS SECOND (order-2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CAROUSEL SECTION: Placed FIRST on mobile so it is directly in front when opening */}
          <section className="order-1 lg:order-2 lg:col-span-6 space-y-3">
            <div className="px-1 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#202019] tracking-tight">
                  {t.inspirationsTitle}
                </h2>
                <p className="text-xs text-[#737264] mt-0.5">
                  {t.inspirationsSubtitle}
                </p>
              </div>

              <button
                onClick={loadInspirations}
                disabled={isRefreshingInspirations}
                title={t.refreshInspirations}
                aria-label={t.refreshInspirations}
                className="w-8 h-8 rounded-full bg-white border border-[#DDD6C0] flex items-center justify-center text-[#555447] hover:bg-[#FAF5E2] disabled:opacity-50 transition-all cursor-pointer shadow-2xs flex-shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingInspirations ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* The 3D Vertical Dragging Carousel */}
            <div className="bg-[#FAF6EC] border border-[#ECE7D4] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col items-center">
              <InspirationalCarousel
                key={inspirations.map((item) => item.id).join('|')}
                messages={inspirations}
                language={language}
              />
            </div>
          </section>

          {/* FEATURE ACCESS CARDS: Placed SECOND on mobile (order-2), LEFT on desktop (order-1, 6 cols) */}
          <section className="order-2 lg:order-1 lg:col-span-6 space-y-3.5">
            <div className="px-1">
              <h2 className="text-base sm:text-lg font-black text-[#202019] tracking-tight">
                {t.quickActionsTitle}
              </h2>
              <p className="text-xs text-[#737264] mt-0.5">
                {t.quickActionsSubtitle}
              </p>
            </div>

            {/* Feature 1: MiraAI Chatbot Card */}
            <div
              onClick={onNavigateToChatbot}
              className="bg-[#FFFDF7] hover:bg-white border border-[#ECE7D4] hover:border-[#438990] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex items-start gap-4 active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EDF7F8] border border-[#7FB3B8] text-[#184F54] flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <MessageSquareText className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#438990]">
                    {t.chatbotCard.tag}
                  </span>
                  <span className="text-xs font-bold text-[#184F54] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {t.chatbotCard.btn}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#202019] mt-1 group-hover:text-[#184F54] transition-colors">
                  {t.chatbotCard.title}
                </h3>
                <p className="text-xs text-[#555447] mt-1 line-clamp-2 leading-relaxed">
                  {t.chatbotCard.desc}
                </p>
              </div>
            </div>

            {/* Feature 2: Paint Card */}
            <div
              onClick={onNavigateToPaint}
              className="bg-[#FFFDF7] hover:bg-white border border-[#ECE7D4] hover:border-[#CE4C64] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex items-start gap-4 active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDF0F3] border border-[#F47C91] text-[#872132] flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <Palette className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#CE4C64]">
                    {t.paintCard.tag}
                  </span>
                  <span className="text-xs font-bold text-[#872132] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {t.paintCard.btn}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#202019] mt-1 group-hover:text-[#872132] transition-colors">
                  {t.paintCard.title}
                </h3>
                <p className="text-xs text-[#555447] mt-1 line-clamp-2 leading-relaxed">
                  {t.paintCard.desc}
                </p>
              </div>
            </div>

            {/* Feature 3: Mood & Struggle Re-tune Card */}
            <div
              onClick={onNavigateToWelcome}
              className="bg-[#FAF5E2] hover:bg-[#F5EED2] border border-[#ECE7D4] rounded-3xl p-4.5 shadow-2xs transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#DDD6C0] text-[#3D5834] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <HeartHandshake className="w-5 h-5 text-[#5C7C3E]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#202019] group-hover:text-[#3D5834] transition-colors truncate">
                    {t.checkinCard.title}
                  </h4>
                  <p className="text-[11px] text-[#737264] truncate">
                    {t.checkinCard.desc}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#3D5834] flex items-center gap-1 flex-shrink-0 group-hover:translate-x-1 transition-transform">
                {t.checkinCard.btn}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </section>

        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full bg-[#FAF5E2] border-t border-[#ECE7D4] py-4 px-4 text-center text-xs text-[#8C8A7B] mt-auto">
        <p className="max-w-6xl mx-auto">
          {t.footerText}
        </p>
      </footer>
    </div>
  );
};

export default HomeScreen;
