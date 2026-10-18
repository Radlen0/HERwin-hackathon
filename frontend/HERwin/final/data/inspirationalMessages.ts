export interface InspirationalMessage {
  id: string;
  category: string;
  title: {
    en: string;
    fr: string;
    derja: string;
  };
  quote: {
    en: string;
    fr: string;
    derja: string;
  };
  message: {
    en: string;
    fr: string;
    derja: string;
  };
  tone: string;
}

export const INSPIRATIONAL_MESSAGES: InspirationalMessage[] = [
  {
    id: 'inspire-1',
    category: 'Gentle Resilience',
    title: {
      en: 'The Power of Small Beginnings 🌱',
      fr: 'La Force des Petits Débuts 🌱',
      derja: '9owwet el Bdeya el Sghira 🌱'
    },
    quote: {
      en: 'Grow at your own pace. The bloom is already taking root.',
      fr: 'Avance à ton propre rythme. L’épanouissement prend déjà racine.',
      derja: 'Emchi b rythme mte3ek. El warda lezemha wa9t bech tnowwar.'
    },
    message: {
      en: "Every breakthrough starts as a quiet, tentative step. You don't have to carry your entire semester or exam week all at once today. Take one honest breath and tackle just one micro-task.",
      fr: "Chaque grand projet commence par un pas tranquille. Tu n'as pas à porter tout ton semestre en une seule journée. Prends une respiration profonde et commence par une seule petite tâche.",
      derja: "Kol nja7 kbir yabda b khotwa sghira. Mouch lazem thezz thqel el 3am el dirassi lkol fard marra. Khedhe tanaffes merta7 w ebda b 7aja khfifa."
    },
    tone: 'Compassionate'
  },
  {
    id: 'inspire-2',
    category: 'Inner Sanctuary',
    title: {
      en: 'Your Creative Inner Sanctuary ✨',
      fr: 'Ton Sanctuaire Intérieur ✨',
      derja: 'Blasset el Rtiye7 w El Hdou2 ✨'
    },
    quote: {
      en: "You don't have to solve everything today. Just take the next step.",
      fr: "Tu n'as pas à tout résoudre aujourd'hui. Fais juste le prochain pas.",
      derja: "Mouch lazem t7ell kol chay lyoum. A3mel juste l'khotwa jeya."
    },
    message: {
      en: "Expression and calm are sanctuaries where academic deadlines have zero authority over your inner worth. By giving yourself this pause, you honor your mind and spirit.",
      fr: "Le calme est un sanctuaire où les dates limites n'ont aucune autorité sur ta valeur humaine. En t'offrant cette pause, tu honores ton esprit.",
      derja: "El rtiye7 howa blassa ma 3andhech dho8t mta3 examens. Ki terte7 chwaya rak t3awed tchargea mokhek bech tarja3 a9wa."
    },
    tone: 'Grounding'
  },
  {
    id: 'inspire-3',
    category: 'Patience & Calm',
    title: {
      en: 'Patience and Quiet Courage 🌸',
      fr: 'Patience et Douceur 🌸',
      derja: 'Wsa3 el Bel w El Sabr 🌸'
    },
    quote: {
      en: 'Small consistent steps rebuild your calm.',
      fr: 'De petits pas constants reconstruisent ta sérénité.',
      derja: 'El sabr w el khedma el hadya ywaslou l’kol nja7.'
    },
    message: {
      en: "A seed resting beneath the earth doesn't panic in the dark; it drinks the rain, drops roots deep, and surfaces when ready. Offer yourself that same gentle patience.",
      fr: "Une graine sous terre ne panique pas dans l'obscurité ; elle absorbe l'eau, enfonce ses racines et grandit à son heure. Offre-toi cette même bienveillance.",
      derja: "El zarré3a ta7t el trab ma tezzrebch rou7ha; tochreb el mtar w t9awwi 3rou9ha. Koun 7nin m3a rou7ek, kol khotwa t9arrbek."
    },
    tone: 'Soothing'
  },
  {
    id: 'inspire-4',
    category: 'Energy Renewal',
    title: {
      en: 'Rest is Part of the Work ⚡',
      fr: 'Le Repos Fait Partie du Travail ⚡',
      derja: 'El Rtiye7 Men El Khedma ⚡'
    },
    quote: {
      en: 'Rest is not lost time; it is the soil from which clarity grows.',
      fr: 'Le repos n’est pas du temps perdu ; c’est le terreau de la clarté.',
      derja: 'El rtiye7 mouch dhyaye3 wa9t, howa 9owet el rojou3.'
    },
    message: {
      en: "When tiredness tells you you aren't doing enough, remember that mental energy is renewable. Stepping away for water and a stretch is academic fuel.",
      fr: "Quand la fatigue te fait croire que tu n'en fais pas assez, souviens-toi que l'esprit a besoin de pauses pour retenir. Prendre l'air renforce ton apprentissage.",
      derja: "Ki t7ess rou7ek faddit w t3ebt, tfakker elli mokhek kima l'batterie. El nja7 howa elli ya3ref wa9teh yerte7."
    },
    tone: 'Empowering'
  },
  {
    id: 'inspire-5',
    category: 'Confidence',
    title: {
      en: 'You Are Blooming On Time 🕊️',
      fr: 'Tu Avances à Temps 🕊️',
      derja: 'The9a fel Rou7 w El Nja7 🕊️'
    },
    quote: {
      en: 'Honor your journey. You are doing much better than you think.',
      fr: 'Honore ton chemin. Tu fais bien mieux que tu ne le crois.',
      derja: '3andek the9a fi rou7ek. Enti a9wa b barcha men ay imti7an.'
    },
    message: {
      en: "Do not compare your quiet revision days to anyone else's public highlights. Your focus, your presence, and your perseverance are already creating success.",
      fr: "Ne compare pas tes journées d'étude silencieuses aux réussites affichées des autres. Ton effort quotidien et ta sincérité construisent déjà ta réussite.",
      derja: "Ma t9arench rou7ek b 7ad. Khedmetk w sabrek houma elli bech ywasslouk l'hadafek. Emchi b the9a w rasek 3ali."
    },
    tone: 'Inspiring'
  }
];
