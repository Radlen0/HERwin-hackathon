import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Phone,
  Smile,
  Meh,
  Frown,
  Lightbulb,
  Check,
  Brain,
  HelpCircle,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MoodCharacter } from '../mascots/MoodCharacters';
import { MascotBrain } from '../mascots/MascotBrain';
import { AiPlan, CrisisPayload, AdaptedRecommendation, MoodType } from '../../types';
import { MOOD_DEFINITIONS } from '../../utils/translations';
import { getCommonProblems } from '../../data/commonProblems';

export const AiSessionModal: React.FC = () => {
  const {
    isAiModalOpen,
    closeAiModal,
    mindText,
    currentMood,
    setCurrentMood,
    language,
    setActiveScreen,
    rewardDiamond,
    aiAutoGenerate,
    setAiAutoGenerate,
    t
  } = useApp();

  // Input states
  const [userText, setUserText] = useState(mindText);
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood);
  const [energy, setEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [timeMinutes, setTimeMinutes] = useState<number>(5);
  const [supportStyle, setSupportStyle] = useState<'actionable' | 'gentle' | 'perspective'>('actionable');

  // Request & response states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plan, setPlan] = useState<AiPlan | null>(null);
  const [crisisData, setCrisisData] = useState<CrisisPayload | null>(null);
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  // Feedback adaptation state
  const [feedbackGiven, setFeedbackGiven] = useState<'better' | 'same' | 'worse' | null>(null);
  const [isAdapting, setIsAdapting] = useState<boolean>(false);
  const [adaptedResult, setAdaptedResult] = useState<AdaptedRecommendation | null>(null);

  // Core plan generation helper
  const executePlanGeneration = async (textToUse: string, moodToUse: MoodType) => {
    setIsLoading(true);
    setCrisisData(null);
    setPlan(null);
    setFeedbackGiven(null);
    setAdaptedResult(null);
    setCompletedActions({});

    try {
      const response = await fetch('/api/support-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: textToUse.trim(),
          mood: moodToUse,
          energy,
          timeMinutes,
          supportStyle,
          language
        })
      });

      const data = await response.json();

      if (data.isCrisis) {
        setCrisisData(data);
      } else if (data.plan) {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error('Error generating plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync and auto-generate if requested
  useEffect(() => {
    if (isAiModalOpen) {
      const initialText = mindText;
      setUserText(initialText);
      setSelectedMood(currentMood);

      if (aiAutoGenerate && initialText.trim()) {
        setAiAutoGenerate(false);
        executePlanGeneration(initialText, currentMood);
      }
    }
  }, [isAiModalOpen, mindText, currentMood, aiAutoGenerate]);

  if (!isAiModalOpen) return null;

  const handleGeneratePlan = async () => {
    await executePlanGeneration(userText, selectedMood);
  };

  const toggleActionComplete = (index: number) => {
    setCompletedActions(prev => {
      const nextVal = !prev[index];
      if (nextVal && plan?.actions[index]) {
        rewardDiamond(10, `Completed action: ${plan.actions[index].title}`, 'study_task', `session-act-${index}-${Date.now()}`);
      }
      return { ...prev, [index]: nextVal };
    });
  };

  const handleFeedback = async (choice: 'better' | 'same' | 'worse') => {
    setFeedbackGiven(choice);
    setIsAdapting(true);

    // Reward for completing reflection
    rewardDiamond(5, 'Completed post-session reflection', 'reflection', `session-ref-${Date.now()}`);

    try {
      const response = await fetch('/api/adapt-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPlan: plan,
          feedback: choice,
          language
        })
      });

      const data = await response.json();
      setAdaptedResult(data);
    } catch (err) {
      console.error('Failed to adapt session:', err);
    } finally {
      setIsAdapting(false);
    }
  };

  const commonProblems = getCommonProblems(selectedMood, language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FFFDF7] rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl border border-[#ECE7D4] relative p-5 sm:p-7 font-sans text-[#202019]">
        {/* Close Button */}
        <button
          onClick={closeAiModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#555447] transition-all cursor-pointer z-20"
          aria-label="Close session"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. CRISIS SAFETY VIEW */}
        {crisisData && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-700 bg-rose-50 p-4 rounded-2xl border border-rose-200 mb-4">
              <ShieldAlert className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Nefes Safety Check</h3>
                <p className="text-xs mt-0.5 leading-relaxed">
                  {crisisData.crisisMessage?.[language] || crisisData.crisisMessage?.en}
                </p>
              </div>
            </div>

            <h4 className="text-sm font-bold text-[#202019] mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              Verified Support Contacts in Tunisia
            </h4>

            <div className="space-y-2.5 mb-5">
              {crisisData.contacts.map((contact, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-3 border border-[#E8E4D3] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#202019]">{contact.name}</p>
                    <p className="text-[11px] text-[#737264]">{contact.description}</p>
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="bg-[#3D5834] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#2B3E1F] flex items-center gap-1 shadow-sm"
                  >
                    <Phone className="w-3 h-3" />
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-[#F8F5E4] rounded-2xl p-4 border border-[#ECE7D4]">
              <p className="text-xs font-semibold text-[#555447] mb-2">Gentle Immediate Steps:</p>
              <ul className="text-xs text-[#202019] space-y-1.5 list-disc pl-4">
                {crisisData.safeSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 2. INITIAL CONTEXT INPUT VIEW */}
        {!crisisData && !plan && !isLoading && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <MascotBrain size="sm" animated={false} />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6F8D45]">
                  AI Adaptive Companion
                </span>
                <h3 className="text-xl font-bold text-[#202019]">
                  Find context & solve the problem
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#737264] mb-3">
              Pick a common struggle or describe what feels heavy. Nefes will uncover the root context and provide a personalized resolution.
            </p>

            {/* Common Student Problem Pills matching image.png */}
            <div className="mb-3">
              <span className="text-[11px] font-bold text-[#555447] block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#6F8D45]" />
                Most common problems for {selectedMood}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commonProblems.map((p) => {
                  const isSelected = userText === p.label;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setUserText(p.label)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#3D5834] text-white border-[#2B3E1F] shadow-sm'
                          : 'bg-[#ECE6D8] hover:bg-[#DFD8C7] text-[#2D2C25] border-[#DDD6C0]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Situation Input Area */}
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="What feels heavy right now? (Supports English, Français, or Tounsi Derja)..."
              rows={3}
              className="w-full bg-white rounded-2xl p-3.5 text-xs text-[#202019] placeholder:text-[#A3A194] border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45] mb-3 resize-none shadow-xs"
            />

            {/* Quick Context Selectors */}
            <div className="space-y-3 mb-5">
              {/* Mood Selector */}
              <div>
                <label className="text-xs font-bold text-[#555447] block mb-1.5">
                  Your Current State:
                </label>
                <div className="flex items-center justify-between gap-1">
                  {(['calm', 'moderate', 'focused', 'anxious', 'frustrated', 'sad', 'overwhelmed'] as MoodType[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMood(m)}
                      title={m}
                      className={`p-1 rounded-xl transition-all ${
                        selectedMood === m ? 'bg-[#F5F0D2] ring-2 ring-[#6F8D45]' : 'hover:bg-neutral-100 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <MoodCharacter mood={m} size={30} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy & Time Available */}
              <div className="grid grid-cols-2 gap-3">
                {/* Energy Level */}
                <div>
                  <label className="text-xs font-bold text-[#555447] block mb-1.5">
                    Energy Level
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['low', 'medium', 'high'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEnergy(lvl)}
                        className={`text-xs py-1.5 rounded-xl font-semibold capitalize transition-all ${
                          energy === lvl ? 'bg-[#3D5834] text-white shadow-xs' : 'bg-white border border-[#ECE7D4] text-[#555447]'
                        }`}
                      >
                        {lvl === 'low' ? '🪫 Low' : lvl === 'medium' ? '🔋 Mid' : '⚡ High'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Available */}
                <div>
                  <label className="text-xs font-bold text-[#555447] block mb-1.5">
                    Time Available
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[3, 5, 10].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setTimeMinutes(mins)}
                        className={`text-xs py-1.5 rounded-xl font-semibold transition-all ${
                          timeMinutes === mins ? 'bg-[#3D5834] text-white shadow-xs' : 'bg-white border border-[#ECE7D4] text-[#555447]'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action Button */}
            <button
              onClick={handleGeneratePlan}
              className="w-full bg-[#1C1C17] text-white py-3.5 rounded-full font-bold text-sm shadow-md hover:bg-black active:scale-[0.99] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F8D45A]" />
              <span>Analyze context & solve with AI</span>
            </button>
          </div>
        )}

        {/* 3. LOADING STATE */}
        {isLoading && (
          <div className="py-12 text-center animate-fadeIn">
            <div className="flex justify-center mb-4">
              <MascotBrain size="lg" animated={true} />
            </div>
            <h4 className="text-base font-bold text-[#202019]">
              Nefes is analyzing the problem context...
            </h4>
            <p className="text-xs text-[#737264] mt-1 max-w-xs mx-auto">
              Unpacking root triggers, normalizing the cognitive pressure, and building a calm micro-step plan.
            </p>
          </div>
        )}

        {/* 4. ACTIVE AI GENERATED PLAN VIEW */}
        {plan && !crisisData && (
          <div className="animate-fadeIn space-y-4">
            {/* Mascot Acknowledgment Header */}
            <div className="bg-white rounded-3xl p-4 border border-[#ECE7D4] shadow-xs flex items-start gap-3.5">
              <MascotBrain size="sm" animated={false} />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F8D45]">
                  {plan.support_type.replace('_', ' ')}
                </span>
                <p className="text-xs font-semibold text-[#202019] mt-0.5 leading-relaxed">
                  "{plan.acknowledgment}"
                </p>
              </div>
            </div>

            {/* NEW: Problem Context & Root Cause Card */}
            {plan.problem_context && (
              <div className="bg-[#FAF5E6] rounded-3xl p-4 border border-[#ECE0BE] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#825C08] flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-[#D8A922]" />
                    Understanding the Context
                  </span>
                  <span className="text-[10px] font-bold bg-[#EFEAD7] text-[#555447] px-2 py-0.5 rounded-full">
                    {plan.problem_context.core_trigger}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-[#3D5834] block">Why this happens:</span>
                    <p className="text-[#555447] leading-relaxed mt-0.5">
                      {plan.problem_context.why_it_happens}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#E8E1CB]">
                    <span className="font-bold text-[#825C08] block">Compassionate Insight:</span>
                    <p className="text-[#555447] italic leading-relaxed mt-0.5">
                      "{plan.problem_context.compassionate_insight}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* NEW: Solution Strategy Card */}
            {plan.solution_strategy && (
              <div className="bg-white rounded-3xl p-4 border border-[#ECE7D4] shadow-xs">
                <div className="flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-[#6F8D45]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#3D5834]">
                    How to Solve It Today
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-[#202019] block">Immediate Practical Fix:</span>
                    <p className="text-[#555447] leading-relaxed mt-0.5">
                      {plan.solution_strategy.immediate_fix}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#ECE7D4]">
                    <span className="font-bold text-[#202019] block">Mindset Shift:</span>
                    <p className="text-[#555447] leading-relaxed mt-0.5">
                      {plan.solution_strategy.mindset_shift}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Priority banner */}
            <div className="bg-[#F5F0D2] rounded-2xl p-3 border border-[#E8E4C4]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#825C08] block">
                Immediate Focal Point
              </span>
              <p className="text-xs font-bold text-[#3D5834] mt-0.5">
                {plan.priority}
              </p>
            </div>

            {/* Interactive Action Steps */}
            <div>
              <h4 className="text-xs font-bold text-[#737264] uppercase tracking-wider mb-2">
                Your Micro-Actions:
              </h4>

              <div className="space-y-2">
                {plan.actions.map((act, idx) => {
                  const isDone = completedActions[idx];

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-3 border transition-all ${
                        isDone
                          ? 'bg-[#E8E9AE]/30 border-[#A8BC78] opacity-80'
                          : 'bg-white border-[#ECE7D4] shadow-xs hover:border-[#6F8D45]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          onClick={() => toggleActionComplete(idx)}
                          className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                        >
                          <CheckCircle2
                            className={`w-5 h-5 flex-shrink-0 transition-colors ${
                              isDone ? 'text-[#6F8D45] fill-[#6F8D45]/20' : 'text-[#C5C3B6]'
                            }`}
                          />
                          <div>
                            <span className={`text-xs font-bold ${isDone ? 'line-through text-[#737264]' : 'text-[#202019]'}`}>
                              {act.title}
                            </span>
                            <p className="text-[11px] text-[#737264] mt-0.5">
                              {act.step_instruction}
                            </p>
                          </div>
                        </button>

                        <span className="text-[10px] font-bold bg-[#F8F5E4] text-[#555447] px-2 py-1 rounded-full flex-shrink-0">
                          {act.duration_minutes} min
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Activity card (e.g. quick breathing or grounding) */}
            {plan.reset_activity && (
              <div
                onClick={() => {
                  closeAiModal();
                  setActiveScreen('breathing');
                }}
                className="bg-gradient-to-r from-[#EBF6FD] to-[#FDF0F3] rounded-2xl p-3.5 border border-[#ECE7D4] flex items-center justify-between cursor-pointer hover:shadow-xs transition-all"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#155C82]">
                    Quick Grounding Activity
                  </span>
                  <p className="text-xs font-bold text-[#202019] mt-0.5">
                    {plan.reset_activity.title} ({plan.reset_activity.duration_minutes} min)
                  </p>
                  <p className="text-[11px] text-[#737264]">
                    {plan.reset_activity.guide_text}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#155C82]" />
              </div>
            )}

            {/* Culturally Relevant Encouragement */}
            {plan.culturally_relevant_encouragement && (
              <p className="text-center text-xs font-semibold text-[#6F8D45] italic">
                "{plan.culturally_relevant_encouragement}"
              </p>
            )}

            {/* 5. FEEDBACK LOOP: "Understand -> Personalize -> Act -> Receive Feedback -> Adapt" */}
            <div className="pt-3 border-t border-[#ECE7D4]">
              <p className="text-xs font-bold text-center text-[#555447] mb-2.5">
                {t.howAreYouNow}
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleFeedback('better')}
                  className={`py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    feedbackGiven === 'better'
                      ? 'bg-[#E8E9AE] border-[#A8BC78] text-[#202019]'
                      : 'bg-white border-[#ECE7D4] hover:bg-[#F8F5E4] text-[#555447]'
                  }`}
                >
                  <Smile className="w-4 h-4 text-emerald-600" />
                  <span>{t.feedbackBetter}</span>
                </button>

                <button
                  onClick={() => handleFeedback('same')}
                  className={`py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    feedbackGiven === 'same'
                      ? 'bg-[#F5F0D2] border-[#D8A922] text-[#202019]'
                      : 'bg-white border-[#ECE7D4] hover:bg-[#F8F5E4] text-[#555447]'
                  }`}
                >
                  <Meh className="w-4 h-4 text-amber-600" />
                  <span>{t.feedbackSame}</span>
                </button>

                <button
                  onClick={() => handleFeedback('worse')}
                  className={`py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    feedbackGiven === 'worse'
                      ? 'bg-rose-100 border-rose-300 text-rose-900'
                      : 'bg-white border-[#ECE7D4] hover:bg-rose-50 text-[#555447]'
                  }`}
                >
                  <Frown className="w-4 h-4 text-rose-600" />
                  <span>{t.feedbackWorse}</span>
                </button>
              </div>
            </div>

            {/* ADAPTED RECOMMENDATION DISPLAY */}
            {isAdapting && (
              <div className="text-center py-2 text-xs font-semibold text-[#737264] animate-pulse">
                Adapting your next path...
              </div>
            )}

            {adaptedResult && (
              <div className="bg-[#FAF7EE] rounded-3xl p-4 border border-[#ECE7D4] animate-scaleUp">
                <h5 className="text-xs font-bold text-[#202019]">
                  {adaptedResult.headline}
                </h5>
                <p className="text-xs text-[#555447] mt-1 leading-relaxed">
                  {adaptedResult.message}
                </p>

                <div className="mt-3 bg-white rounded-2xl p-3 border border-[#ECE7D4] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F8D45]">
                      Suggested next:
                    </span>
                    <p className="text-xs font-bold text-[#202019]">
                      {adaptedResult.recommendedNext.title}
                    </p>
                    <p className="text-[11px] text-[#737264]">
                      {adaptedResult.recommendedNext.actionDescription}
                    </p>
                  </div>

                  {adaptedResult.recommendedNext.targetScreen && (
                    <button
                      onClick={() => {
                        closeAiModal();
                        setActiveScreen(adaptedResult.recommendedNext.targetScreen as any);
                      }}
                      className="bg-[#1C1C17] text-white text-[11px] font-bold px-3 py-1.5 rounded-full hover:bg-black shadow-xs flex-shrink-0 cursor-pointer"
                    >
                      Go
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
