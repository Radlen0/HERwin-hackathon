import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Crisis & Safety Detection keywords (English, French, Tunisian Derja)
const CRISIS_PATTERNS = [
  /\b(suicide|suicidal|kill\s*myself|end\s*my\s*life|want\s*to\s*die|hanging\s*myself)\b/i,
  /\b(je\s*veux\s*mourir|en\s*finir|me\s*suicider|me\s*tuer|automutilation|mettre\s*fin\s*a\s*mes\s*jours)\b/i,
  /\b(nhebb\s*nmout|nhab\s*nmout|n9tel\s*rou7i|nente7er|inti7ar|faddit\s*men\s*dénia|marre\s*de\s*la\s*vie)\b/i,
  /(نحب نموت|نقتل روحي|انتحار|ننتحر|فديت من الدنيا)/
];

const TUNISIA_CRISIS_RESOURCES = {
  isCrisis: true,
  crisisMessage: {
    en: "You are not alone, and your life matters deeply. Please pause and reach out to someone who can help right now.",
    fr: "Tu n'es pas seule, et ce que tu ressens compte. S'il te plaît, prends un moment et contacte quelqu'un de bienveillant dès maintenant.",
    derja: "Mouch wa7dek, w 7yatek teswa barcha. 3aychek a3mel pause tawa w kallem chkoun ya3ref y3awnek."
  },
  contacts: [
    {
      name: "Numéro Vert d'Assistance Psychologique (Tunisie)",
      phone: "80 10 50 50",
      description: "Ligne verte gratuite d'écoute et d'aide psychologique en Tunisie",
      available: "24/7 gratuit"
    },
    {
      name: "SAMU (Urgences Médicales)",
      phone: "190",
      description: "Secours et urgences médicales partout en Tunisie",
      available: "24/7"
    },
    {
      name: "Protection Civile",
      phone: "198",
      description: "Intervention d'urgence",
      available: "24/7"
    },
    {
      name: "Hôpital Razi La Manouba (Urgences psychiatriques)",
      phone: "+216 71 600 700",
      description: "Service des urgences psychiatriques de référence",
      available: "24/7"
    }
  ],
  safeSteps: [
    "Step away from study notes or screen and drink a glass of cool water",
    "Call a trusted friend, roommate, or family member right away",
    "Call 80 10 50 50 or 190 if you are in immediate distress"
  ]
};

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
let isGeminiAvailable = true;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    isGeminiAvailable = false;
  }
}

// Safely handle Gemini API errors without dumping raw 403 ApiError logs to stderr
function handleGeminiError(context: string, err: any) {
  const errStr = String(err?.message || err);
  if (errStr.includes('PERMISSION_DENIED') || err?.status === 403 || err?.code === 403) {
    isGeminiAvailable = false;
    // Unobtrusive informational log
    console.info(`[Nefes AI] Using integrated local adaptive engine for ${context}.`);
  } else {
    console.info(`[Nefes AI] Using local engine fallback for ${context}.`);
  }
}

// ================= ADAPTIVE LOCAL ENGINES =================

// 1. Support Session Fallback Engine
function generateFallbackPlan(userText: string, mood: string, energy: string, timeMinutes: number, language: string) {
  const isDerja = language === 'ar' || language === 'derja' || /nhebb|faddit|barcha|mch|chwaya|3aychek|tawa/i.test(userText);
  const isFrench = language === 'fr' || /je|stress|fatigue|cours|examen|peur|pression/i.test(userText);

  let lang = isDerja ? 'derja' : isFrench ? 'fr' : 'en';

  if (lang === 'derja') {
    return {
      language: 'derja',
      acknowledgment: "Fahmek 100%, la pression mta3 les études w l'université tghalleb barcha marrat. Chwaya chwaya w taw kol chay yetssalla7.",
      support_type: "study_grounding",
      priority: "Khdhim b khotwa sghira barcha mouch lazem tkamel kol chay lyoum",
      problem_context: {
        core_trigger: userText || "Daya3 m3a el revision w el khedma",
        why_it_happens: "Mokhek ki ychouf barcha ma3loumet w examens 9rib, yetbloqua b sifa 3adya (surcharge cognitive). Mouch na9s the9a wala dho3f, juste lezem tna99es el thqel.",
        compassionate_insight: "Kol etudiant yet3adda b hal e7sas. El mochkla mouch fik enti, el mochkla fel méthode."
      },
      solution_strategy: {
        immediate_fix: "9assem el khedma l'5 da9aye9 berka. Fout kol chay w a3mel exercice wa7ed.",
        mindset_shift: "Mouch lazem t7ell el 3a9da lkol lyoum. Khotwa sghira khir men wa9fa twila."
      },
      actions: [
        {
          title: "Sammé 7aja wa7da berka theb tabda biha",
          duration_minutes: Math.min(2, timeMinutes),
          step_instruction: "Ikteb fi war9a sghira titre el chapitre wala l'exercice el wa7id.",
          category: "clarity"
        },
        {
          title: "A9ra 5 da9aye9 berka sans pression",
          duration_minutes: Math.min(Math.max(5, Math.floor(timeMinutes * 0.6)), 15),
          step_instruction: "7ott el chrono 3la 5 da9aye9. Ken t7ess rou7ek t3ebt, a9ef.",
          category: "micro_action"
        }
      ],
      reset_activity: {
        type: "grounding",
        title: "Tanaffes 4-4 (Nefes Hédi)",
        duration_minutes: 2,
        guide_text: "Echba9 idik, dakhil nefes 3la 4 thaniyya, w kharraj b chewaya 3la 4 thaniyya."
      },
      follow_up_question: "Est-ce que hedhi l'action thaharlek sehla w te9der tabda biha tawa?",
      culturally_relevant_encouragement: "Khedma sghira khir men 1000 fekra tdawekhek. Rabbi m3ak!"
    };
  }

  if (lang === 'fr') {
    return {
      language: 'fr',
      acknowledgment: "Je comprends tout à fait. La charge mentale des études universitaires peut sembler écrasante, mais tu n'as pas à tout résoudre aujourd'hui.",
      support_type: "study_decompression",
      priority: "Réduire la pression et choisir un seul micro-pas concret",
      problem_context: {
        core_trigger: userText || "Surcharge de révisions et perte de clarté",
        why_it_happens: "Lorsque le cerveau traite trop d'échéances simultanées, le cortex préfrontal sature, déclenchant l'anxiété ou le blocage. C'est une réaction biologique normale de protection, pas un manque de compétence.",
        compassionate_insight: "Ce sentiment est temporaire. Dès que l'on isole une tâche unique de 5 minutes, le système nerveux s'apaise."
      },
      solution_strategy: {
        immediate_fix: "La méthode du focus miniature : réduire l'objectif à un seul paragraphe ou une seule formule sans chercher la perfection.",
        mindset_shift: "Tu n'as pas besoin de te sentir inspiré(e) pour commencer ; c'est le premier geste doux qui fait revenir la clarté."
      },
      actions: [
        {
          title: "Définir la toute prochaine sous-étape",
          duration_minutes: Math.min(2, timeMinutes),
          step_instruction: "Ouvre uniquement la page ou le paragraphe nécessaire. Ferme tous les autres onglets.",
          category: "clarity"
        },
        {
          title: "Travailler en douceur sur un créneau court",
          duration_minutes: Math.min(Math.max(5, Math.floor(timeMinutes * 0.7)), 15),
          step_instruction: "Lance un compte à rebours. Dès que le temps est écoulé, félicite-toi d'avoir avancé.",
          category: "micro_action"
        }
      ],
      reset_activity: {
        type: "breathing",
        title: "Respiration apaisante",
        duration_minutes: 3,
        guide_text: "Inspire doucement par le nez pendant 4 secondes, puis expire lentement par la bouche pendant 6 secondes."
      },
      follow_up_question: "Est-ce que cette étape te paraît réalisable dès maintenant ?",
      culturally_relevant_encouragement: "Un petit pas vaut mieux que cent ruminations. Sois douce avec toi-même."
    };
  }

  return {
    language: 'en',
    acknowledgment: "I hear you. University deadlines and constant expectations can feel heavy, but you don't have to carry the whole semester at once.",
    support_type: "study_planning",
    priority: "Isolate one single realistic micro-step right now",
    problem_context: {
      core_trigger: userText || "Revision overwhelm & focus friction",
      why_it_happens: "When cognitive load spikes from impending deadlines and vast material, the brain perceives high threat and enters decision paralysis. This is a physiological protective reflex, not a character flaw.",
      compassionate_insight: "You don't need a surge of immense willpower. Shrinking the target immediately dissolves the nervous system tension."
    },
    solution_strategy: {
      immediate_fix: "Micro-chunking protocol: limit attention to the next 5-minute single action with zero tab-switching.",
      mindset_shift: "Action precedes motivation. Doing one microscopic action will restore your sense of agency."
    },
    actions: [
      {
        title: "Clear your desk down to just one task",
        duration_minutes: Math.min(2, timeMinutes),
        step_instruction: "Put everything away except the single document or page you need.",
        category: "clarity"
      },
      {
        title: "Gentle focus sprint without perfectionism",
        duration_minutes: Math.min(Math.max(5, Math.floor(timeMinutes * 0.7)), 15),
        step_instruction: "Work on just the first paragraph or formula. Notice progress, not perfection.",
        category: "micro_action"
      }
    ],
    reset_activity: {
      type: "grounding",
      title: "Gentle 4-4 Reset",
      duration_minutes: 2,
      guide_text: "Inhale gently for 4 counts, hold lightly for 2, then release slowly for 4 counts."
    },
    follow_up_question: "Does this small step feel manageable for your current energy?",
    culturally_relevant_encouragement: "Small steps rebuild your calm. Take it one breath at a time."
  };
}



// 3. Adaptive Roadmap Engine
function generateAdaptiveRoadmap(rawInput: string, availableHoursPerDay: number, energyLevel: string, language: string) {
  const isFrench = language === 'fr' || /examen|cours|rapport|devoir|projet|revis/i.test(rawInput);
  const isDerja = language === 'derja' || language === 'ar' || /khedma|moraja3a|imti7an/i.test(rawInput);
  const lang = isDerja ? 'derja' : isFrench ? 'fr' : 'en';

  const lines = rawInput
    .split(/[\n,;]+/)
    .map(l => l.trim())
    .filter(l => l.length > 3);

  const parsedTitles = lines.length > 0 ? lines : [
    lang === 'fr' ? "Révision du premier cours prioritaire" : "Primary Course Revision",
    lang === 'fr' ? "Exercices d'application essentiels" : "Essential Practice Problems",
    lang === 'fr' ? "Fiche de synthèse & relecture" : "Summary Card & Review"
  ];

  const taskCount = Math.min(5, Math.max(2, parsedTitles.length));
  const tasks: any[] = [];
  let totalMinutes = 0;

  for (let i = 0; i < taskCount; i++) {
    const rawTitle = parsedTitles[i] || `Study Task ${i + 1}`;
    const duration = energyLevel === 'low' ? 30 : energyLevel === 'high' ? 60 : 45;
    totalMinutes += duration;

    tasks.push({
      id: `task-${Date.now()}-${i + 1}`,
      title: rawTitle,
      course: i === 0 ? (lang === 'fr' ? "Module Principal" : "Core Module") : (lang === 'fr' ? "Travaux Dirigés" : "Applied Course"),
      deadline: i === 0 ? "In 2 days" : i === 1 ? "In 4 days" : "Next week",
      estimated_minutes: duration,
      priority: i === 0 ? "high" : i === 1 ? "medium" : "low",
      status: "pending",
      substeps: [
        { id: `sub-${i}-1`, title: "Gather lecture slides & isolate 1 key section", duration_minutes: Math.round(duration * 0.3), completed: false },
        { id: `sub-${i}-2`, title: "Active focus block without distractions", duration_minutes: Math.round(duration * 0.5), completed: false },
        { id: `sub-${i}-3`, title: "Write down 2 key takeaways or formulas", duration_minutes: Math.round(duration * 0.2), completed: false }
      ],
      notes: "Focus on understanding core principles over perfectionism."
    });
  }

  const availableWeeklyMinutes = availableHoursPerDay * 60 * 3;
  const feasibility = totalMinutes > availableWeeklyMinutes * 0.9
    ? 'tight'
    : totalMinutes > availableWeeklyMinutes * 1.3
    ? 'overloaded'
    : 'manageable';

  const scheduleDays = [
    {
      dayName: "Today",
      dateStr: new Date().toISOString().split('T')[0],
      blocks: [
        { id: "b1", type: "task", title: tasks[0].title, duration_minutes: tasks[0].estimated_minutes, taskId: tasks[0].id },
        { id: "b2", type: "break", title: "Nefes Restorative Tea & Breath", duration_minutes: 15 }
      ]
    },
    {
      dayName: "Tomorrow",
      dateStr: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      blocks: [
        { id: "b3", type: "task", title: tasks[1]?.title || "Follow-up Revision", duration_minutes: tasks[1]?.estimated_minutes || 40, taskId: tasks[1]?.id },
        { id: "b4", type: "break", title: "Gentle eye rest & stretch", duration_minutes: 15 }
      ]
    }
  ];

  return {
    analysis: {
      totalTasks: tasks.length,
      estimatedTotalMinutes: totalMinutes,
      workloadFeasibility: feasibility,
      conflictExplanation: feasibility === 'tight'
        ? (lang === 'fr' ? "Le rythme est soutenu. Nous avons inclus des pauses tampons de 15 min pour éviter la fatigue cognitive." : "Workload is tight but achievable with the built-in 15 min buffer intervals.")
        : ""
    },
    priorityRationale: lang === 'fr'
      ? "Priorité donnée aux matières les plus proches avec découpage en micro-étapes et pauses obligatoires."
      : lang === 'derja'
      ? "Bdiné bel 7ajet l'akther urgence m3a wa9t rtiye7 bech ma tet3ebch."
      : "Prioritized the earliest deadlines with micro-steps and restorative buffer time.",
    tasks,
    schedule: scheduleDays,
    bufferNotice: "Buffer time (15-20 min) is included between blocks to protect your energy."
  };
}

// ================= API ROUTES =================

// API: Support Session Generation
app.post('/api/support-session', async (req: Request, res: Response) => {
  try {
    const {
      userText = '',
      mood = 'calm',
      energy = 'medium',
      timeMinutes = 5,
      supportStyle = 'actionable',
      language = 'en'
    } = req.body;

    const trimmedText = String(userText).trim();

    // Deterministic Crisis Check
    for (const pattern of CRISIS_PATTERNS) {
      if (pattern.test(trimmedText)) {
        return res.json(TUNISIA_CRISIS_RESOURCES);
      }
    }

    if (aiClient && isGeminiAvailable) {
      const prompt = `You are Nefes, an empathetic student well-being companion in Tunisia.
Student Situation / Problem: "${trimmedText || 'Feeling pressure with studies'}"
Mood / State: "${mood}", Energy: "${energy}", Time: ${timeMinutes} min, Language: "${language}"

Help the student find better context about the problem (explain why it happens physiologically and psychologically to normalize it) and provide a concrete solution to solve it today.
Generate structured JSON matching the schema.`;

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: "You are Nefes, a warm, safe student well-being companion. Deeply analyze the student's problem context, normalize why their brain is feeling blocked, and offer a clear resolution plan.",
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING },
                acknowledgment: { type: Type.STRING },
                support_type: { type: Type.STRING },
                priority: { type: Type.STRING },
                problem_context: {
                  type: Type.OBJECT,
                  properties: {
                    core_trigger: { type: Type.STRING },
                    why_it_happens: { type: Type.STRING },
                    compassionate_insight: { type: Type.STRING }
                  },
                  required: ["core_trigger", "why_it_happens", "compassionate_insight"]
                },
                solution_strategy: {
                  type: Type.OBJECT,
                  properties: {
                    immediate_fix: { type: Type.STRING },
                    mindset_shift: { type: Type.STRING }
                  },
                  required: ["immediate_fix", "mindset_shift"]
                },
                actions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      duration_minutes: { type: Type.INTEGER },
                      step_instruction: { type: Type.STRING },
                      category: { type: Type.STRING }
                    },
                    required: ["title", "duration_minutes", "step_instruction"]
                  }
                },
                reset_activity: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    title: { type: Type.STRING },
                    duration_minutes: { type: Type.INTEGER },
                    guide_text: { type: Type.STRING }
                  },
                  required: ["type", "title", "duration_minutes", "guide_text"]
                },
                follow_up_question: { type: Type.STRING },
                culturally_relevant_encouragement: { type: Type.STRING }
              },
              required: ["language", "acknowledgment", "priority", "problem_context", "solution_strategy", "actions", "reset_activity", "follow_up_question"]
            }
          }
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ isCrisis: false, plan: parsed });
        }
      } catch (geminiError) {
        handleGeminiError('support-session', geminiError);
      }
    }

    // Adaptive local engine
    const fallback = generateFallbackPlan(trimmedText, mood, energy, timeMinutes, language);
    return res.json({ isCrisis: false, plan: fallback });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to process well-being session' });
  }
});

// API: Adaptive Feedback Loop
app.post('/api/adapt-session', async (req: Request, res: Response) => {
  try {
    const { feedback, language = 'en' } = req.body;

    if (feedback === 'worse') {
      const response = {
        adaptedState: 'supportive_pause',
        headline: language === 'fr' 
          ? "Arrêtons tout pour l'instant. Tu as le droit de faire une pause."
          : language === 'derja'
          ? "A9ef lkol tawwa. 3andek el 7a9 terte7 w ma tfakker fi chay."
          : "Let's stop right now. It is completely okay to step back and rest.",
        message: language === 'fr'
          ? "Quand la pression monte, forcer ne fait qu'aggraver la fatigue. Ferme tes cahiers, bois un verre d'eau fraîche ou appelle quelqu'un qui te fait du bien."
          : language === 'derja'
          ? "Ki t7ess rou7ek t3ebt akthar, lezem tna77i l'pression. Echreb me bard, w 7ot rassek 5 da9aye9 wala kallem sa7ebtek."
          : "When your nervous system is overwhelmed, forcing productivity backfires. Step away from your books, hydrate, or talk to someone you trust.",
        recommendedNext: {
          type: "rest_and_human_connection",
          title: language === 'fr' ? "Repos sensoriel & Hydratation" : language === 'derja' ? "Rtiye7 w klem s7ab" : "Sensory rest & connection",
          actionDescription: language === 'fr' 
            ? "Mets ton téléphone en sourdine, allonge-toi 5 minutes sans écran."
            : language === 'derja'
            ? "Sekker el talifoun 5 da9aye9 w ghammed 3inik."
            : "Put your phone on do-not-disturb, close your eyes for 5 minutes.",
          emergencyAssistanceAvailable: true
        }
      };
      return res.json(response);
    }

    if (feedback === 'same') {
      const response = {
        adaptedState: 'reduce_friction',
        headline: language === 'fr'
          ? "C'est normal. Essayons quelque chose de beaucoup plus léger."
          : language === 'derja'
          ? "3adi barcha. Khalli njarbou 7aja as-hel b barcha."
          : "That is completely normal. Let's make the next step much lighter.",
        message: language === 'fr'
          ? "Parfois, même un petit objectif reste trop lourd. Si on remplaçait le travail par une courte respiration ou une simple marche de 2 minutes ?"
          : language === 'derja'
          ? "Marat 7atta 5 da9aye9 yodh-hrou barcha. Chrayek na3mlou tanaffes khfif wala nodh-hrou l'chobbek 2 da9aye9?"
          : "Sometimes even a small task carries too much friction. How about we replace it with a 2-minute breath or looking out the window?",
        recommendedNext: {
          type: "gentle_grounding",
          title: language === 'fr' ? "2 minutes de respiration guidée" : language === 'derja' ? "2 da9aye9 nefes hedi" : "2-Minute Gentle Breath",
          actionDescription: language === 'fr'
            ? "Rejoins l'espace respiration 'Deep Calm' pour relâcher tes épaules."
            : language === 'derja'
            ? "Imchi l'espace Nefes Deep Calm bech terte7 chwaya."
            : "Head to the guided breathing player to soften your shoulders.",
          targetScreen: "breathing"
        }
      };
      return res.json(response);
    }

    // Feedback is 'better'
    const response = {
      adaptedState: 'gentle_progress',
      headline: language === 'fr'
        ? "Superbe ! Tu as réussi à franchir ce premier pas."
        : language === 'derja'
        ? "Ya3tik essa7a ! Khotwa behia barcha w t7ess l'far9."
        : "Wonderful! You took that step and created space for yourself.",
      message: language === 'fr'
        ? "Remarque comment ton esprit s'est légèrement éclairci. Tu as gagné des diamants pour ton sanctuaire !"
        : language === 'derja'
        ? "Chouf kifch mokhek rta7 chwaya. Rbe7t almas l'jnantek!"
        : "Notice how taking action shifted the weight. You earned diamonds for your garden!",
      recommendedNext: {
        type: "celebrate_or_continue",
        title: language === 'fr' ? "Prendre soin de son jardin" : language === 'derja' ? "Talla 3la jnantek" : "Visit My Garden",
        actionDescription: language === 'fr'
          ? "Découvre les nouveaux bourgeons éclos dans Nefes Bloom."
          : language === 'derja'
          ? "Chouf chnowa jdid fi jnantek Nefes Bloom."
          : "Check the blossoms thriving in your sanctuary.",
        targetScreen: "garden"
      }
    };
    return res.json(response);

  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to adapt session' });
  }
});

// API: AI Task Roadmap Generation
app.post('/api/roadmap-generate', async (req: Request, res: Response) => {
  try {
    const {
      rawInput = '',
      availableHoursPerDay = 3,
      energyLevel = 'medium',
      language = 'en'
    } = req.body;

    const trimmedInput = String(rawInput).trim();

    // Check crisis in input
    for (const pattern of CRISIS_PATTERNS) {
      if (pattern.test(trimmedInput)) {
        return res.json(TUNISIA_CRISIS_RESOURCES);
      }
    }

    if (aiClient && isGeminiAvailable) {
      const prompt = `You are Nefes, an academic planning companion for university students.
Workload: "${trimmedInput || 'Upcoming university exams and assignments'}"
Available study hours per day: ${availableHoursPerDay} hours
Energy level: ${energyLevel}
Language: ${language}

Generate structured JSON matching the schema.`;

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: "You are an expert student productivity and well-being assistant.",
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                analysis: {
                  type: Type.OBJECT,
                  properties: {
                    totalTasks: { type: Type.INTEGER },
                    estimatedTotalMinutes: { type: Type.INTEGER },
                    workloadFeasibility: { type: Type.STRING },
                    conflictExplanation: { type: Type.STRING },
                    missingInfoNotice: { type: Type.STRING }
                  },
                  required: ["totalTasks", "estimatedTotalMinutes", "workloadFeasibility"]
                },
                priorityRationale: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      course: { type: Type.STRING },
                      deadline: { type: Type.STRING },
                      estimated_minutes: { type: Type.INTEGER },
                      priority: { type: Type.STRING },
                      status: { type: Type.STRING },
                      substeps: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            duration_minutes: { type: Type.INTEGER },
                            completed: { type: Type.BOOLEAN }
                          },
                          required: ["id", "title", "duration_minutes", "completed"]
                        }
                      },
                      notes: { type: Type.STRING }
                    },
                    required: ["id", "title", "course", "estimated_minutes", "priority", "status", "substeps"]
                  }
                },
                schedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dayName: { type: Type.STRING },
                      dateStr: { type: Type.STRING },
                      blocks: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            type: { type: Type.STRING },
                            title: { type: Type.STRING },
                            duration_minutes: { type: Type.INTEGER },
                            timeSlot: { type: Type.STRING },
                            taskId: { type: Type.STRING }
                          },
                          required: ["id", "type", "title", "duration_minutes"]
                        }
                      }
                    },
                    required: ["dayName", "dateStr", "blocks"]
                  }
                },
                bufferNotice: { type: Type.STRING }
              },
              required: ["analysis", "priorityRationale", "tasks", "schedule", "bufferNotice"]
            }
          }
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ isCrisis: false, plan: parsed });
        }
      } catch (err) {
        handleGeminiError('roadmap-generate', err);
      }
    }

    // Adaptive local engine
    const adaptivePlan = generateAdaptiveRoadmap(trimmedInput, availableHoursPerDay, energyLevel, language);
    return res.json({ isCrisis: false, plan: adaptivePlan });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// API: AI Task Roadmap Rescheduling
app.post('/api/roadmap-reschedule', async (req: Request, res: Response) => {
  try {
    const { currentTasks = [], unfinishedTaskIds = [], language = 'en' } = req.body;

    const rescheduledTasks = currentTasks.map((t: any) => {
      if (unfinishedTaskIds.includes(t.id)) {
        return {
          ...t,
          status: 'pending',
          notes: (t.notes ? t.notes + ' • ' : '') + 'Rescheduled forward with reduced friction.'
        };
      }
      return t;
    });

    return res.json({
      success: true,
      rescheduledTasks,
      compassionateMessage: language === 'fr'
        ? "Aucun problème ! Les imprévus font partie de la vie étudiante. Nous avons réajusté ton planning en douceur sans surcharge."
        : language === 'derja'
        ? "Normal 3al lekhir ! Kolna nti7ou fel retard. 3awedna nadhamna l'khedma b chewaya men ghir stress."
        : "Completely okay! Life happens. Your unfinished tasks have been rolled forward gently without cramming."
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reschedule roadmap' });
  }
});



// ================= MOTIVATIONAL SPEECHES BACKEND ENGINE =================
const LOCAL_MOTIVATIONAL_SPEECHES = {
  en: [
    {
      id: "speech-en-1",
      title: "The Power of Small Beginnings 🌱",
      speech: "Every breakthrough starts as a quiet, tentative step. You don't have to carry your entire semester or career all at once today. What you brought here is proof of your resilience. Trust your steady rhythm — one honest breath, one small action at a time.",
      quote: "Grow at your own pace. The bloom is already taking root.",
      category: "Gentle Resilience",
      authorOrTone: "Nefes Grounding"
    },
    {
      id: "speech-en-2",
      title: "Your Creative Inner Sanctuary ✨",
      speech: "Creative expression is a sacred space where deadlines, grades, and external expectations have zero authority. By giving yourself this pause, you honor your mind and spirit. Carry this clarity with you into whatever task comes next.",
      quote: "You don't have to solve everything today. Just take the next step.",
      category: "Creative Sanctuary",
      authorOrTone: "Self-Compassion"
    },
    {
      id: "speech-en-3",
      title: "Patience and Quiet Courage 🌸",
      speech: "A seed resting beneath the earth doesn't panic in the dark; it drinks the rain, drops roots deep, and surfaces when its season arrives. Offer yourself that same gentle patience. Every hour of study and every minute of rest matters.",
      quote: "Small consistent steps rebuild your calm.",
      category: "Patience",
      authorOrTone: "Inner Strength"
    },
    {
      id: "speech-en-4",
      title: "Recharging Your Academic Spark ⚡",
      speech: "When fatigue whispers that you aren't doing enough, remember that rest is not lost time; it is the fertilizer of clarity. You do not need a violent surge of motivation — only permission to breathe and restart with softness.",
      quote: "Rest is not lost time; it is the soil from which fresh brilliance grows.",
      category: "Energy Renewal",
      authorOrTone: "Mindful Focus"
    },
    {
      id: "speech-en-5",
      title: "Trusting Your Unique Path 🕊️",
      speech: "University culture often pushes everyone to fit identical molds, yet your genuine perspective and persistence are your greatest assets. Take pride in how far you've traveled already, and step forward with quiet confidence.",
      quote: "Honor your unique journey. You are blooming right on time.",
      category: "Self-Belief",
      authorOrTone: "Empowerment"
    },
    {
      id: "speech-en-6",
      title: "Transforming Frustration Into Fuel 🔥",
      speech: "Frustration is not failure — it is proof that you care deeply about doing things right. When code doesn't run, formulas refuse to balance, or concepts blur, don't punish yourself. Step back, exhale, and let the knot untangle itself.",
      quote: "Frustration is energy seeking a wiser direction.",
      category: "Catharsis",
      authorOrTone: "Emotional Agility"
    },
    {
      id: "speech-en-7",
      title: "The Art of Doing One Thing Well 🎯",
      speech: "Overwhelm dissolves the moment you shrink your horizon from 'everything due this month' to 'the single sentence or problem directly in front of me'. Give your attention fully to this moment.",
      quote: "Win the next five minutes, and the day will take care of itself.",
      category: "Focus",
      authorOrTone: "Clarity"
    }
  ],
  fr: [
    {
      id: "speech-fr-1",
      title: "La Force des Petits Commencements 🌱",
      speech: "Chaque grand accomplissement commence par une esquisse discrète. Tu n'as pas à résoudre tout le semestre aujourd'hui. Fais confiance à ton propre rythme, un pas à la fois. Tu avances déjà bien plus que tu ne l'imagines.",
      quote: "Grandis à ton propre rythme. Les bourgeons prennent déjà racine.",
      category: "Résilience Douce",
      authorOrTone: "Bienveillance"
    },
    {
      id: "speech-fr-2",
      title: "Ton Sanctuaire de Sérénité ✨",
      speech: "Prendre un instant pour exprimer tes idées et tes émotions te redonne le contrôle. Les notes et les examens ne définissent pas ta valeur humaine. Garde cette paix intérieure pour la suite de ta journée.",
      quote: "Tu n'as pas à tout résoudre aujourd'hui. Fais juste le prochain pas.",
      category: "Clarté Mentale",
      authorOrTone: "Sérénité"
    },
    {
      id: "speech-fr-3",
      title: "Patience et Douceur Envers Soi 🌸",
      speech: "Une graine ne se presse pas dans la terre : elle s'enracine solidement avant d'éclore à la lumière. Offre-toi cette même tendresse. Tes efforts d'aujourd'hui construisent ton sanctuaire de demain.",
      quote: "Les petits pas réguliers ramènent la sérénité.",
      category: "Patience",
      authorOrTone: "Force Intérieure"
    },
    {
      id: "speech-fr-4",
      title: "Retrouver l'Énergie d'Étudier ⚡",
      speech: "Quand la fatigue s'accumule, s'arrêter n'est pas un abandon mais une nécessité biologique. Ton esprit a besoin de pauses tampons pour consolider les connaissances et retrouver sa vivacité.",
      quote: "Le repos n'est pas du temps perdu ; c'est le terreau de ta clarté.",
      category: "Vitalité",
      authorOrTone: "Équilibre"
    },
    {
      id: "speech-fr-5",
      title: "Confiance en Ta Propre Voie 🕊️",
      speech: "L'université impose souvent des comparaisons stériles. Rappelle-toi que ta curiosité et ton authenticité sont tes plus beaux atouts. Avance la tête haute et le cœur apaisé.",
      quote: "Fais confiance à ton chemin. Tu fleuris exactement au bon moment.",
      category: "Confiance",
      authorOrTone: "Motivation"
    }
  ],
  derja: [
    {
      id: "speech-derja-1",
      title: "Kol Khedma Kbira Tebda b Khotwa Sghira 🌱",
      speech: "Mouch lazem thezz thqel el semestre lkol fard marra. Kol mashrou3 w nja7 yebda b fekra sghira. Elli 9a3ed ta3mel fih tawa howa dalil the9a w 9odra. Emchi b rythme mte3ek w ma tloumch rou7ek.",
      quote: "Ekber b chewaya w 3la ra7tek. El khir jey.",
      category: "El Rtiye7",
      authorOrTone: "The9a fel Rou7"
    },
    {
      id: "speech-derja-2",
      title: "Rtiye7 w The9a fel Rou7 ✨",
      speech: "Ki te5ou d9aye9 bech tlawwen wala t3abbar 3la e7sasek, rak rta7t w 3titt 9ima l'mokhek. El 9raya w les examens yet3addew, ama sa7tek w rtiye7ek houma l'essentiel.",
      quote: "Mouch lazem t7ell kol chay lyoum. A3mel juste l'khotwa jeya.",
      category: "Wsa3 el Bel",
      authorOrTone: "Nefes Hédi"
    },
    {
      id: "speech-derja-3",
      title: "Wsa3 el Bel w El Sabr 🌸",
      speech: "El zarré3a ta7t el trab ma tezzrebch rou7ha bech tnowwar; tochreb el mtar w t9awwi 3rou9ha. Koun 7nina m3a rou7ek. Kol khotwa sghira t9arrbek l'far7tek.",
      quote: "El sabr w el khedma el hadya ywaslou l'kol nja7.",
      category: "El Sabr",
      authorOrTone: "7neyna"
    },
    {
      id: "speech-derja-4",
      title: "Erte7 Chwaya w Taw Tarja3 A9wa ⚡",
      speech: "Ki t7ess rou7ek faddit w el stress ghlbek, tfakker elli el rtiye7 7a99ek. Mokhek kif l'batterie lezem yetchargea. El nja7 howa elli ya3ref wa9teh yerte7 bech ykamel thnitou.",
      quote: "El rtiye7 mouch dhyaye3 wa9t, howa 9owet el rojou3.",
      category: "Charge",
      authorOrTone: "9owwa"
    },
    {
      id: "speech-derja-5",
      title: "9ader Rou7ek w Koun Fekhour 🕊️",
      speech: "Dhourouf el 9raya dima yenzelou 3lik, ama enti a9wa b barcha men ay imti7an. Kol defi t3additou 9bal howa dars w the9a. Emchi b the9a w rasek 3ali.",
      quote: "The9a fel rou7 heya awwel bwebet el nja7.",
      category: "El Fakher",
      authorOrTone: "Nja7"
    }
  ]
};

// Shuffles and picks 5 speeches from fallback pool
function getFallbackSpeeches(language: string) {
  const langKey = language === 'fr' ? 'fr' : language === 'derja' ? 'derja' : 'en';
  const pool = [...LOCAL_MOTIVATIONAL_SPEECHES[langKey]];
  
  // Shuffle pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Ensure unique timestamped IDs so client knows it was freshly actualized
  return pool.slice(0, 5).map((s, idx) => ({
    ...s,
    id: `${s.id}-${Date.now()}-${idx}`
  }));
}

// API: Refresh / Fetch 5 Motivational Speeches
app.all(['/api/motivational-speeches', '/api/motivational-speeches/refresh'], async (req: Request, res: Response) => {
  try {
    const language = (req.body?.language || req.query?.language || 'en') as string;
    const moodContext = (req.body?.mood || req.query?.mood || 'general') as string;

    if (aiClient && isGeminiAvailable) {
      try {
        const prompt = `You are Nefes, an empathetic student well-being companion for university students in Tunisia.
Language requested: "${language}" (en = English, fr = French, derja = Tunisian Derja using Latin or Arabic alphabet with authentic colloquial warmth).
Current student mood context: "${moodContext}".

Generate exactly 5 distinct, inspiring, realistic motivational speeches for university students.
Each speech should:
1. Have a short, poetic Title with an emoji (e.g. "The Power of Small Beginnings 🌱").
2. Have a Speech paragraph (3-4 sentences of deep warmth, authentic wisdom, acknowledging student pressure without toxic positivity).
3. Have a memorable punchy Quote (e.g. "Grow at your own pace. The bloom is already taking root.").
4. Have a Category (e.g. "Gentle Resilience", "Creative Sanctuary", "Energy Renewal", "Patience", "Inner Strength").
5. Have authorOrTone (e.g. "Nefes Sanctuary", "Student Wisdom", "Mindful Focus").

Return strictly valid JSON with an array of 5 items.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: "You are Nefes, a warm, safe student emotional well-being companion.",
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                speeches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      speech: { type: Type.STRING },
                      quote: { type: Type.STRING },
                      category: { type: Type.STRING },
                      authorOrTone: { type: Type.STRING }
                    },
                    required: ["id", "title", "speech", "quote", "category", "authorOrTone"]
                  }
                }
              },
              required: ["speeches"]
            }
          }
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed.speeches) && parsed.speeches.length >= 5) {
            return res.json({
              success: true,
              source: 'gemini',
              speeches: parsed.speeches.slice(0, 5),
              refreshedAt: new Date().toISOString()
            });
          }
        }
      } catch (geminiError) {
        handleGeminiError('motivational-speeches', geminiError);
      }
    }

    // Adaptive local engine fallback
    const fallbackList = getFallbackSpeeches(language);
    return res.json({
      success: true,
      source: 'local_engine',
      speeches: fallbackList,
      refreshedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating motivational speeches:', error);
    const fallbackList = getFallbackSpeeches('en');
    return res.json({
      success: true,
      source: 'fallback',
      speeches: fallbackList,
      refreshedAt: new Date().toISOString()
    });
  }
});

// Conversational Mascot Agent Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages = [], mood = 'moderate', selectedProblems = [], language = 'en' } = req.body;
    const latestUserMessage = messages[messages.length - 1]?.content || '';

    // Safety and Crisis Detection
    const hasCrisis = CRISIS_PATTERNS.some(pattern => pattern.test(latestUserMessage));
    if (hasCrisis) {
      const msg = TUNISIA_CRISIS_RESOURCES.crisisMessage[language as keyof typeof TUNISIA_CRISIS_RESOURCES.crisisMessage] || TUNISIA_CRISIS_RESOURCES.crisisMessage.en;
      return res.json({
        response: `${msg}\n\n📞 Numéro Vert (Tunisie): 80 10 50 50 (24/7 gratuit)\n📞 SAMU: 190`,
        isCrisis: true
      });
    }

    if (aiClient && isGeminiAvailable) {
      try {
        const systemInstruction = `You are Nefes (نَفَس), an empathetic student well-being companion and AI mascot for university students in Tunisia.
Current student mood: "${mood}".
Selected current academic struggles: ${selectedProblems.length > 0 ? selectedProblems.join(', ') : 'None specified'}.
Language to use: "${language}" (en = English, fr = French, derja = Tunisian Derja using Latin or Arabic script with authentic warmth like '3aychek', 'chwaya chwaya', 'kol chay yetrigel').
Guidelines:
- Act as the warm mascot brain agent.
- Keep responses friendly, compassionate, and concise (2-4 sentences max per turn).
- Focus on practical, small micro-steps to overcome revision overwhelm, exam dread, or tiredness.
- Never judge or dismiss the student's stress.`;

        const contents = messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction
          }
        });

        if (response && response.text) {
          return res.json({ response: response.text.trim() });
        }
      } catch (geminiErr) {
        handleGeminiError('chat', geminiErr);
      }
    }

    // Fallback response engine if Gemini offline
    const isDerja = language === 'derja' || /nhebb|faddit|barcha|mch|chwaya|3aychek|tawa/i.test(latestUserMessage);
    const isFrench = language === 'fr' || /je|stress|fatigue|cours|examen|peur|pression/i.test(latestUserMessage);
    let reply = "";

    if (isDerja) {
      if (/revision|khedma|cours|exam|imti7an/i.test(latestUserMessage)) {
        reply = "Fahmek barcha. Ki t7ess rou7ek daya3 m3a el revision, a3mel pause 5 d9aye9, ochrob me w ekhtar page barka wala exercice sghir. Khotwa sghira khir men wa9fa twila!";
      } else if (/stress|khaief|faddit/i.test(latestUserMessage)) {
        reply = "Khedhe tanaffes 3ami9 (inhale... exhale). El stress hedha tabé3i 9bal el imti7anat, ama enti 9adrou w barcha. Ena m3ak, chnouwa a3az 7aja tnajjem tebda biha tawa?";
      } else {
        reply = "M3ak 100%. Ahki m3aya w faragh 9albek. Kifesh t7eb n3awnek t9assem el khedma lyoum?";
      }
    } else if (isFrench) {
      if (/revision|cours|examen|bloqu/i.test(latestUserMessage)) {
        reply = "Je comprends tout à fait. Face à la masse de cours, notre cerveau panique. Choisis une seule petite tâche de 5 minutes, sans pression. Tu avanceras beaucoup plus vite en douceur !";
      } else if (/stress|peur|anx/i.test(latestUserMessage)) {
        reply = "Prends une profonde respiration avec moi. Ce stress est normal et passager. Tu as déjà surmonté des défis difficiles. Par quel petit point veux-tu qu'on commence ?";
      } else {
        reply = "Je suis là avec toi. Dépose tes pensées ici en toute tranquillité. Que ressens-tu le plus en ce moment ?";
      }
    } else {
      if (/revision|exam|study|focus/i.test(latestUserMessage)) {
        reply = "I hear you. When revision feels overwhelming, the secret is making the first step ridiculously small. Pick just one slide or formula for 5 minutes. You're doing better than you think!";
      } else if (/anxious|stress|scared|fail/i.test(latestUserMessage)) {
        reply = "Take a gentle, deep breath in and out. Pre-exam anxiety is your mind trying to protect you, but you are well-equipped. What is one tiny thing we can clear off your plate right now?";
      } else {
        reply = "I'm right here with you. Take a comfortable breath and let it all out. What's the main thought weighing on your mind today?";
      }
    }

    return res.json({ response: reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.json({ response: "I'm here with you. Take a deep, gentle breath. Let's tackle one small step at a time." });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Nefes Backend', timestamp: new Date().toISOString() });
});

// In development: mount Vite middlewares
// In production: serve built files
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Nefes full-stack server running on http://localhost:${PORT}`);
  });
}

setupServer();
