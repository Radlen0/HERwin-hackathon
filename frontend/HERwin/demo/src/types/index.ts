export type MoodType = 'calm' | 'anxious' | 'sad' | 'focused' | 'frustrated' | 'overwhelmed' | 'moderate';

export type Language = 'en' | 'fr' | 'derja';

export type ScreenType = 'home' | 'paint' | 'roadmap' | 'garden' | 'schedule' | 'breathing' | 'settings';

export interface MotivationalSpeech {
  id: string;
  title: string;
  speech: string;
  quote: string;
  category?: string;
  authorOrTone?: string;
}

export interface MoodItem {
  id: MoodType;
  labelEn: string;
  labelFr: string;
  labelDerja: string;
  color: string;
  textColor: string;
  bgColor: string;
  accentColor: string;
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  note?: string;
  intensity?: number;
  timestamp: number;
}

export interface ActionStep {
  title: string;
  duration_minutes: number;
  step_instruction: string;
  category?: string;
  completed?: boolean;
}

export interface ResetActivity {
  type: string;
  title: string;
  duration_minutes: number;
  guide_text: string;
}

export interface ProblemContext {
  core_trigger: string;
  why_it_happens: string;
  compassionate_insight: string;
}

export interface SolutionStrategy {
  immediate_fix: string;
  mindset_shift: string;
}

export interface AiPlan {
  language: string;
  acknowledgment: string;
  support_type: string;
  priority: string;
  problem_context?: ProblemContext;
  solution_strategy?: SolutionStrategy;
  actions: ActionStep[];
  reset_activity: ResetActivity;
  follow_up_question: string;
  culturally_relevant_encouragement?: string;
}

export interface CrisisContact {
  name: string;
  phone: string;
  description: string;
  available: string;
}

export interface CrisisPayload {
  isCrisis: boolean;
  crisisMessage?: {
    en: string;
    fr: string;
    derja: string;
  };
  contacts: CrisisContact[];
  safeSteps: string[];
}

export interface AdaptedRecommendation {
  adaptedState: 'supportive_pause' | 'reduce_friction' | 'gentle_progress';
  headline: string;
  message: string;
  recommendedNext: {
    type: string;
    title: string;
    actionDescription: string;
    emergencyAssistanceAvailable?: boolean;
    targetScreen?: 'home' | 'schedule' | 'breathing' | 'roadmap' | 'garden';
  };
}

// ================= Feature 1: Paint How You Feel =================
export interface PaintStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  size: number;
  isEraser?: boolean;
}

export interface StickerItem {
  id: string;
  type: 'heart' | 'star' | 'leaf' | 'sun' | 'cloud' | 'flower' | 'sparkle' | 'peace';
  x: number;
  y: number;
  size: number;
  color?: string;
}

export interface ArtReflectionResponse {
  reflectionText: string;
  userPromptMeaning: string;
  encouragement: string;
  suggestedNextStep?: {
    type: string;
    label: string;
    actionTarget: ScreenType;
  };
  reflectionQuestions: string[];
}

// ================= Feature 2: AI Task Roadmap =================
export interface RoadmapSubstep {
  id: string;
  title: string;
  duration_minutes: number;
  completed: boolean;
}

export interface RoadmapTask {
  id: string;
  title: string;
  course: string;
  deadline?: string;
  estimated_minutes: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  substeps: RoadmapSubstep[];
  dependencies?: string[];
  notes?: string;
  isMilestone?: boolean;
}

export interface RoadmapScheduleBlock {
  id: string;
  type: 'task' | 'break' | 'review' | 'milestone';
  title: string;
  duration_minutes: number;
  taskId?: string;
  substepId?: string;
  timeSlot?: string;
  completed?: boolean;
}

export interface RoadmapScheduleDay {
  dayName: string;
  dateStr: string;
  blocks: RoadmapScheduleBlock[];
}

export interface RoadmapPlan {
  analysis: {
    totalTasks: number;
    estimatedTotalMinutes: number;
    workloadFeasibility: 'manageable' | 'tight' | 'overloaded';
    conflictExplanation?: string;
    missingInfoNotice?: string;
  };
  priorityRationale: string;
  tasks: RoadmapTask[];
  schedule: RoadmapScheduleDay[];
  bufferNotice: string;
}

// ================= Feature 3: Nefes Bloom =================
export type ShopCategory = 'flower' | 'plant' | 'tree' | 'decoration' | 'house';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  iconType: string;
  growthLevelRequired?: number;
}

export interface PlacedGardenItem {
  instanceId: string;
  itemId: string;
  gridX: number; // 0 to 5
  gridY: number; // 0 to 4
  placedAt: number;
}

export type RewardType = 'study_task' | 'breathing_session' | 'reflection' | 'milestone' | 'restorative_break';

export interface DiamondTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  rewardType?: RewardType;
  referenceId?: string; // e.g. taskId, sessionId to prevent duplicate rewards
  timestamp: number;
}
