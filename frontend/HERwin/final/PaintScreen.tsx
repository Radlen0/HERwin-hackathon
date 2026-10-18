import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Palette,
  RotateCcw,
  RotateCw,
  Eraser,
  Trash2,
  Download,
  ArrowLeft,
  MessageSquareText,
  Home
} from 'lucide-react';
import { MoodType, Language } from './types';

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

export interface PaintScreenProps {
  mood: MoodType;
  selectedProblems: string[];
  customDetail: string;
  language: Language;
  onBackToWelcome: () => void;
  onNavigateToChatbot: () => void;
  onNavigateToHome?: () => void;
}

export const PaintScreen: React.FC<PaintScreenProps> = ({
  mood,
  language,
  onBackToWelcome,
  onNavigateToChatbot,
  onNavigateToHome
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeColor, setActiveColor] = useState(mood === 'frustrated' ? '#F47C91' : '#6F8D45');
  const [brushSize, setBrushSize] = useState(10);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Localization labels
  const text = {
    en: {
      title: "Paint Canvas",
      subtitle: "Free creative expression",
      backToWelcome: "Welcome",
      goToChatbot: "Chatbot",
      eraser: "Eraser",
      clear: "Clear Canvas",
      undo: "Undo",
      redo: "Redo",
      download: "Save Artwork"
    },
    fr: {
      title: "Toile de Peinture",
      subtitle: "Expression créative libre",
      backToWelcome: "Accueil",
      goToChatbot: "Chatbot",
      eraser: "Gomme",
      clear: "Effacer la toile",
      undo: "Annuler",
      redo: "Rétablir",
      download: "Télécharger"
    },
    derja: {
      title: "Espace Lawwen",
      subtitle: "Rassem w farragh mokhek",
      backToWelcome: "El Bdeya",
      goToChatbot: "Chatbot",
      eraser: "Mams7a",
      clear: "Fassa5 kol chay",
      undo: "Arja3",
      redo: "3awed",
      download: "Enregistrer"
    }
  }[language] || {
    title: "Paint Canvas",
    subtitle: "Free creative expression",
    backToWelcome: "Welcome",
    goToChatbot: "Chatbot",
    eraser: "Eraser",
    clear: "Clear Canvas",
    undo: "Undo",
    redo: "Redo",
    download: "Save Artwork"
  };

  // Resize canvas to match container size while preserving drawing
  const initOrResizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;

    // Temporary offscreen canvas to retain existing drawing across resize
    let tempCanvas: HTMLCanvasElement | null = null;
    if (canvas.width > 0 && canvas.height > 0) {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }
    }

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(dpr, dpr);

    if (tempCanvas) {
      // Re-draw previous content onto resized canvas
      ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
    } else {
      // Initial white fill
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialData]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    initOrResizeCanvas();

    const handleResize = () => {
      initOrResizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initOrResizeCanvas]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), currentState]);
    setHistoryIndex(prev => prev + 1);
  };

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#FFFDF7' : activeColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvasState();
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextIndex = historyIndex - 1;
    ctx.putImageData(history[nextIndex], 0, 0);
    setHistoryIndex(nextIndex);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextIndex = historyIndex + 1;
    ctx.putImageData(history[nextIndex], 0, 0);
    setHistoryIndex(nextIndex);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    ctx.fillStyle = '#FFFDF7';
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveCanvasState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `mira-paint-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFF9E9] text-[#202019] font-sans selection:bg-[#E8E9AE] overflow-hidden">
      {/* Top Header Bar */}
      <header className="w-full bg-[#FAF5E2] border-b border-[#ECE7D4] px-4 py-3 select-none flex-shrink-0 z-10 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBackToWelcome}
              className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 border border-[#ECE7D4] flex items-center justify-center text-[#555447] transition-all cursor-pointer shadow-2xs flex-shrink-0"
              title={text.backToWelcome}
              aria-label="Back to Welcome Screen"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-[#202019] truncate leading-tight tracking-tight">
                  {text.title}
                </h1>
                <span className="text-[10px] font-semibold text-[#872132] bg-[#FDF0F3] px-2 py-0.5 rounded-lg border border-[#F5C2CB] hidden sm:inline-block">
                  <span className="capitalize">{mood}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#737264] truncate hidden sm:block">
                {text.subtitle}
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Undo */}
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-neutral-100 border border-[#ECE7D4] disabled:opacity-30 flex items-center justify-center text-[#555447] cursor-pointer shadow-2xs"
              title={text.undo}
              aria-label={text.undo}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Redo */}
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-neutral-100 border border-[#ECE7D4] disabled:opacity-30 flex items-center justify-center text-[#555447] cursor-pointer shadow-2xs"
              title={text.redo}
              aria-label={text.redo}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Clear Canvas */}
            <button
              onClick={handleClear}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FDF0F3] hover:bg-[#FCE4E8] border border-[#F5C2CB] text-[#872132] flex items-center justify-center cursor-pointer shadow-2xs"
              title={text.clear}
              aria-label={text.clear}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-neutral-100 border border-[#ECE7D4] flex items-center justify-center text-[#555447] cursor-pointer shadow-2xs"
              title={text.download}
              aria-label={text.download}
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Direct Switch to Home */}
            {onNavigateToHome && (
              <button
                onClick={onNavigateToHome}
                className="text-xs font-bold bg-white hover:bg-neutral-50 border border-[#ECE7D4] text-[#3D5834] px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs flex-shrink-0 ml-1"
                title="Go to Home"
              >
                <Home className="w-3.5 h-3.5 text-[#6F8D45]" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            {/* Direct Switch to Chatbot */}
            <button
              onClick={onNavigateToChatbot}
              className="text-xs font-bold bg-white hover:bg-neutral-50 border border-[#ECE7D4] text-[#184F54] px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs flex-shrink-0"
              title={text.goToChatbot}
            >
              <MessageSquareText className="w-3.5 h-3.5 text-[#438990]" />
              <span className="hidden sm:inline">{text.goToChatbot}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas Drawing Workspace (Inspirational quotes removed) */}
      <main className="flex-1 w-full p-2 sm:p-4 overflow-hidden relative flex flex-col">
        <div
          ref={containerRef}
          className="flex-1 w-full max-w-6xl mx-auto relative rounded-3xl border border-[#ECE7D4] shadow-sm overflow-hidden bg-[#FFFDF7]"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none select-none"
          />
        </div>
      </main>

      {/* Bottom Creative Drawing Toolbar (Docked, Responsive on Mobile & Desktop) */}
      <footer className="w-full bg-[#FAF5E2] border-t border-[#ECE7D4] px-4 py-2.5 sm:py-3 flex-shrink-0 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Color Palette */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto justify-center sm:justify-start py-0.5">
            {PALETTE_COLORS.map(c => {
              const isSelected = !isEraser && activeColor === c.hex;
              return (
                <button
                  key={c.hex}
                  onClick={() => {
                    setIsEraser(false);
                    setActiveColor(c.hex);
                  }}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 active:scale-95 ${
                    isSelected
                      ? 'border-[#202019] scale-110 shadow-sm ring-2 ring-black/10'
                      : 'border-white/80 hover:scale-105'
                  }`}
                  title={c.label}
                  aria-label={c.label}
                >
                  {isSelected && (
                    <span className={`w-1.5 h-1.5 rounded-full ${c.hex === '#FFFFFF' ? 'bg-black' : 'bg-white'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Brush Sizes & Eraser Toggle */}
          <div className="flex items-center gap-2">
            {/* Eraser */}
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isEraser
                  ? 'bg-[#1C1C17] text-white border-[#1C1C17] shadow-xs'
                  : 'bg-white hover:bg-neutral-100 text-[#555447] border-[#ECE7D4]'
              }`}
              title={text.eraser}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>{text.eraser}</span>
            </button>

            {/* Brush Sizes */}
            <div className="flex items-center bg-white border border-[#ECE7D4] rounded-xl p-0.5 shadow-2xs">
              {BRUSH_SIZES.map(b => (
                <button
                  key={b.size}
                  onClick={() => setBrushSize(b.size)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    brushSize === b.size
                      ? 'bg-[#E8E9AE] text-[#3D5834]'
                      : 'text-[#8C8A7B] hover:text-[#202019]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaintScreen;
