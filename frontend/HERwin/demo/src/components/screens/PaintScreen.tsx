import React, { useRef, useState, useEffect } from 'react';
import {
  Palette,
  RotateCcw,
  RotateCw,
  Eraser,
  Trash2,
  Sparkles,
  Download,
  Check,
  ArrowRight,
  Quote,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MascotBrain } from '../mascots/MascotBrain';

const PALETTE_COLORS = [
  { hex: '#6F8D45', label: 'Sage' },
  { hex: '#3D5834', label: 'Forest' },
  { hex: '#F5D547', label: 'Sunlight' },
  { hex: '#F47C91', label: 'Coral' },
  { hex: '#9186D7', label: 'Lavender' },
  { hex: '#39A9E8', label: 'Sky' },
  { hex: '#FFA0B6', label: 'Rose' },
  { hex: '#202019', label: 'Charcoal' },
  { hex: '#FFFFFF', label: 'White' },
];

const BRUSH_SIZES = [
  { size: 4, label: 'Fine' },
  { size: 10, label: 'Medium' },
  { size: 22, label: 'Bold' },
  { size: 38, label: 'Wash' },
];

const STICKER_TYPES = [
  { id: 'heart', label: '❤️' },
  { id: 'star', label: '⭐' },
  { id: 'leaf', label: '🌿' },
  { id: 'sun', label: '☀️' },
  { id: 'cloud', label: '☁️' },
  { id: 'flower', label: '🌸' },
  { id: 'sparkle', label: '✨' },
];

// Curated motivational speeches stored directly in the frontend
const MOTIVATIONAL_SPEECHES = {
  en: [
    {
      title: "The Power of Small Beginnings 🌱",
      speech: "Every great project and breakthrough begins as a quiet thought in the mind. You don't have to carry the whole semester at once or have all the answers today. What you brought onto this canvas is living proof of your imagination and resilience. Trust the steady rhythm of your progress — one honest breath, one small step at a time. You are doing much better than you give yourself credit for.",
      quote: "Grow at your own pace. The bloom is already taking root."
    },
    {
      title: "Your Creative Sanctuary ✨",
      speech: "Creative expression is a sanctuary where external expectations, exams, and academic noise have no authority. By taking these minutes to paint and put words to your thoughts, you honored yourself. Hold onto this inner clarity as you move through your day. You have the intellect, the grace, and the capability to navigate whatever comes next.",
      quote: "You don't have to solve everything today. Just take the next step."
    },
    {
      title: "Patience and Gentle Courage 🌸",
      speech: "A seed beneath the earth doesn't panic in the dark; it drinks the rain, anchors its roots deep, and rises into the light when the time is right. Give yourself that same gentle patience. Every hour of effort you put into your studies and well-being matters, and your sanctuary will flourish alongside your steady heart.",
      quote: "Small consistent steps rebuild your calm."
    },
    {
      title: "Recharging Your Academic Spark ⚡",
      speech: "When fatigue whispers that you should give up, remember that you don't need a surge of dramatic motivation — just permission to pause and breathe. Your worth as a student and as a person isn't measured by a single test or a chaotic week. You have overcome challenging hurdles before, and you will thrive through this season too.",
      quote: "Rest is not lost time; it is the soil from which fresh brilliance grows."
    },
    {
      title: "Trusting Your Inner Compass 🕊️",
      speech: "Look at the colors and shapes you just expressed. They belong only to you, authentic and free. University life often demands that we fit into rigid molds, but your genuine creativity and dedication are your greatest strengths. Walk forward with quiet confidence and your head held high.",
      quote: "Honor your unique journey. You are blooming right on time."
    }
  ],
  fr: [
    {
      title: "La Force des Petits Commencements 🌱",
      speech: "Chaque grand projet et chaque réussite commence par une étincelle silencieuse dans l'esprit. Tu n'as pas à porter tout le semestre sur tes épaules aujourd'hui. Ce que tu viens d'esquisser ici est la preuve vivante de ta créativité et de ta persévérance. Fais confiance à ton propre rythme, un pas à la fois. Tu avances déjà bien plus que tu ne le crois.",
      quote: "Grandis à ton propre rythme. Les bourgeons prennent déjà racine."
    },
    {
      title: "Ton Sanctuaire de Clarté ✨",
      speech: "L'expression libre est un espace de calme où les jugements extérieurs, les examens et la pression des cours n'ont aucun pouvoir. En prenant ce moment pour poser tes idées en couleurs et en mots, tu t'es reconnectée à l'essentiel. Garde cette paix intérieure pour la suite de ta semaine.",
      quote: "Tu n'as pas à tout résoudre aujourd'hui. Fais juste le prochain pas."
    },
    {
      title: "Patience et Douceur Envers Soi 🌸",
      speech: "Une graine dans la terre ne s'inquiète pas dans l'obscurité ; elle s'enracine patiemment et fleurit au moment juste. Offre-toi cette même bienveillance. Chacun de tes efforts pour tes études et ton bien-être compte profondément, et ton sanctuaire grandira avec toi.",
      quote: "Les petits pas réguliers ramènent la sérénité."
    },
    {
      title: "Retrouver l'Étincelle d'Étude ⚡",
      speech: "Quand la fatigue te souffle de douter de toi, rappelle-toi que tu n'as pas besoin d'une vague de motivation magique — seulement la permission de souffler. Ta valeur ne dépend pas d'une note ou d'une semaine chargée. Tu as déjà traversé des périodes difficiles, et tu réussiras celle-ci également.",
      quote: "Le repos n'est pas du temps perdu ; c'est le terreau de ta clarté."
    },
    {
      title: "Confiance en Ta Propre Voie 🕊️",
      speech: "Regarde ce que tu as créé : c'est un reflet de ton esprit libre. L'université exige souvent d'entrer dans des cases, mais ta sensibilité et ton authenticité sont tes plus beaux atouts. Avance avec douceur et conviction.",
      quote: "Fais confiance à ton chemin. Tu fleuris exactement au bon moment."
    }
  ],
  derja: [
    {
      title: "Kol Khedma Kbira Tebda b Khotwa Sghira 🌱",
      speech: "Kol mashrou3 kbir w kol nja7 yebda b fekra sghira w rasma fi mokhek. Mouch lazem thezz thqel el semestre lkol fard marra. Elli 3maltou tawa howa dalil elli enti 9adra tebni w tebda3. Emchi b rythme mte3ek, khotwa b khotwa w ma tloumch rou7ek. Rabbi m3ak w dima koun fekhour b khedmtek.",
      quote: "Ekber b chewaya w 3la ra7tek. El khir jey."
    },
    {
      title: "Rtiye7 w The9a fel Rou7 ✨",
      speech: "El fan w el khedma el 7orrah houma blassa ma fihech stress wala 7okm men 7ad. El 9raya w les examens marrat ynasouna 9imetna. Ki 5dhitt hal d9aye9 bech tlawwen w tektib fekretk, rak rta7t w 3titt 9ima l'rou7ek. Kamel hakka b the9a w rasek marfou3.",
      quote: "Mouch lazem t7ell kol chay lyoum. A3mel juste l'khotwa jeya."
    },
    {
      title: "Wsa3 el Bel w El Far7a 🌸",
      speech: "El zarré3a ta7t el trab ma tezzrebch rou7ha bech tnowwar; tochreb el mtar, t9awwi 3rou9ha w ttol ki yji wa9tha. Koun 7nina m3a rou7ek. Kol khotwa t3awnek tenja7 w jnantek tekber m3ak.",
      quote: "El sabr w el khedma el hadya ywaslou l'kol nja7."
    },
    {
      title: "Erte7 Chwaya w Taw Tarja3 A9wa ⚡",
      speech: "Ki t7ess rou7ek t3ebt w el stress ghlbek, tfakker elli el rtiye7 7a99ek. Mokhek kif l'batterie lezem yetchargea. Mouch el nja7 howa elli ma yor9odch, el nja7 howa elli ya3ref wa9teh yerte7 bech ykamel thnitou.",
      quote: "El rtiye7 mouch dhyaye3 wa9t, howa 9owet el rojou3."
    },
    {
      title: "9ader Rou7ek w Koun Fekhour 🕊️",
      speech: "Chouf el alwen w el khedma elli 3maltha tawa. Kolha men mokhek w e7sasek. El jami3a w dhourouf dima yenzelou 3lik, ama enti a9wa b barcha men ay imti7an. Emchi b the9a w rasek 3ali.",
      quote: "The9a fel rou7 heya awwel bwebet el nja7."
    }
  ]
};

export const PaintScreen: React.FC = () => {
  const { rewardDiamond, setActiveScreen, language, diamonds, currentMood } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeColor, setActiveColor] = useState(currentMood === 'frustrated' ? '#F47C91' : '#6F8D45');
  const [brushSize, setBrushSize] = useState(10);
  const [isEraser, setIsEraser] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Description & Frontend Motivation Speech state
  const [artworkDescription, setArtworkDescription] = useState('');
  const [activeSpeech, setActiveSpeech] = useState<{ title: string; speech: string; quote: string } | null>(null);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [hasReceivedReward, setHasReceivedReward] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = 340 * 2; // high-DPI crispness

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Pure white canvas background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, 340);

    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHistoryIndex(0);
  }, []);

  const saveHistorySnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(data);

    if (nextHistory.length > 20) {
      nextHistory.shift();
    }

    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.putImageData(history[targetIndex], 0, 0);
      setHistoryIndex(targetIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.putImageData(history[targetIndex], 0, 0);
      setHistoryIndex(targetIndex);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width / 2, 340);
    saveHistorySnapshot();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else if ('clientX' in e) {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    // If sticker selected, stamp it directly
    if (selectedSticker) {
      const stickerObj = STICKER_TYPES.find(s => s.id === selectedSticker);
      if (stickerObj) {
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stickerObj.label, x, y);
        saveHistorySnapshot();
        return;
      }
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : activeColor;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistorySnapshot();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `nefes-artwork-${new Date().toISOString().split('T')[0]}.png`;
    a.click();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Submit description & immediately unlock stored motivational speech and diamonds!
  const handleSubmitIdea = () => {
    const langKey = (language === 'derja' || language === 'fr') ? language : 'en';
    const speechList = MOTIVATIONAL_SPEECHES[langKey];
    
    // Pick speech deterministically based on description length
    const nextIdx = (artworkDescription.length || 1) % speechList.length;
    setSpeechIndex(nextIdx);
    setActiveSpeech(speechList[nextIdx]);

    // Award +10 Diamonds to the user's garden
    if (!hasReceivedReward) {
      rewardDiamond(10, 'Painted an idea & shared reflection', 'reflection', `paint-idea-${Date.now()}`);
      setHasReceivedReward(true);
    }
  };

  const handleNextSpeech = () => {
    const langKey = (language === 'derja' || language === 'fr') ? language : 'en';
    const speechList = MOTIVATIONAL_SPEECHES[langKey];
    const nextIdx = (speechIndex + 1) % speechList.length;
    setSpeechIndex(nextIdx);
    setActiveSpeech(speechList[nextIdx]);
  };

  const handleResetForNewPainting = () => {
    handleClear();
    setArtworkDescription('');
    setActiveSpeech(null);
    setHasReceivedReward(false);
  };

  const ideaChips = [
    'Releasing frustration 🔥',
    'Exam courage 📚',
    'Study spark 💡',
    'Mind unwind 🌿',
    'Future dreams ☀️',
    'Untangling my thoughts ⚡',
    'Creative release 🎨'
  ];

  return (
    <div className="w-full max-w-md mx-auto pb-32 pt-2 px-5 font-sans select-none animate-fadeIn">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-3">
        <div>
          <span className="text-xs font-bold text-[#6F8D45] uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-4 h-4" />
            Creative Canvas
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#202019] mt-0.5">
            Paint Your Idea
          </h1>
        </div>

        {/* Diamond Counter Badge */}
        <button
          onClick={() => setActiveScreen('garden')}
          className="flex items-center gap-1.5 bg-[#FFF0D4] border border-[#F5D547] text-[#825C08] px-3 py-1.5 rounded-full text-xs font-bold shadow-xs cursor-pointer hover:bg-[#FFE7B8] transition-all"
        >
          <span>💎</span>
          <span>{diamonds}</span>
        </button>
      </header>

      {/* Encouraging Intro Banner / Frustrated Mode prompt */}
      {currentMood === 'frustrated' ? (
        <div className="bg-[#FDF0F3] rounded-2xl p-3.5 border-2 border-[#F47C91] mb-3 flex items-start gap-3 shadow-xs animate-fadeIn">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#F47C91]/40 flex items-center justify-center text-xl flex-shrink-0">
            🔥
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#872132] block">
              Channel Your Frustration
            </span>
            <p className="text-xs font-bold text-[#872132] mt-0.5 leading-snug">
              Feeling frustrated? Paint your idea without filter or perfectionism.
            </p>
            <p className="text-[11px] text-[#A63548] mt-0.5">
              Let your brush strokes, shapes, and colors absorb the tension. Describe what you drew to unlock reassuring motivation & +10 💎.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-3 border border-[#ECE7D4] mb-3 flex items-start gap-2.5 shadow-xs">
          <MascotBrain size="sm" animated={false} />
          <div>
            <p className="text-xs font-medium text-[#202019] leading-relaxed">
              Paint any sketch, mood, or idea on your mind. Describe it in your own words to unlock inspiring wisdom and earn <span className="font-bold text-[#3D5834]">+10 💎 diamonds</span> for your virtual garden.
            </p>
          </div>
        </div>
      )}

      {/* Canvas Card */}
      <div className="bg-white rounded-3xl p-3 border border-[#ECE7D4] shadow-md relative overflow-hidden">
        {/* Undo / Redo & Toolbar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2EFE2] px-1">
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo"
              className="p-1.5 rounded-xl hover:bg-neutral-100 disabled:opacity-30 text-[#555447] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
              className="p-1.5 rounded-xl hover:bg-neutral-100 disabled:opacity-30 text-[#555447] cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsEraser(prev => !prev);
                setSelectedSticker(null);
              }}
              title="Eraser"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                isEraser ? 'bg-[#3D5834] text-white shadow-xs' : 'hover:bg-neutral-100 text-[#555447]'
              }`}
            >
              <Eraser className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              title="Clear Canvas"
              className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="Save Artwork to Device"
              className="p-1.5 rounded-xl hover:bg-[#F5F0D2] text-[#3D5834] cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HTML5 Canvas Element */}
        <div className="w-full relative touch-none bg-white rounded-2xl overflow-hidden border border-[#ECE7D4]">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-[300px] cursor-crosshair block"
          />
        </div>

        {/* Brush Size & Sticker Controls */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#F2EFE2] px-1">
          {/* Brush Sizes */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#8C8A7B] uppercase mr-1">
              Brush:
            </span>
            {BRUSH_SIZES.map((b) => (
              <button
                key={b.size}
                onClick={() => {
                  setBrushSize(b.size);
                  setSelectedSticker(null);
                }}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  brushSize === b.size && !selectedSticker
                    ? 'bg-[#3D5834] text-white shadow-xs'
                    : 'bg-[#F8F5E4] text-[#555447] hover:bg-[#F5F0D2]'
                }`}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: Math.min(14, b.size / 2 + 2), height: Math.min(14, b.size / 2 + 2) }}
                />
              </button>
            ))}
          </div>

          {/* Stickers */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-[#8C8A7B] uppercase mr-1">
              Stickers:
            </span>
            {STICKER_TYPES.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSticker(selectedSticker === s.id ? null : s.id);
                  setIsEraser(false);
                }}
                className={`w-7 h-7 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${
                  selectedSticker === s.id
                    ? 'bg-[#F5F0D2] ring-2 ring-[#6F8D45]'
                    : 'bg-[#F8F5E4] hover:bg-[#F5F0D2]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex items-center justify-between gap-1.5 mt-2.5 px-1 overflow-x-auto no-scrollbar">
          {PALETTE_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setActiveColor(c.hex);
                setIsEraser(false);
                setSelectedSticker(null);
              }}
              title={c.label}
              className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                activeColor === c.hex && !isEraser
                  ? 'scale-115 border-[#202019] shadow-sm'
                  : 'border-white/80 hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-[#E8E9AE] border border-[#A8BC78] text-[#202019] text-xs font-bold p-2.5 rounded-2xl mt-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-[#3D5834]" />
          <span>Artwork saved to your device.</span>
        </div>
      )}

      {/* Describe Your Idea Section */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE7D4] shadow-xs mt-4">
        <h3 className="text-xs font-bold text-[#737264] uppercase tracking-wider mb-2">
          Describe Your Idea
        </h3>

        {/* Quick idea chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {ideaChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setArtworkDescription(prev => prev ? `${prev} • ${chip}` : `My idea: ${chip}`);
              }}
              className="text-[11px] font-medium bg-[#F8F5E4] hover:bg-[#F5F0D2] border border-[#ECE7D4] text-[#555447] px-2.5 py-1 rounded-full transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        <textarea
          value={artworkDescription}
          onChange={(e) => setArtworkDescription(e.target.value)}
          placeholder="What inspired this drawing? What idea, feeling, or study goal does it represent?..."
          rows={3}
          className="w-full bg-[#FBF9F1] rounded-2xl p-3 text-xs text-[#202019] placeholder:text-[#A3A194] border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45] resize-none mb-3"
        />

        <button
          onClick={handleSubmitIdea}
          disabled={!artworkDescription.trim()}
          className="w-full bg-[#1C1C17] hover:bg-black disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#F8D45A]" />
          <span>Share Idea & Unlock Motivation (+10 💎)</span>
        </button>

        {/* Stored Motivational Speech Presentation */}
        {activeSpeech && (
          <div className="mt-5 pt-4 border-t border-[#F2EFE2] space-y-4 animate-fadeIn">
            {/* Reward Notification Banner */}
            <div className="bg-[#FFF0D4] border border-[#F5D547] text-[#825C08] p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">💎</span>
                <div>
                  <p className="text-xs font-bold">+10 Diamonds Earned!</p>
                  <p className="text-[10px] text-[#A37213]">Added to your Nefes Bloom balance</p>
                </div>
              </div>
              <span className="text-xs font-black bg-white/80 px-2.5 py-1 rounded-full shadow-xs">
                Total: {diamonds} 💎
              </span>
            </div>

            {/* Motivational Speech Card */}
            <div className="bg-[#FAF7EE] p-4 rounded-2xl border border-[#ECE7D4]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <MascotBrain size="sm" animated={true} />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#6F8D45] tracking-wider block">
                      Nefes Motivation
                    </span>
                    <h4 className="text-xs font-bold text-[#202019]">
                      {activeSpeech.title}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={handleNextSpeech}
                  title="Read another encouraging speech"
                  className="p-1.5 rounded-xl hover:bg-[#F0EBD6] text-[#6F8D45] transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Next</span>
                </button>
              </div>

              <p className="text-xs text-[#202019] leading-relaxed font-medium mt-2">
                {activeSpeech.speech}
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#ECE7D4] flex items-center gap-2 text-xs italic text-[#6F8D45]">
                <Quote className="w-3.5 h-3.5 flex-shrink-0" />
                <span>"{activeSpeech.quote}"</span>
              </div>
            </div>

            {/* Next Steps: Visit Garden or Paint Another */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setActiveScreen('garden')}
                className="w-full bg-[#3D5834] hover:bg-[#2B3E1F] text-white p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <span>🌸</span>
                <span>Visit Garden</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetForNewPainting}
                className="w-full bg-[#F5F0D2] hover:bg-[#ECE6C2] text-[#3D5834] p-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold border border-[#DCD5B3] cursor-pointer transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Paint Another</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
