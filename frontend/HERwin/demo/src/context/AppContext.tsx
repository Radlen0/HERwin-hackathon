import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  MoodEntry,
  MoodType,
  ScreenType,
  PlacedGardenItem,
  DiamondTransaction,
  RewardType,
  RoadmapPlan
} from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { ambientAudio, SoundType } from '../utils/audioSynthesizer';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  userName: string;
  setUserName: (name: string) => void;
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  currentMood: MoodType;
  setCurrentMood: (mood: MoodType) => void;
  mindText: string;
  setMindText: (text: string) => void;
  historyEntries: MoodEntry[];
  addCheckIn: (mood: MoodType, note?: string) => void;
  deleteCheckIn: (id: string) => void;
  clearHistory: () => void;
  isAiModalOpen: boolean;
  aiAutoGenerate: boolean;
  setAiAutoGenerate: (val: boolean) => void;
  openAiModal: (initialPrompt?: string, autoGenerate?: boolean, mood?: MoodType) => void;
  closeAiModal: () => void;
  isWelcomeModalOpen: boolean;
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
  t: typeof TRANSLATIONS['en'];
  // Audio state
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  bgSound: SoundType;
  setBgSound: (sound: SoundType) => void;
  toggleAudio: () => void;
  // Feature 2: Roadmap State
  roadmapPlan: RoadmapPlan | null;
  setRoadmapPlan: (plan: RoadmapPlan | null) => void;
  toggleRoadmapTask: (taskId: string) => void;
  toggleRoadmapSubstep: (taskId: string, substepId: string) => void;
  // Feature 3: Nefes Bloom & Diamond Economy
  diamonds: number;
  diamondTransactions: DiamondTransaction[];
  rewardDiamond: (amount: number, reason: string, rewardType?: RewardType, referenceId?: string) => boolean;
  spendDiamond: (amount: number, reason: string) => boolean;
  placedGardenItems: PlacedGardenItem[];
  placeGardenItem: (itemId: string, gridX: number, gridY: number) => void;
  removeGardenItem: (instanceId: string) => void;
  recentRewardToast: { amount: number; message: string } | null;
  clearRewardToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial seeds matching the reference screenshot calendar
const INITIAL_ENTRIES: MoodEntry[] = [
  { id: '1', date: '2026-10-01', mood: 'calm', note: 'Morning tea on balcony', timestamp: 1727769600000 },
  { id: '2', date: '2026-10-02', mood: 'anxious', note: 'Project deadline announcement', timestamp: 1727856000000 },
  { id: '3', date: '2026-10-08', mood: 'calm', note: 'Studying at library with Sarah', timestamp: 1728374400000 },
  { id: '4', date: '2026-10-09', mood: 'anxious', note: 'Midterm test revision', timestamp: 1728460800000 },
  { id: '5', date: '2026-10-10', mood: 'frustrated', note: 'Code error bugged for 3 hours', timestamp: 1728547200000 },
  { id: '6', date: '2026-10-11', mood: 'anxious', note: 'Presentation anxiety', timestamp: 1728633600000 },
  { id: '7', date: '2026-10-12', mood: 'sad', note: 'Tired and feeling isolated', timestamp: 1728720000000 },
  { id: '8', date: '2026-10-13', mood: 'frustrated', note: 'Traffic and rain in Tunis', timestamp: 1728806400000 },
  { id: '9', date: '2026-10-14', mood: 'focused', note: 'Finished chapter 4 successfully', timestamp: 1728892800000 },
  { id: '10', date: '2026-10-15', mood: 'calm', note: 'Walk in Sidi Bou Said', timestamp: 1728979200000 },
  { id: '11', date: '2026-10-16', mood: 'sad', note: 'Missing family back home', timestamp: 1729065600000 },
  { id: '12', date: '2026-10-17', mood: 'calm', note: 'Breathed with Nefes app', timestamp: 1729152000000 },
  { id: '13', date: '2026-10-18', mood: 'calm', note: 'Relaxing weekend study', timestamp: 1729238400000 },
  { id: '14', date: '2026-10-19', mood: 'calm', note: 'Good sleep', timestamp: 1729324800000 },
  { id: '15', date: '2026-10-20', mood: 'calm', note: 'Clear head today', timestamp: 1729411200000 },
  { id: '16', date: '2026-10-21', mood: 'overwhelmed', note: 'Too many assignments due', timestamp: 1729497600000 },
  { id: '17', date: '2026-10-22', mood: 'calm', note: 'Took it one step at a time', timestamp: 1729584000000 },
  { id: '18', date: '2026-10-23', mood: 'frustrated', note: 'Group project partner disappeared', timestamp: 1729670400000 },
  { id: '19', date: '2026-10-24', mood: 'anxious', note: 'Interview prep', timestamp: 1729756800000 },
  { id: '20', date: '2026-10-25', mood: 'calm', note: 'Interview went well alhamdulillah', timestamp: 1729843200000 },
  { id: '21', date: '2026-10-26', mood: 'calm', note: 'Rest day', timestamp: 1729929600000 },
  { id: '22', date: '2026-10-27', mood: 'calm', note: 'Light revision', timestamp: 1730016000000 },
  { id: '23', date: '2026-10-28', mood: 'calm', note: 'Coffee with classmates', timestamp: 1730102400000 },
  { id: '24', date: '2026-10-29', mood: 'overwhelmed', note: 'Late night cramming', timestamp: 1730188800000 },
  { id: '25', date: '2026-10-30', mood: 'anxious', note: 'Final exam day', timestamp: 1730275200000 }
];

// Initial default garden items so user starts with a cozy sprout
const DEFAULT_GARDEN_ITEMS: PlacedGardenItem[] = [
  { instanceId: 'init-1', itemId: 'flower_jasmine', gridX: 2, gridY: 2, placedAt: Date.now() - 3600000 },
  { instanceId: 'init-2', itemId: 'plant_mint', gridX: 3, gridY: 2, placedAt: Date.now() - 7200000 }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('nefes_lang') as Language) || 'en';
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('nefes_user') || 'Emma';
  });

  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [currentMood, setCurrentMood] = useState<MoodType>('calm');
  const [mindText, setMindText] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiAutoGenerate, setAiAutoGenerate] = useState<boolean>(false);
  // Initial 3-mood onboarding modal: shown when first opened the app
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(true);

  // Audio player state
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioVolume, setAudioVolumeState] = useState<number>(0.7);
  const [bgSound, setBgSoundState] = useState<SoundType>('forest');

  // History state
  const [historyEntries, setHistoryEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('nefes_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ENTRIES;
      }
    }
    return INITIAL_ENTRIES;
  });

  // Feature 2: Roadmap State
  const [roadmapPlan, setRoadmapPlanState] = useState<RoadmapPlan | null>(() => {
    const saved = localStorage.getItem('nefes_roadmap_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Feature 3: Nefes Bloom Diamond Economy
  const [diamonds, setDiamonds] = useState<number>(() => {
    const saved = localStorage.getItem('nefes_diamonds');
    return saved !== null ? Number(saved) : 35; // Welcome bonus for new students
  });

  const [diamondTransactions, setDiamondTransactions] = useState<DiamondTransaction[]>(() => {
    const saved = localStorage.getItem('nefes_diamond_txs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      { id: 'init-bonus', type: 'earn', amount: 35, reason: 'Welcome to Nefes Sanctuary', timestamp: Date.now() - 86400000 }
    ];
  });

  const [placedGardenItems, setPlacedGardenItems] = useState<PlacedGardenItem[]>(() => {
    const saved = localStorage.getItem('nefes_garden_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_GARDEN_ITEMS;
      }
    }
    return DEFAULT_GARDEN_ITEMS;
  });

  const [recentRewardToast, setRecentRewardToast] = useState<{ amount: number; message: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('nefes_history', JSON.stringify(historyEntries));
  }, [historyEntries]);

  useEffect(() => {
    localStorage.setItem('nefes_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('nefes_user', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('nefes_diamonds', String(diamonds));
  }, [diamonds]);

  useEffect(() => {
    localStorage.setItem('nefes_diamond_txs', JSON.stringify(diamondTransactions));
  }, [diamondTransactions]);

  useEffect(() => {
    localStorage.setItem('nefes_garden_items', JSON.stringify(placedGardenItems));
  }, [placedGardenItems]);

  useEffect(() => {
    if (roadmapPlan) {
      localStorage.setItem('nefes_roadmap_plan', JSON.stringify(roadmapPlan));
    }
  }, [roadmapPlan]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const addCheckIn = (mood: MoodType, note?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: todayStr,
      mood,
      note: note || (mindText.trim() ? mindText.trim() : undefined),
      timestamp: Date.now()
    };
    setCurrentMood(mood);
    setHistoryEntries(prev => {
      const filtered = prev.filter(e => e.date !== todayStr);
      return [newEntry, ...filtered];
    });

    // Reward for completing daily reflection check-in
    rewardDiamond(5, 'Completed daily check-in', 'reflection', `checkin-${todayStr}`);
  };

  const deleteCheckIn = (id: string) => {
    setHistoryEntries(prev => prev.filter(e => e.id !== id));
  };

  const clearHistory = () => {
    setHistoryEntries([]);
  };

  const openAiModal = (initialPrompt?: string, autoGenerate: boolean = false, mood?: MoodType) => {
    if (mood) {
      setCurrentMood(mood);
    }
    if (initialPrompt !== undefined) {
      setMindText(initialPrompt);
    }
    setAiAutoGenerate(!!autoGenerate);
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
    setAiAutoGenerate(false);
  };

  const openWelcomeModal = () => {
    setIsWelcomeModalOpen(true);
  };

  const closeWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  const setAudioVolume = (vol: number) => {
    setAudioVolumeState(vol);
    ambientAudio.setVolume(vol);
  };

  const setBgSound = (sound: SoundType) => {
    setBgSoundState(sound);
    ambientAudio.setSoundType(sound);
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      ambientAudio.stop();
      setIsAudioPlaying(false);
    } else {
      ambientAudio.play(bgSound);
      ambientAudio.setVolume(audioVolume);
      setIsAudioPlaying(true);
    }
  };

  // Reward Diamond with duplicate prevention
  const rewardDiamond = (amount: number, reason: string, rewardType?: RewardType, referenceId?: string): boolean => {
    if (referenceId) {
      const alreadyRewarded = diamondTransactions.some(
        tx => tx.type === 'earn' && tx.referenceId === referenceId
      );
      if (alreadyRewarded) {
        return false;
      }
    }

    const newTx: DiamondTransaction = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      type: 'earn',
      amount,
      reason,
      rewardType,
      referenceId,
      timestamp: Date.now()
    };

    setDiamonds(prev => prev + amount);
    setDiamondTransactions(prev => [newTx, ...prev]);

    setRecentRewardToast({ amount, message: reason });
    setTimeout(() => {
      setRecentRewardToast(null);
    }, 4000);

    return true;
  };

  const clearRewardToast = () => {
    setRecentRewardToast(null);
  };

  // Spend Diamond
  const spendDiamond = (amount: number, reason: string): boolean => {
    if (diamonds < amount) {
      return false;
    }

    const newTx: DiamondTransaction = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      type: 'spend',
      amount,
      reason,
      timestamp: Date.now()
    };

    setDiamonds(prev => prev - amount);
    setDiamondTransactions(prev => [newTx, ...prev]);
    return true;
  };

  // Garden Placement
  const placeGardenItem = (itemId: string, gridX: number, gridY: number) => {
    const newItem: PlacedGardenItem = {
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      itemId,
      gridX,
      gridY,
      placedAt: Date.now()
    };

    setPlacedGardenItems(prev => {
      // replace if spot occupied
      const filtered = prev.filter(p => !(p.gridX === gridX && p.gridY === gridY));
      return [...filtered, newItem];
    });
  };

  const removeGardenItem = (instanceId: string) => {
    setPlacedGardenItems(prev => prev.filter(p => p.instanceId !== instanceId));
  };

  // Roadmap task actions
  const setRoadmapPlan = (plan: RoadmapPlan | null) => {
    setRoadmapPlanState(plan);
  };

  const toggleRoadmapTask = (taskId: string) => {
    if (!roadmapPlan) return;

    let justCompleted = false;

    const updatedTasks = roadmapPlan.tasks.map(task => {
      if (task.id === taskId) {
        const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
        if (nextStatus === 'completed') {
          justCompleted = true;
        }
        return {
          ...task,
          status: nextStatus as any,
          substeps: task.substeps.map(s => ({ ...s, completed: nextStatus === 'completed' }))
        };
      }
      return task;
    });

    setRoadmapPlanState({
      ...roadmapPlan,
      tasks: updatedTasks
    });

    if (justCompleted) {
      const taskObj = roadmapPlan.tasks.find(t => t.id === taskId);
      rewardDiamond(10, `Completed task: ${taskObj?.title || 'Study Task'}`, 'study_task', `task-${taskId}`);
    }
  };

  const toggleRoadmapSubstep = (taskId: string, substepId: string) => {
    if (!roadmapPlan) return;

    let taskNowAllDone = false;
    let targetTask: any = null;

    const updatedTasks = roadmapPlan.tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubs = task.substeps.map(sub => {
          if (sub.id === substepId) {
            return { ...sub, completed: !sub.completed };
          }
          return sub;
        });

        const allDone = updatedSubs.length > 0 && updatedSubs.every(s => s.completed);
        if (allDone && task.status !== 'completed') {
          taskNowAllDone = true;
          targetTask = task;
        }

        return {
          ...task,
          status: allDone ? ('completed' as const) : task.status,
          substeps: updatedSubs
        };
      }
      return task;
    });

    setRoadmapPlanState({
      ...roadmapPlan,
      tasks: updatedTasks
    });

    if (taskNowAllDone && targetTask) {
      rewardDiamond(10, `Completed task: ${targetTask.title}`, 'study_task', `task-${taskId}`);
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        userName,
        setUserName,
        activeScreen,
        setActiveScreen,
        currentMood,
        setCurrentMood,
        mindText,
        setMindText,
        historyEntries,
        addCheckIn,
        deleteCheckIn,
        clearHistory,
        isAiModalOpen,
        aiAutoGenerate,
        setAiAutoGenerate,
        openAiModal,
        closeAiModal,
        isWelcomeModalOpen,
        openWelcomeModal,
        closeWelcomeModal,
        t,
        isAudioPlaying,
        setIsAudioPlaying,
        audioVolume,
        setAudioVolume,
        bgSound,
        setBgSound,
        toggleAudio,
        roadmapPlan,
        setRoadmapPlan,
        toggleRoadmapTask,
        toggleRoadmapSubstep,
        diamonds,
        diamondTransactions,
        rewardDiamond,
        spendDiamond,
        placedGardenItems,
        placeGardenItem,
        removeGardenItem,
        recentRewardToast,
        clearRewardToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
