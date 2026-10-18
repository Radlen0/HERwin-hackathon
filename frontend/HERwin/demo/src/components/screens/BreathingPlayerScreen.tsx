import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Settings, Volume2, TreePine, Play, Pause, RotateCcw, RotateCw, RefreshCw, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MascotBrain } from '../mascots/MascotBrain';
import { SoundType } from '../../utils/audioSynthesizer';

export const BreathingPlayerScreen: React.FC = () => {
  const {
    setActiveScreen,
    isAudioPlaying,
    audioVolume,
    setAudioVolume,
    bgSound,
    setBgSound,
    toggleAudio,
    t
  } = useApp();

  // Session duration: 5 minutes (300 seconds)
  const TOTAL_DURATION = 300;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_DURATION);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [showSoundSelector, setShowSoundSelector] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  // Breathing cycle phase: Inhale (4s), Hold (4s), Exhale (4s), Pause (2s)
  type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [phaseSeconds, setPhaseSeconds] = useState<number>(4);

  // Timer interval ref
  const timerRef = useRef<number | null>(null);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Breathing phase guidance
  const phaseLabels: Record<BreathPhase, string> = {
    inhale: t.inhale,
    hold: t.hold,
    exhale: t.exhale,
    rest: t.justFollowBreath
  };

  // Master session timer & breathing cycle
  useEffect(() => {
    if (isSessionActive && secondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsSessionActive(false);
            if (isAudioPlaying) toggleAudio();
            return 0;
          }
          return prev - 1;
        });

        setPhaseSeconds((prev) => {
          if (prev <= 1) {
            // transition cycle
            setBreathPhase((current) => {
              if (current === 'inhale') return 'hold';
              if (current === 'hold') return 'exhale';
              if (current === 'exhale') return 'rest';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive, secondsRemaining, isAudioPlaying]);

  const handlePlayPause = () => {
    const nextState = !isSessionActive;
    setIsSessionActive(nextState);
    if (nextState && !isAudioPlaying) {
      toggleAudio();
    } else if (!nextState && isAudioPlaying) {
      toggleAudio();
    }
  };

  const handleSkipBack = () => {
    setSecondsRemaining((prev) => Math.min(TOTAL_DURATION, prev + 15));
  };

  const handleSkipForward = () => {
    setSecondsRemaining((prev) => Math.max(0, prev - 15));
  };

  const handleRestart = () => {
    setSecondsRemaining(TOTAL_DURATION);
    setBreathPhase('inhale');
    setPhaseSeconds(4);
    setIsSessionActive(true);
    if (!isAudioPlaying) toggleAudio();
  };

  // Elapsed vs Total for progress bar
  const elapsed = TOTAL_DURATION - secondsRemaining;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / TOTAL_DURATION) * 100));

  const soundDisplayNames: Record<SoundType, string> = {
    forest: t.forestSound,
    rain: t.softRain,
    ocean: t.oceanTide,
    bowl: t.zenBowl,
    mute: t.mute
  };

  return (
    <div className="w-full max-w-md mx-auto pb-32 pt-2 px-5 font-sans select-none animate-fadeIn">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-2">
        <button
          onClick={() => setActiveScreen('home')}
          aria-label="Back to dashboard"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#202019] hover:bg-black/5 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-bold text-[#202019]">
          {t.nowPlaying}
        </h1>

        <button
          onClick={() => setShowVolumeSlider((prev) => !prev)}
          aria-label="Audio settings"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#202019] hover:bg-black/5 active:scale-95 transition-all"
        >
          <Settings className="w-5 h-5 text-[#202019]" />
        </button>
      </header>

      {/* Hero Artwork with Mascot and Botanical Scenery */}
      <div className="relative mt-2">
        <MascotBrain size="hero" withScenery={true} animated={isSessionActive} />

        {/* Dynamic Breathing Aura Indicator */}
        <div
          className={`absolute inset-0 m-auto w-48 h-48 rounded-full pointer-events-none transition-all duration-1000 -z-10 ${
            isSessionActive
              ? breathPhase === 'inhale'
                ? 'scale-125 bg-[#A8BC78]/25 ring-8 ring-[#A8BC78]/20'
                : breathPhase === 'hold'
                ? 'scale-125 bg-[#F5D547]/20 ring-4 ring-[#F5D547]/20'
                : breathPhase === 'exhale'
                ? 'scale-90 bg-[#F47C91]/20'
                : 'scale-95 bg-white/30'
              : 'opacity-0 scale-90'
          }`}
        />
      </div>

      {/* Track & Session Details */}
      <div className="text-center mt-3">
        <h2 className="text-2xl font-bold tracking-tight text-[#202019]">
          {t.deepCalm}
        </h2>
        <p className="text-xs font-medium text-[#737264] mt-0.5">
          {t.guidedBreathingSession}
        </p>

        {/* Duration badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#F5F0D2] px-3.5 py-1 rounded-full text-xs font-semibold text-[#555447] mt-3">
          <span>{t.breathingPill}</span>
        </div>
      </div>

      {/* Big Digital Timer Display */}
      <div className="text-center mt-4">
        <div className="text-4xl font-extrabold tracking-tight text-[#202019]">
          {formatTime(secondsRemaining)}
        </div>
        <p className="text-xs font-medium text-[#6F8D45] mt-1 transition-all">
          {isSessionActive ? phaseLabels[breathPhase] : t.justFollowBreath}
        </p>
      </div>

      {/* Progress Bar & Slider */}
      <div className="mt-5 px-1">
        <div className="relative w-full h-1.5 bg-[#E8E6D5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6F8D45] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-[#8C8A7B] mt-1.5 px-0.5">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(TOTAL_DURATION)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-7 mt-5">
        {/* Skip -15s */}
        <button
          onClick={handleSkipBack}
          aria-label="Rewind 15 seconds"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#555447] hover:text-[#202019] hover:bg-black/5 active:scale-95 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[9px] font-bold absolute -bottom-1">15</span>
        </button>

        {/* Big Dark Circular Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          aria-label={isSessionActive ? 'Pause breathing session' : 'Start breathing session'}
          className="w-16 h-16 rounded-full bg-[#1C1C17] text-white flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-xl shadow-black/10 cursor-pointer"
        >
          {isSessionActive ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-0.5" />
          )}
        </button>

        {/* Skip +15s */}
        <button
          onClick={handleSkipForward}
          aria-label="Fast forward 15 seconds"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#555447] hover:text-[#202019] hover:bg-black/5 active:scale-95 transition-all"
        >
          <RotateCw className="w-5 h-5" />
          <span className="text-[9px] font-bold absolute -bottom-1">15</span>
        </button>
      </div>

      {/* Lower Settings Pills (Volume & Background Sound) */}
      <div className="flex items-center justify-between gap-3 mt-6">
        {/* Volume Pill */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowVolumeSlider((prev) => !prev)}
            className="w-full bg-white rounded-full py-2.5 px-3.5 border border-[#ECE7D4] shadow-xs flex items-center justify-between text-xs font-semibold text-[#555447] hover:border-[#6F8D45] transition-all"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#6F8D45]" />
              <span>{t.volume} {Math.round(audioVolume * 100)}%</span>
            </div>
            <span className="text-[#A3A194]">&gt;</span>
          </button>

          {/* Volume Slider Dropdown */}
          {showVolumeSlider && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-2xl p-3 shadow-xl border border-[#ECE7D4] z-20 animate-scaleUp">
              <span className="text-[10px] font-bold text-[#737264] uppercase block mb-1">
                Volume ({Math.round(audioVolume * 100)}%)
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioVolume}
                onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                className="w-full accent-[#6F8D45] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Background Sound Pill */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowSoundSelector((prev) => !prev)}
            className="w-full bg-white rounded-full py-2.5 px-3.5 border border-[#ECE7D4] shadow-xs flex items-center justify-between text-xs font-semibold text-[#555447] hover:border-[#6F8D45] transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <TreePine className="w-3.5 h-3.5 text-[#6F8D45] flex-shrink-0" />
              <span className="truncate">{soundDisplayNames[bgSound]}</span>
            </div>
            <span className="text-[#A3A194] flex-shrink-0">&gt;</span>
          </button>

          {/* Sound Selection Menu */}
          {showSoundSelector && (
            <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-2xl p-2 shadow-xl border border-[#ECE7D4] z-20 animate-scaleUp space-y-1">
              {(['forest', 'rain', 'ocean', 'bowl', 'mute'] as SoundType[]).map((snd) => (
                <button
                  key={snd}
                  onClick={() => {
                    setBgSound(snd);
                    setShowSoundSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    bgSound === snd ? 'bg-[#F5F0D2] text-[#3D5834] font-bold' : 'hover:bg-[#F8F5E4] text-[#555447]'
                  }`}
                >
                  <span>{soundDisplayNames[snd]}</span>
                  {bgSound === snd && <Check className="w-3.5 h-3.5 text-[#3D5834]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Reassuring Message */}
      <footer className="text-center mt-7">
        <p className="text-xs font-semibold text-[#6F8D45]/90 tracking-wide">
          {t.youAreSafe}
        </p>
      </footer>
    </div>
  );
};
