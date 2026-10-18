/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { ScheduleScreen } from './components/screens/ScheduleScreen';
import { BreathingPlayerScreen } from './components/screens/BreathingPlayerScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { PaintScreen } from './components/screens/PaintScreen';
import { RoadmapScreen } from './components/screens/RoadmapScreen';
import { GardenScreen } from './components/screens/GardenScreen';
import { AiSessionModal } from './components/screens/AiSessionModal';
import { WelcomeMoodModal } from './components/common/WelcomeMoodModal';
import { BottomNav } from './components/navigation/BottomNav';
import { Sparkles, X, HeartHandshake } from 'lucide-react';
import { Language } from './types';

const MainAppContent: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    openAiModal,
    language,
    setLanguage,
    diamonds,
    recentRewardToast,
    clearRewardToast,
    isWelcomeModalOpen,
    openWelcomeModal,
    closeWelcomeModal,
    currentMood
  } = useApp();

  return (
    <div className="min-h-screen bg-[#FFF9E9] text-[#202019] flex flex-col font-sans">
      {/* Top Bar */}
      <nav className="w-full bg-[#FAF5E2] border-b border-[#ECE7D4] py-2 px-4 select-none">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#6F8D45] animate-pulse" />
            <span className="text-xs font-bold text-[#3D5834] tracking-tight">
              NEFES • نَفَس
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Mood Check-in Button */}
            <button
              onClick={openWelcomeModal}
              className="flex items-center gap-1 bg-white/90 hover:bg-white border border-[#ECE7D4] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#3D5834] shadow-xs transition-all cursor-pointer"
              title="Change your starting mood state"
            >
              <HeartHandshake className="w-3 h-3 text-[#6F8D45]" />
              <span className="capitalize">{currentMood}</span>
            </button>

            {/* Diamond Quick Badge linking to Bloom Garden */}
            <button
              onClick={() => setActiveScreen('garden')}
              className="flex items-center gap-1 bg-[#FFF0D4] hover:bg-[#FFE8BF] border border-[#F5D547] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#825C08] shadow-xs transition-all cursor-pointer"
              title="My Garden Sanctuary"
            >
              <span>💎</span>
              <span>{diamonds}</span>
            </button>

            {/* Language Quick Dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-[11px] font-bold bg-white/80 border border-[#ECE7D4] rounded-full px-2.5 py-1 text-[#555447] cursor-pointer focus:outline-none"
              aria-label="Select Language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="derja">تونسية</option>
            </select>

            {/* AI Session Fast Trigger */}
            <button
              onClick={() => openAiModal()}
              className="text-[11px] font-bold bg-[#1C1C17] hover:bg-black text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#F8D45A]" />
              <span>AI</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Floating Reward Toast */}
      {recentRewardToast && (
        <div className="fixed top-12 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-fadeIn">
          <div className="pointer-events-auto bg-[#1C1C17] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-[#F8D45A]/40 text-xs font-bold">
            <span className="text-base animate-bounce">💎</span>
            <span>+{recentRewardToast.amount} Diamonds!</span>
            <span className="text-neutral-300 font-normal truncate max-w-[200px]">
              {recentRewardToast.message}
            </span>
            <button
              onClick={clearRewardToast}
              className="ml-1 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Container */}
      <main className="flex-1 w-full max-w-md mx-auto relative pt-1">
        {activeScreen === 'home' && <DashboardScreen />}
        {activeScreen === 'paint' && <PaintScreen />}
        {activeScreen === 'roadmap' && <RoadmapScreen />}
        {activeScreen === 'garden' && <GardenScreen />}
        {activeScreen === 'schedule' && <ScheduleScreen />}
        {activeScreen === 'breathing' && <BreathingPlayerScreen />}
        {activeScreen === 'settings' && <SettingsScreen />}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav />

      {/* Screen D: AI Adaptive Workflow Modal */}
      <AiSessionModal />

      {/* Screen Initial: 3-Mood Selection Modal (Calm, Moderate, Frustrated) */}
      <WelcomeMoodModal isOpen={isWelcomeModalOpen} onClose={closeWelcomeModal} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
