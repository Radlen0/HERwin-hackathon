import React, { useState } from 'react';
import { ArrowLeft, Clock, ChevronDown, Trash2, X, Plus, Calendar as CalIcon, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MoodCharacter } from '../mascots/MoodCharacters';
import { MascotBrain } from '../mascots/MascotBrain';
import { MoodType, MoodEntry } from '../../types';
import { MOOD_DEFINITIONS } from '../../utils/translations';

export const ScheduleScreen: React.FC = () => {
  const {
    setActiveScreen,
    historyEntries,
    deleteCheckIn,
    addCheckIn,
    clearHistory,
    t
  } = useApp();

  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>('');
  const [newMood, setNewMood] = useState<MoodType>('calm');

  // Month navigation & days setup for current month
  // October 2026: starts on Thursday (1st)
  // Calendar structure: Mon Tue Wed Thu Fri Sat Sun
  // Week 1: 28, 29, 30 (Sep) | 1, 2, 3, 4
  // Week 2: 5, 6, 7, 8, 9, 10, 11
  // Week 3: 12, 13, 14, 15, 16, 17, 18
  // Week 4: 19, 20, 21, 22, 23, 24, 25
  // Week 5: 26, 27, 28, 29, 30, 31, 1 (Nov)

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Map dates to history entries
  const entryMap = new Map<string, MoodEntry>();
  historyEntries.forEach(e => entryMap.set(e.date, e));

  // Generate 35 days grid representing the calendar from reference image
  interface CalDay {
    dayNum: number;
    dateStr: string;
    isCurrentMonth: boolean;
  }

  const calendarDays: CalDay[] = [];
  // 3 days from previous month (Sep 28, 29, 30)
  calendarDays.push({ dayNum: 28, dateStr: '2026-09-28', isCurrentMonth: false });
  calendarDays.push({ dayNum: 29, dateStr: '2026-09-29', isCurrentMonth: false });
  calendarDays.push({ dayNum: 30, dateStr: '2026-09-30', isCurrentMonth: false });

  // 31 days of October
  for (let d = 1; d <= 31; d++) {
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    calendarDays.push({
      dayNum: d,
      dateStr: `2026-10-${dayStr}`,
      isCurrentMonth: true
    });
  }

  // 1 day from Nov to complete 35 slots
  calendarDays.push({ dayNum: 1, dateStr: '2026-11-01', isCurrentMonth: false });

  // Compute tension frequency for the progress bar
  const totalEntries = historyEntries.length;
  const tenseEntries = historyEntries.filter(e => e.mood === 'anxious' || e.mood === 'frustrated' || e.mood === 'overwhelmed').length;
  const tensionPercent = totalEntries > 0 ? Math.min(100, Math.round((tenseEntries / totalEntries) * 100)) : 20;

  const handleDayClick = (day: CalDay) => {
    setSelectedDate(day.dateStr);
    const existing = entryMap.get(day.dateStr);
    if (existing) {
      setSelectedEntry(existing);
    } else {
      setSelectedEntry(null);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    addCheckIn(newMood, newNote);
    setSelectedDate(null);
    setNewNote('');
  };

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
          {t.schedule}
        </h1>

        <button
          onClick={() => setShowPrivacyModal(true)}
          aria-label="View history and privacy"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#202019] hover:bg-black/5 active:scale-95 transition-all"
        >
          <Clock className="w-5 h-5 text-[#202019]" />
        </button>
      </header>

      {/* Your Mood Journey Title & Month selector */}
      <div className="flex items-center justify-between mt-3 mb-4 px-1">
        <h2 className="text-xl font-bold tracking-tight text-[#202019]">
          {t.yourMoodJourney}
        </h2>

        <div className="flex items-center gap-1 text-xs font-semibold text-[#555447] bg-white px-3 py-1.5 rounded-full border border-[#ECE7D4] shadow-sm">
          <span>{t.thisMonth}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Monthly Calendar Card */}
      <div className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#EFEAD7]">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekdays.map((wd) => (
            <span key={wd} className="text-[12px] font-semibold text-[#8C8A7B] py-1">
              {wd}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {calendarDays.map((day, idx) => {
            const entry = entryMap.get(day.dateStr);
            const isSelected = selectedDate === day.dateStr;

            return (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`relative h-11 flex flex-col items-center justify-center rounded-xl transition-all ${
                  !day.isCurrentMonth
                    ? 'text-[#C5C3B6] opacity-40 hover:opacity-80'
                    : 'text-[#202019] hover:bg-[#F8F5E4]'
                } ${isSelected ? 'ring-2 ring-[#6F8D45] bg-[#F5F0D2]/50' : ''}`}
              >
                {entry ? (
                  <div className="flex flex-col items-center justify-center">
                    <MoodCharacter mood={entry.mood} size={28} className="drop-shadow-xs" />
                  </div>
                ) : (
                  <span className={`text-xs font-medium ${!day.isCurrentMonth ? 'text-[#BFBCAE]' : 'text-[#555447]'}`}>
                    {day.dayNum}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* This Month's Insight Card */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#EFEAD7] mt-5">
        <div className="flex items-start gap-3.5">
          <div className="flex-shrink-0">
            <MascotBrain size="sm" animated={false} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-[#737264] uppercase tracking-wider">
              {t.thisMonthInsight}
            </h3>
            <p className="text-[13px] font-medium leading-relaxed text-[#202019] mt-1">
              {t.monthlyInsightText}
            </p>
          </div>
        </div>

        {/* Frequency Gauge Bar matching reference */}
        <div className="mt-4 pt-1">
          <div className="w-full h-3 bg-[#EFEAD7] rounded-full overflow-hidden p-0.5 flex">
            {/* Active filled bar */}
            <div
              className="h-full bg-gradient-to-r from-[#6F8D45] via-[#A8BC78] to-[#F47C91] rounded-full transition-all duration-700"
              style={{ width: `${Math.max(25, tensionPercent)}%` }}
            />
            {/* Striped unfilled pattern on remainder */}
            <div className="flex-1 h-full opacity-40 bg-[repeating-linear-gradient(45deg,#D8D4C2,#D8D4C2_3px,#FFFFFF_3px,#FFFFFF_6px)]" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-[#737264] mt-2 px-1">
            <span>{t.rarely}</span>
            <span>{t.often}</span>
          </div>
        </div>
      </div>

      {/* Helpful For You Right Now */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-[#202019] mb-3 px-1 tracking-tight">
          {t.helpfulForYou}
        </h3>

        <div
          onClick={() => setActiveScreen('breathing')}
          className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#EFEAD7] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8E9AE]/50 border border-[#A8BC78]/40 flex items-center justify-center text-[#3D5834]">
              <CalIcon className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#202019]">
                {t.breatheAndReset}
              </p>
              <p className="text-xs text-[#737264]">
                {t.breatheDesc}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-[#F5F0D2] text-[#3D5834] px-3 py-1 rounded-full">
            5 min
          </span>
        </div>
      </div>

      {/* Day Details Drawer / Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#ECE7D4] animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#737264]">
                {selectedDate}
              </span>
              <button
                onClick={() => setSelectedDate(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
              >
                <X className="w-4 h-4 text-[#737264]" />
              </button>
            </div>

            {selectedEntry ? (
              <div>
                <div className="flex items-center gap-3 bg-[#F8F5E4] p-3 rounded-2xl mb-4">
                  <MoodCharacter mood={selectedEntry.mood} size={42} />
                  <div>
                    <h4 className="text-sm font-bold text-[#202019] capitalize">
                      {MOOD_DEFINITIONS[selectedEntry.mood].labelEn}
                    </h4>
                    <p className="text-xs text-[#737264]">
                      {selectedEntry.note || 'No notes added for this day.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    deleteCheckIn(selectedEntry.id);
                    setSelectedDate(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 py-2.5 rounded-full transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete entry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveEntry}>
                <p className="text-sm font-medium text-[#202019] mb-3">
                  Log your mood for this day:
                </p>
                <div className="flex items-center justify-between gap-1 mb-4">
                  {(['calm', 'anxious', 'sad', 'focused', 'frustrated', 'overwhelmed'] as MoodType[]).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setNewMood(m)}
                      className={`p-1.5 rounded-xl transition-all ${newMood === m ? 'bg-[#F5F0D2] ring-2 ring-[#6F8D45]' : 'hover:bg-neutral-100'}`}
                    >
                      <MoodCharacter mood={m} size={32} />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Optional journal note..."
                  className="w-full text-xs bg-[#F8F5E4] rounded-xl px-3 py-2.5 mb-4 border border-[#ECE7D4] focus:outline-none focus:ring-2 focus:ring-[#6F8D45]"
                />

                <button
                  type="submit"
                  className="w-full bg-[#1C1C17] text-white text-xs font-bold py-3 rounded-full hover:bg-black transition-all"
                >
                  Save check-in
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Privacy & History Management Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#ECE7D4]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#202019] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#6F8D45]" />
                {t.privacySafety}
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
              >
                <X className="w-4 h-4 text-[#737264]" />
              </button>
            </div>

            <p className="text-xs text-[#737264] leading-relaxed mb-4">
              {t.dataStoredLocally}
            </p>

            <div className="bg-[#FFF9E9] rounded-2xl p-3 border border-[#EFEAD7] text-xs font-medium text-[#555447] mb-5">
              <span>Total recorded entries: </span>
              <strong className="text-[#202019]">{historyEntries.length} check-ins</strong>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your local mood check-in history?")) {
                  clearHistory();
                  setShowPrivacyModal(false);
                }
              }}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 py-3 rounded-full transition-all"
            >
              <Trash2 className="w-4 h-4" />
              {t.clearData}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
