import React from 'react';
import { Home, Palette, Compass, Sprout, Calendar, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenType } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, t } = useApp();

  const navItems: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.homeTab, icon: Home },
    { id: 'paint', label: t.paintTab, icon: Palette },
    { id: 'roadmap', label: t.roadmapTab, icon: Compass },
    { id: 'garden', label: t.gardenTab, icon: Sprout },
    { id: 'schedule', label: t.scheduleTab, icon: Calendar },
    { id: 'settings', label: t.settingsTab, icon: Shield },
  ];

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-3 pointer-events-none">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto bg-[#1C1C17] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl flex items-center justify-between gap-1.5 sm:gap-4 backdrop-blur-md border border-white/10 transition-all duration-300 max-w-md w-full"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              aria-label={item.label}
              title={item.label}
              className={`group relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 cursor-pointer ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <span className="absolute inset-0 bg-white/20 rounded-full scale-100 transition-transform duration-200" />
              )}

              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.4] text-[#E8E9AE]' : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />

              <span className={`text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-medium relative z-10 truncate max-w-full ${
                isActive ? 'text-[#E8E9AE] font-bold' : 'text-neutral-400'
              }`}>
                {item.label}
              </span>

              {/* Tiny active dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 bg-[#E8E9AE] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
