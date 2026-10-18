import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Sparkles, Moon, Activity, Feather, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MascotBrain } from '../mascots/MascotBrain';
import { MoodCharacter } from '../mascots/MoodCharacters';
import { MotivationalSlider } from '../common/MotivationalSlider';
import { MOOD_DEFINITIONS } from '../../utils/translations';
import { MoodType } from '../../types';
import { getCommonProblems } from '../../data/commonProblems';

export const DashboardScreen: React.FC = () => {
  const {
    userName,
    currentMood,
    setCurrentMood,
    mindText,
    setMindText,
    addCheckIn,
    openAiModal,
    setActiveScreen,
    historyEntries,
    openWelcomeModal,
    language,
    t
  } = useApp();

  const [inputVal, setInputVal] = useState(mindText);
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);

  const toggleProblemSelection = (p: { id: string; label: string }) => {
    setSelectedProblemIds((prev) => {
      const next = prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id];
      const allProblems = getCommonProblems(currentMood, language);
      const labels = allProblems.filter((item) => next.includes(item.id)).map((item) => item.label);
      const combined = labels.join(', ');
      setInputVal(combined);
      setMindText(combined);
      return next;
    });
  };

  const moodList: MoodType[] = ['calm', 'moderate', 'focused', 'anxious', 'frustrated', 'sad', 'overwhelmed'];

  const handleMoodSelect = (mood: MoodType) => {
    setCurrentMood(mood);
    addCheckIn(mood, inputVal.trim() ? inputVal.trim() : undefined);

    if (mood === 'frustrated') {
      // Frustrated routes to paint canvas
      setActiveScreen('paint');
    } else if (mood === 'moderate') {
      // Moderate routes to chatbot to express feeling
      const prompt = t.mindPlaceholder || "I'm feeling in-between or moderate today. I'd like to express what's on my mind.";
      openAiModal(prompt);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setMindText(inputVal);
      addCheckIn(currentMood, inputVal);
      openAiModal(inputVal);
    } else {
      openAiModal();
    }
  };

  // Compute dynamic insight based on real history
  const tenseCount = historyEntries.filter(e => e.mood === 'anxious' || e.mood === 'frustrated' || e.mood === 'overwhelmed').length;
  const hasHistory = historyEntries.length > 0;

  const dynamicInsight = hasHistory && tenseCount >= 3
    ? t.insightSample
    : "Welcome to Nefes. Whenever college gets demanding, we're here to break it into small, doable steps.";

  return (
    <div className="w-full max-w-md mx-auto pb-32 pt-2 px-5 font-sans select-none animate-fadeIn">
      {/* Top Status & Profile Bar */}
      <header className="flex items-center justify-between pt-1 pb-4">
        <div>
          <p className="text-sm text-[#737264] font-medium flex items-center gap-1.5">
            {t.greeting}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#202019] mt-0.5">
            {t.feelingQuestion}
          </h1>
        </div>
        
        {/* Profile Avatar */}
        <div className="relative group cursor-pointer" onClick={() => setActiveScreen('settings')}>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-[#6F8D45]/30">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Emma profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#A8BC78] border-2 border-white rounded-full" />
        </div>
      </header>

      {/* Mood Input Pill */}
      <form onSubmit={handleInputSubmit} className="relative mt-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            setMindText(e.target.value);
          }}
          placeholder={t.mindPlaceholder}
          className="w-full bg-white rounded-full py-4 pl-5 pr-14 text-sm font-medium text-[#202019] placeholder:text-[#A3A194] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]/40 transition-all"
        />
        <button
          type="submit"
          aria-label="Submit thought"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#3D5834] text-white flex items-center justify-center hover:bg-[#2B3E1F] active:scale-95 transition-all shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Your Mood Today Horizontal Carousel */}
      <section className="mt-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-semibold text-[#202019] tracking-tight">
            {t.moodToday}
          </h2>
          <span className="text-xs text-[#737264] font-medium">
            {MOOD_DEFINITIONS[currentMood]?.labelEn || 'Select'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-2 px-1">
          {moodList.map((mood) => {
            const isSelected = currentMood === mood;
            const meta = MOOD_DEFINITIONS[mood];

            return (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={`relative flex flex-col items-center p-1.5 rounded-2xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#6F8D45] ${
                  isSelected
                    ? 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] ring-2 ring-[#6F8D45]'
                    : 'hover:bg-white/60 active:scale-95'
                }`}
              >
                <MoodCharacter mood={mood} size={48} selected={isSelected} />
                <span className="text-[11px] font-medium text-[#555447] mt-1 line-clamp-1 max-w-[50px] text-center">
                  {meta.labelEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Most Common Problems under the Selected State (Pill Chips matching image.png) */}
        <div className="mt-3.5 pt-3 border-t border-[#ECE7D4]">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-[#555447] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6F8D45]" />
              {language === 'fr' ? 'Problèmes fréquents dans cet état :' : language === 'derja' ? 'Akther machakel mawjouda :' : 'Common problems in this state:'}
            </span>
            <span className="text-[10px] text-[#8C8A7B]">
              {selectedProblemIds.length > 0 ? `${selectedProblemIds.length} selected` : 'Select one or more'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 px-1">
            {getCommonProblems(currentMood, language).map((p) => {
              const isSelected = selectedProblemIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProblemSelection(p)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#3D5834] text-white border-[#2B3E1F] shadow-sm scale-[1.02]'
                      : 'bg-[#ECE6D8] hover:bg-[#DFD8C7] text-[#2D2C25] border-[#DDD6C0]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action bar when problems are selected */}
          {selectedProblemIds.length > 0 && (
            <div className="mt-2.5 px-1 flex items-center justify-between bg-white rounded-2xl p-2.5 border border-[#ECE7D4] shadow-xs animate-fadeIn">
              <div className="min-w-0 pr-2">
                <p className="text-[11px] font-bold text-[#202019] truncate">
                  Selected: "{inputVal}"
                </p>
                <p className="text-[10px] text-[#737264]">
                  Ready to explore or solve step-by-step
                </p>
              </div>
              <button
                type="button"
                onClick={() => openAiModal(inputVal, true, currentMood)}
                className="bg-[#1C1C17] hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-sm flex-shrink-0 cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-3 h-3 text-[#F8D45A]" />
                <span>Solve with AI</span>
                <ArrowRight className="w-3 h-3 text-white/80" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* A Small Insight Card */}
      <section className="mt-6">
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#EFEAD7] relative overflow-hidden">
          {/* Decorative subtle background tint */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F5F0D2]/40 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex items-start gap-4">
            {/* Mascot SVG */}
            <div className="flex-shrink-0 pt-0.5">
              <MascotBrain size="md" animated={true} />
            </div>

            {/* Insight Text */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737264] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F8D45A]" />
                {t.aSmallInsight}
              </div>
              <p className="text-[13px] leading-relaxed font-medium text-[#202019] mt-1.5">
                {dynamicInsight}
              </p>
            </div>
          </div>

          {/* Black Pill Action Button */}
          <button
            onClick={() => openAiModal()}
            className="w-full mt-4 bg-[#1C1C17] text-white hover:bg-black active:scale-[0.99] font-medium text-sm py-3.5 px-6 rounded-full shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span>{t.startQuickSession}</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* 5 Motivational Speeches Slider with Backend Actualize */}
      <MotivationalSlider />

      {/* For You Right Now Section */}
      <section className="mt-8">
        <h2 className="text-base font-semibold text-[#202019] mb-3 px-1 tracking-tight">
          {t.forYouRightNow}
        </h2>

        <div className="space-y-3">
          {/* Card 1: Breathe & reset */}
          <div
            onClick={() => setActiveScreen('breathing')}
            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#EFEAD7] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#E8E9AE]/50 border border-[#A8BC78]/40 flex items-center justify-center text-[#3D5834] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Feather className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#202019]">
                  {t.breatheAndReset}
                </h3>
                <p className="text-xs text-[#737264] mt-0.5">
                  {t.breatheDesc} • +5 💎
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A3A194] group-hover:text-[#202019] group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Card 2: Paint How You Feel */}
          <div
            onClick={() => setActiveScreen('paint')}
            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#EFEAD7] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#FDE8EC] border border-[#F47C91]/40 flex items-center justify-center text-[#D33F59] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#202019]">
                  Paint Your Idea
                </h3>
                <p className="text-xs text-[#737264] mt-0.5">
                  Expressive canvas & motivation • +5 💎
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A3A194] group-hover:text-[#202019] group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Card 3: AI Task Roadmap */}
          <div
            onClick={() => setActiveScreen('roadmap')}
            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#EFEAD7] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#EBF6FD] border border-[#39A9E8]/40 flex items-center justify-center text-[#155C82] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#202019]">
                  My Academic Roadmap
                </h3>
                <p className="text-xs text-[#737264] mt-0.5">
                  Turn heavy workloads into small steps • +10 💎
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A3A194] group-hover:text-[#202019] group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Card 4: Nefes Bloom Sanctuary */}
          <div
            onClick={() => setActiveScreen('garden')}
            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#EFEAD7] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#F5F0D2] border border-[#D8A922]/40 flex items-center justify-center text-[#825C08] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Moon className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#202019]">
                  Nefes Bloom Sanctuary
                </h3>
                <p className="text-xs text-[#737264] mt-0.5">
                  Spend diamonds on blooms & grow at your own pace
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A3A194] group-hover:text-[#202019] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </section>
    </div>
  );
};
