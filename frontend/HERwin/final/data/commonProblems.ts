import { MoodType, Language } from '../types';

export interface CommonProblem {
  id: string;
  en: string;
  fr: string;
  derja: string;
  category?: string;
  typicalEnergy?: 'low' | 'medium' | 'high';
  estimatedMinutes?: number;
}

export const COMMON_PROBLEMS_BY_MOOD: Record<MoodType, CommonProblem[]> = {
  moderate: [
    {
      id: 'mod_rev',
      en: 'Overwhelmed by revision',
      fr: 'Submergé(e) par les révisions',
      derja: 'Daya3 m3a el revision',
      category: 'Revision',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'mod_focus',
      en: 'Hard to focus today',
      fr: "Difficile de se concentrer aujourd'hui",
      derja: 'Mochkel fi tarkiz lyoum',
      category: 'Focus',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    },
    {
      id: 'mod_exam',
      en: 'Pre-exam anxiety',
      fr: 'Anxiété pré-examen',
      derja: 'Stress 9bal el imti7an',
      category: 'Anxiety',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'mod_start',
      en: "Don't know where to start",
      fr: 'Par quoi commencer en premier ?',
      derja: 'Ma na3rech mnin nebda',
      category: 'Clarity',
      typicalEnergy: 'medium',
      estimatedMinutes: 3
    },
    {
      id: 'mod_drain',
      en: 'Mentally drained after lectures',
      fr: 'Épuisé(e) mentalement après les cours',
      derja: 'T3ebt men kothret les cours',
      category: 'Fatigue',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    },
    {
      id: 'mod_procrast',
      en: 'Procrastination paralysis',
      fr: 'Bloqué(e) dans la procrastination',
      derja: 'N2ajjel fel khedma w ma najamtech nebda',
      category: 'Action',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    }
  ],
  frustrated: [
    {
      id: 'fru_focus',
      en: 'Hard to focus today',
      fr: "Difficile de se concentrer aujourd'hui",
      derja: 'Mochkel fi tarkiz lyoum',
      category: 'Focus',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'fru_rev',
      en: 'Overwhelmed by revision',
      fr: 'Submergé(e) par les révisions',
      derja: 'Daya3 m3a el revision',
      category: 'Revision',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'fru_bug',
      en: 'Code / project bugged for hours',
      fr: 'Code ou exercice bloqué depuis des heures',
      derja: 'Bug wala khedma wa9fa swaye3',
      category: 'Blockage',
      typicalEnergy: 'high',
      estimatedMinutes: 5
    },
    {
      id: 'fru_concept',
      en: 'Stuck on a difficult concept',
      fr: 'Bloqué(e) sur un chapitre complexe',
      derja: 'Fekra s3iba ma fhemthech',
      category: 'Clarity',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'fru_group',
      en: 'Unfair group project load',
      fr: 'Pression d’un projet de groupe',
      derja: 'Khedmet groupe w ena hazzez kol chay',
      category: 'Friction',
      typicalEnergy: 'high',
      estimatedMinutes: 5
    },
    {
      id: 'fru_exam',
      en: 'Pre-exam anxiety',
      fr: 'Anxiété pré-examen',
      derja: 'Stress 9bal el imti7an',
      category: 'Anxiety',
      typicalEnergy: 'high',
      estimatedMinutes: 5
    }
  ],
  calm: [
    {
      id: 'calm_focus',
      en: 'Hard to focus today',
      fr: "Difficile de se concentrer aujourd'hui",
      derja: 'Mochkel fi tarkiz lyoum',
      category: 'Focus',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'calm_sustain',
      en: 'Sustain focus & prevent burnout',
      fr: 'Maintenir ce calme et éviter le surmenage',
      derja: 'N7eb nkamemel b hal hedou',
      category: 'Sustain',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'calm_routine',
      en: 'Planning a calm study routine',
      fr: "Planifier une routine d'étude sereine",
      derja: 'Tandhim wa9t l’khedma b rtiye7',
      category: 'Routine',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'calm_rev',
      en: 'Light revision without rushing',
      fr: 'Révisions légères sans précipitation',
      derja: 'Moraja3a khfifa men ghir zorb',
      category: 'Revision',
      typicalEnergy: 'medium',
      estimatedMinutes: 10
    },
    {
      id: 'calm_exam',
      en: 'Pre-exam anxiety',
      fr: 'Anxiété pré-examen',
      derja: 'Stress 9bal el imti7an',
      category: 'Preparation',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    }
  ],
  anxious: [
    {
      id: 'anx_exam',
      en: 'Pre-exam anxiety',
      fr: 'Anxiété pré-examen',
      derja: 'Stress 9bal el imti7an',
      category: 'Anxiety',
      typicalEnergy: 'high',
      estimatedMinutes: 5
    },
    {
      id: 'anx_rev',
      en: 'Overwhelmed by revision',
      fr: 'Submergé(e) par les révisions',
      derja: 'Daya3 m3a el revision',
      category: 'Revision',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'anx_focus',
      en: 'Hard to focus today',
      fr: "Difficile de se concentrer aujourd'hui",
      derja: 'Mochkel fi tarkiz lyoum',
      category: 'Focus',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    },
    {
      id: 'anx_fail',
      en: 'Fear of failing the module',
      fr: 'Peur d’échouer au module',
      derja: 'Khaief ma nvaliidich el module',
      category: 'Fear',
      typicalEnergy: 'high',
      estimatedMinutes: 5
    },
    {
      id: 'anx_racing',
      en: 'Racing thoughts before studying',
      fr: 'Pensées agitées avant de réviser',
      derja: 'Mokhi ykhammem barcha 9bal el khedma',
      category: 'Thoughts',
      typicalEnergy: 'medium',
      estimatedMinutes: 3
    }
  ],
  overwhelmed: [
    {
      id: 'ovr_rev',
      en: 'Overwhelmed by revision',
      fr: 'Submergé(e) par les révisions',
      derja: 'Daya3 m3a el revision',
      category: 'Revision',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    },
    {
      id: 'ovr_focus',
      en: 'Hard to focus today',
      fr: "Difficile de se concentrer aujourd'hui",
      derja: 'Mochkel fi tarkiz lyoum',
      category: 'Focus',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    },
    {
      id: 'ovr_tasks',
      en: 'Too many assignments due at once',
      fr: 'Trop de devoirs à rendre en même temps',
      derja: 'Barcha devoirs fard wa9t',
      category: 'Deadlines',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    },
    {
      id: 'ovr_exam',
      en: 'Pre-exam anxiety',
      fr: 'Anxiété pré-examen',
      derja: 'Stress 9bal el imti7an',
      category: 'Anxiety',
      typicalEnergy: 'high',
      estimatedMinutes: 5
    },
    {
      id: 'ovr_backlog',
      en: 'Backlog of lectures to catch up',
      fr: 'Accumulation de cours en retard',
      derja: 'Kaddast cours barcha w lazem nkhallashom',
      category: 'Backlog',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    }
  ],
  sad: [
    {
      id: 'sad_focus',
      en: 'Hard to focus today',
      fr: "Difficile de se concentrer aujourd'hui",
      derja: 'Mochkel fi tarkiz lyoum',
      category: 'Focus',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    },
    {
      id: 'sad_rev',
      en: 'Overwhelmed by revision',
      fr: 'Submergé(e) par les révisions',
      derja: 'Daya3 m3a el revision',
      category: 'Revision',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    },
    {
      id: 'sad_energy',
      en: 'Lacking energy to open books',
      fr: 'Manque d’énergie pour ouvrir un livre',
      derja: 'Ma 3andich 9owwa bech n7ell ktab',
      category: 'Energy',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    },
    {
      id: 'sad_iso',
      en: 'Feeling isolated or disconnected',
      fr: 'Sentiment d’isolement ou de solitude',
      derja: 'N7ess fi rou7i wa7di w b3id',
      category: 'Isolation',
      typicalEnergy: 'low',
      estimatedMinutes: 5
    }
  ],
  focused: [
    {
      id: 'foc_deep',
      en: 'Structuring a 2-hour revision block',
      fr: 'Structurer un bloc de 2h de révision',
      derja: 'N9assem 2 swaye3 revision',
      category: 'Structure',
      typicalEnergy: 'high',
      estimatedMinutes: 5
    },
    {
      id: 'foc_recall',
      en: 'Active recall & test problem practice',
      fr: 'Rappel actif & exercices types',
      derja: 'Khedmet exercices w recall',
      category: 'Method',
      typicalEnergy: 'high',
      estimatedMinutes: 10
    },
    {
      id: 'foc_focus',
      en: 'Hard to focus today',
      fr: "Difficile de se concentrer aujourd'hui",
      derja: 'Mochkel fi tarkiz lyoum',
      category: 'Focus',
      typicalEnergy: 'medium',
      estimatedMinutes: 5
    }
  ]
};

export function getCommonProblems(mood: MoodType, lang: Language): { id: string; label: string; problem: CommonProblem }[] {
  const problems = COMMON_PROBLEMS_BY_MOOD[mood] || COMMON_PROBLEMS_BY_MOOD.moderate;
  return problems.map(p => ({
    id: p.id,
    label: lang === 'fr' ? p.fr : lang === 'derja' ? p.derja : p.en,
    problem: p
  }));
}
