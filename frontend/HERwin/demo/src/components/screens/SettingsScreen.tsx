import React, { useState } from 'react';
import { ArrowLeft, Globe, Shield, Phone, Trash2, Heart, Info, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { MascotBrain } from '../mascots/MascotBrain';

export const SettingsScreen: React.FC = () => {
  const {
    userName,
    setUserName,
    language,
    setLanguage,
    setActiveScreen,
    clearHistory,
    historyEntries,
    t
  } = useApp();

  const [nameInput, setNameInput] = useState(userName);
  const [nameSaved, setNameSaved] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  };

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'Default interface' },
    { code: 'fr', label: 'Français', sub: 'Langue universitaire' },
    { code: 'derja', label: 'تونسية (Derja)', sub: 'B Tounsi / بالدارجة' },
  ];

  return (
    <div className="w-full max-w-md mx-auto pb-32 pt-2 px-5 font-sans select-none animate-fadeIn">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-3">
        <button
          onClick={() => setActiveScreen('home')}
          aria-label="Back to dashboard"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#202019] hover:bg-black/5 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-bold text-[#202019]">
          {t.settingsTab}
        </h1>

        <div className="w-10" />
      </header>

      {/* Profile & Name Card */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#EFEAD7] mt-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-[#6F8D45]/30 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <form onSubmit={handleSaveName} className="flex-1 min-w-0">
            <label className="text-[11px] font-bold text-[#737264] uppercase tracking-wider block">
              Display Name
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-sm font-semibold bg-[#F8F5E4] rounded-xl px-3 py-1.5 border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]"
              />
              <button
                type="submit"
                className="bg-[#3D5834] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#2B3E1F] transition-all"
              >
                {nameSaved ? <Check className="w-4 h-4" /> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Language Selection */}
      <div className="mt-6">
        <h2 className="text-xs font-bold text-[#737264] uppercase tracking-wider px-1 mb-2.5 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#6F8D45]" />
          Language & Dialect
        </h2>

        <div className="bg-white rounded-3xl p-2 shadow-xs border border-[#EFEAD7] space-y-1">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                language === l.code ? 'bg-[#F5F0D2] text-[#3D5834] font-bold' : 'hover:bg-[#F8F5E4] text-[#555447]'
              }`}
            >
              <div className="text-left">
                <p className="text-sm">{l.label}</p>
                <p className="text-[11px] text-[#737264]">{l.sub}</p>
              </div>
              {language === l.code && <Check className="w-4 h-4 text-[#3D5834]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Emergency Crisis Resources (Tunisia) */}
      <div className="mt-6">
        <h2 className="text-xs font-bold text-rose-800 uppercase tracking-wider px-1 mb-2.5 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-rose-600" />
          {t.crisisEmergencyResources}
        </h2>

        <div className="bg-white rounded-3xl p-4 shadow-xs border border-rose-100 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
            <div>
              <p className="text-xs font-bold text-[#202019]">{t.greenLine}</p>
              <p className="text-[11px] text-[#737264]">Écoute et soutien psychologique gratuit 24/7</p>
            </div>
            <a
              href="tel:80105050"
              className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs"
            >
              80 10 50 50
            </a>
          </div>

          <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
            <div>
              <p className="text-xs font-bold text-[#202019]">{t.samu}</p>
              <p className="text-[11px] text-[#737264]">Secours d'urgence médicale partout en Tunisie</p>
            </div>
            <a
              href="tel:190"
              className="bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs"
            >
              190
            </a>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#202019]">{t.raziHospital}</p>
              <p className="text-[11px] text-[#737264]">Urgences psychiatriques hospitalières</p>
            </div>
            <a
              href="tel:+21671600700"
              className="bg-[#3D5834] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs"
            >
              Appeler
            </a>
          </div>
        </div>
      </div>

      {/* Privacy & Data Protection */}
      <div className="mt-6">
        <h2 className="text-xs font-bold text-[#737264] uppercase tracking-wider px-1 mb-2.5 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#6F8D45]" />
          {t.privacySafety}
        </h2>

        <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#EFEAD7]">
          <p className="text-xs text-[#737264] leading-relaxed mb-4">
            {t.dataStoredLocally}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[#ECE7D4]">
            <span className="text-xs font-medium text-[#555447]">
              Stored entries: {historyEntries.length}
            </span>

            <button
              onClick={() => {
                if (window.confirm("Delete all locally stored mood check-ins?")) {
                  clearHistory();
                }
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.clearData}
            </button>
          </div>
        </div>
      </div>

      {/* About Nefes */}
      <div className="text-center mt-8 pt-4">
        <div className="flex justify-center mb-2">
          <MascotBrain size="sm" animated={false} />
        </div>
        <h3 className="text-sm font-bold text-[#202019]">
          Nefes (نَفَس)
        </h3>
        <p className="text-xs text-[#737264] italic max-w-xs mx-auto mt-1">
          "{t.tagline}"
        </p>
        <p className="text-[11px] text-[#A3A194] mt-2">
          Version 1.0.0 • Dedicated to student resilience
        </p>
      </div>
    </div>
  );
};
