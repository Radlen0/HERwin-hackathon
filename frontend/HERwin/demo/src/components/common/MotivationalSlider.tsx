import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Quote,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MotivationalSpeech } from '../../types';

interface MotivationalSliderProps {
  onSelectSpeech?: (speech: MotivationalSpeech) => void;
}

// Initial 5 speeches so the slider is immediately ready on render
const INITIAL_SLIDER_SPEECHES: Record<string, MotivationalSpeech[]> = {
  en: [
    {
      id: "speech-init-1",
      title: "The Power of Small Beginnings 🌱",
      speech: "Every breakthrough starts as a quiet, tentative step. You don't have to carry your entire semester or career all at once today. What you brought here is proof of your resilience. Trust your steady rhythm — one honest breath, one small action at a time.",
      quote: "Grow at your own pace. The bloom is already taking root.",
      category: "Gentle Resilience",
      authorOrTone: "Nefes Grounding"
    },
    {
      id: "speech-init-2",
      title: "Your Creative Inner Sanctuary ✨",
      speech: "Creative expression is a sacred space where deadlines, grades, and external expectations have zero authority. By giving yourself this pause, you honor your mind and spirit. Carry this clarity with you into whatever task comes next.",
      quote: "You don't have to solve everything today. Just take the next step.",
      category: "Creative Sanctuary",
      authorOrTone: "Self-Compassion"
    },
    {
      id: "speech-init-3",
      title: "Patience and Quiet Courage 🌸",
      speech: "A seed resting beneath the earth doesn't panic in the dark; it drinks the rain, drops roots deep, and surfaces when its season arrives. Offer yourself that same gentle patience. Every hour of study and every minute of rest matters.",
      quote: "Small consistent steps rebuild your calm.",
      category: "Patience",
      authorOrTone: "Inner Strength"
    },
    {
      id: "speech-init-4",
      title: "Recharging Your Academic Spark ⚡",
      speech: "When fatigue whispers that you aren't doing enough, remember that rest is not lost time; it is the fertilizer of clarity. You do not need a violent surge of motivation — only permission to breathe and restart with softness.",
      quote: "Rest is not lost time; it is the soil from which fresh brilliance grows.",
      category: "Energy Renewal",
      authorOrTone: "Mindful Focus"
    },
    {
      id: "speech-init-5",
      title: "Trusting Your Unique Path 🕊️",
      speech: "University culture often pushes everyone to fit identical molds, yet your genuine perspective and persistence are your greatest assets. Take pride in how far you've traveled already, and step forward with quiet confidence.",
      quote: "Honor your unique journey. You are blooming right on time.",
      category: "Self-Belief",
      authorOrTone: "Empowerment"
    }
  ],
  fr: [
    {
      id: "speech-init-fr-1",
      title: "La Force des Petits Commencements 🌱",
      speech: "Chaque grand accomplissement commence par une esquisse discrète. Tu n'as pas à résoudre tout le semestre aujourd'hui. Fais confiance à ton propre rythme, un pas à la fois. Tu avances déjà bien plus que tu ne l'imagines.",
      quote: "Grandis à ton propre rythme. Les bourgeons prennent déjà racine.",
      category: "Résilience Douce",
      authorOrTone: "Bienveillance"
    },
    {
      id: "speech-init-fr-2",
      title: "Ton Sanctuaire de Sérénité ✨",
      speech: "Prendre un instant pour exprimer tes idées et tes émotions te redonne le contrôle. Les notes et les examens ne définissent pas ta valeur humaine. Garde cette paix intérieure pour la suite de ta journée.",
      quote: "Tu n'as pas à tout résoudre aujourd'hui. Fais juste le prochain pas.",
      category: "Clarté Mentale",
      authorOrTone: "Sérénité"
    },
    {
      id: "speech-init-fr-3",
      title: "Patience et Douceur Envers Soi 🌸",
      speech: "Une graine ne se presse pas dans la terre : elle s'enracine solidement avant d'éclore à la lumière. Offre-toi cette même tendresse. Tes efforts d'aujourd'hui construisent ton sanctuaire de demain.",
      quote: "Les petits pas réguliers ramènent la sérénité.",
      category: "Patience",
      authorOrTone: "Force Intérieure"
    },
    {
      id: "speech-init-fr-4",
      title: "Retrouver l'Énergie d'Étudier ⚡",
      speech: "Quand la fatigue s'accumule, s'arrêter n'est pas un abandon mais une nécessité biologique. Ton esprit a besoin de pauses tampons pour consolider les connaissances et retrouver sa vivacité.",
      quote: "Le repos n'est pas du temps perdu ; c'est le terreau de ta clarté.",
      category: "Vitalité",
      authorOrTone: "Équilibre"
    },
    {
      id: "speech-init-fr-5",
      title: "Confiance en Ta Propre Voie 🕊️",
      speech: "L'université impose souvent des comparaisons stériles. Rappelle-toi que ta curiosité et ton authenticité sont tes plus beaux atouts. Avance la tête haute et le cœur apaisé.",
      quote: "Fais confiance à ton chemin. Tu fleuris exactement au bon moment.",
      category: "Confiance",
      authorOrTone: "Motivation"
    }
  ],
  derja: [
    {
      id: "speech-init-derja-1",
      title: "Kol Khedma Kbira Tebda b Khotwa Sghira 🌱",
      speech: "Mouch lazem thezz thqel el semestre lkol fard marra. Kol mashrou3 w nja7 yebda b fekra sghira. Elli 9a3ed ta3mel fih tawa howa dalil the9a w 9odra. Emchi b rythme mte3ek w ma tloumch rou7ek.",
      quote: "Ekber b chewaya w 3la ra7tek. El khir jey.",
      category: "El Rtiye7",
      authorOrTone: "The9a fel Rou7"
    },
    {
      id: "speech-init-derja-2",
      title: "Rtiye7 w The9a fel Rou7 ✨",
      speech: "Ki te5ou d9aye9 bech tlawwen wala t3abbar 3la e7sasek, rak rta7t w 3titt 9ima l'mokhek. El 9raya w les examens yet3addew, ama sa7tek w rtiye7ek houma l'essentiel.",
      quote: "Mouch lazem t7ell kol chay lyoum. A3mel juste l'khotwa jeya.",
      category: "Wsa3 el Bel",
      authorOrTone: "Nefes Hédi"
    },
    {
      id: "speech-init-derja-3",
      title: "Wsa3 el Bel w El Sabr 🌸",
      speech: "El zarré3a ta7t el trab ma tezzrebch rou7ha bech tnowwar; tochreb el mtar w t9awwi 3rou9ha. Koun 7nina m3a rou7ek. Kol khotwa sghira t9arrbek l'far7tek.",
      quote: "El sabr w el khedma el hadya ywaslou l'kol nja7.",
      category: "El Sabr",
      authorOrTone: "7neyna"
    },
    {
      id: "speech-init-derja-4",
      title: "Erte7 Chwaya w Taw Tarja3 A9wa ⚡",
      speech: "Ki t7ess rou7ek faddit w el stress ghlbek, tfakker elli el rtiye7 7a99ek. Mokhek kif l'batterie lezem yetchargea. El nja7 howa elli ya3ref wa9teh yerte7 bech ykamel thnitou.",
      quote: "El rtiye7 mouch dhyaye3 wa9t, howa 9owet el rojou3.",
      category: "Charge",
      authorOrTone: "9owwa"
    },
    {
      id: "speech-init-derja-5",
      title: "9ader Rou7ek w Koun Fekhour 🕊️",
      speech: "Dhourouf el 9raya dima yenzelou 3lik, ama enti a9wa b barcha men ay imti7an. Kol defi t3additou 9bal howa dars w the9a. Emchi b the9a w rasek 3ali.",
      quote: "The9a fel rou7 heya awwel bwebet el nja7.",
      category: "El Fakher",
      authorOrTone: "Nja7"
    }
  ]
};

export const MotivationalSlider: React.FC<MotivationalSliderProps> = ({ onSelectSpeech }) => {
  const { language, currentMood } = useApp();

  const [speeches, setSpeeches] = useState<MotivationalSpeech[]>(() => {
    const langKey = language === 'fr' ? 'fr' : language === 'derja' ? 'derja' : 'en';
    const cached = localStorage.getItem(`nefes_speeches_${langKey}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed.slice(0, 5);
        }
      } catch {
        // fallback to initial
      }
    }
    return INITIAL_SLIDER_SPEECHES[langKey] || INITIAL_SLIDER_SPEECHES.en;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actualizedNotice, setActualizedNotice] = useState<string | null>(null);

  // Sync speeches when language changes if not set
  useEffect(() => {
    const langKey = language === 'fr' ? 'fr' : language === 'derja' ? 'derja' : 'en';
    const cached = localStorage.getItem(`nefes_speeches_${langKey}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          setSpeeches(parsed.slice(0, 5));
          setCurrentIndex(0);
          return;
        }
      } catch {
        // use initial
      }
    }
    setSpeeches(INITIAL_SLIDER_SPEECHES[langKey] || INITIAL_SLIDER_SPEECHES.en);
    setCurrentIndex(0);
  }, [language]);

  // Actualize / Refresh from Backend API
  const handleActualizeFromBackend = async () => {
    setIsRefreshing(true);
    setActualizedNotice(null);

    try {
      const response = await fetch('/api/motivational-speeches/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          mood: currentMood,
          forceRefresh: true
        })
      });

      const data = await response.json();

      if (data && Array.isArray(data.speeches) && data.speeches.length >= 5) {
        const nextSpeeches = data.speeches.slice(0, 5);
        setSpeeches(nextSpeeches);
        setCurrentIndex(0);

        const langKey = language === 'fr' ? 'fr' : language === 'derja' ? 'derja' : 'en';
        localStorage.setItem(`nefes_speeches_${langKey}`, JSON.stringify(nextSpeeches));

        const sourceLabel = data.source === 'gemini' ? 'Gemini AI' : 'Adaptive Engine';
        setActualizedNotice(`5 new motivational speeches refreshed from backend (${sourceLabel})!`);
        setTimeout(() => setActualizedNotice(null), 3500);
      }
    } catch (err) {
      console.error('Failed to actualize motivational speeches:', err);
      setActualizedNotice('Refreshed local motivational speeches.');
      setTimeout(() => setActualizedNotice(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : speeches.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < speeches.length - 1 ? prev + 1 : 0));
  };

  const currentSpeech = speeches[currentIndex] || speeches[0];

  return (
    <section className="mt-6 font-sans">
      {/* Slider Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#D88C22]" />
          <h2 className="text-base font-bold text-[#202019] tracking-tight">
            Daily Motivational Speeches
          </h2>
          <span className="text-[11px] font-bold bg-[#FFF0D4] border border-[#F5D547] text-[#825C08] px-2 py-0.5 rounded-full ml-1">
            5 Speeches
          </span>
        </div>

        {/* Actualize / Refresh from Backend Action */}
        <button
          onClick={handleActualizeFromBackend}
          disabled={isRefreshing}
          title="Actualize and refresh speeches from backend"
          className="flex items-center gap-1.5 bg-[#FAF5E2] hover:bg-[#F2ECCD] active:scale-95 border border-[#ECE7D4] text-[#3D5834] px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#825C08]' : ''}`} />
          <span>{isRefreshing ? 'Actualizing...' : 'Actualize'}</span>
        </button>
      </div>

      {/* Actualized Notice Alert */}
      {actualizedNotice && (
        <div className="mb-2 bg-[#E8E9AE] border border-[#A8BC78] text-[#202019] text-xs font-bold py-1.5 px-3 rounded-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#3D5834] flex-shrink-0" />
          <span>{actualizedNotice}</span>
        </div>
      )}

      {/* The Active Slide Card */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#ECE7D4] relative overflow-hidden transition-all duration-300">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#FFF2D6]/40 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        {/* Slide Counter & Category Pill */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F8D45] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F8D45A]" />
            {currentSpeech.category || 'Mindful Reflection'}
          </span>

          <span className="text-xs font-bold bg-[#FAF5E2] border border-[#ECE7D4] text-[#555447] px-2.5 py-0.5 rounded-full">
            {currentIndex + 1} / {speeches.length}
          </span>
        </div>

        {/* Speech Title */}
        <h3 className="text-base font-bold text-[#202019] mb-2 leading-snug">
          {currentSpeech.title}
        </h3>

        {/* Speech Main Paragraph */}
        <p className="text-[13px] text-[#424138] leading-relaxed font-normal mb-4 min-h-[72px]">
          {currentSpeech.speech}
        </p>

        {/* Highlighted Quote Box */}
        <div className="bg-[#FAF7EE] border-l-3 border-[#6F8D45] rounded-r-2xl p-3 mb-4 flex items-start gap-2.5">
          <Quote className="w-4 h-4 text-[#6F8D45] flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold italic text-[#2E3C27] leading-relaxed">
            "{currentSpeech.quote}"
          </p>
        </div>

        {/* Controls: Prev / Dots / Next */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE2] relative z-10">
          <button
            onClick={handlePrev}
            aria-label="Previous motivational speech"
            className="w-8 h-8 rounded-full bg-[#FAF5E2] hover:bg-[#F2ECCD] active:scale-90 flex items-center justify-center text-[#3D5834] transition-all cursor-pointer border border-[#ECE7D4]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dot Indicators for 5 Speeches */}
          <div className="flex items-center gap-1.5">
            {speeches.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to speech ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-[#3D5834]'
                    : 'w-2 h-2 bg-[#D9D6C7] hover:bg-[#A3A194]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next motivational speech"
            className="w-8 h-8 rounded-full bg-[#FAF5E2] hover:bg-[#F2ECCD] active:scale-90 flex items-center justify-center text-[#3D5834] transition-all cursor-pointer border border-[#ECE7D4]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
