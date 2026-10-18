import React from 'react';

interface MascotBrainProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  withScenery?: boolean;
  animated?: boolean;
}

export const MascotBrain: React.FC<MascotBrainProps> = ({
  size = 'md',
  className = '',
  withScenery = false,
  animated = true
}) => {
  // Dimensions mapping
  const dimensions = {
    sm: { width: 54, height: 50 },
    md: { width: 88, height: 80 },
    lg: { width: 140, height: 125 },
    hero: { width: 280, height: 250 }
  }[size];

  const brainSvg = (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-gentle-float' : ''} ${className}`}
      aria-label="Nefes meditating brain mascot"
    >
      <defs>
        {/* Soft pink gradient for brain lobes */}
        <linearGradient id="brainGrad" x1="50" y1="20" x2="150" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA0B6" />
          <stop offset="50%" stopColor="#F47C91" />
          <stop offset="100%" stopColor="#E25D76" />
        </linearGradient>

        <linearGradient id="legGrad" x1="70" y1="130" x2="130" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#253545" />
          <stop offset="100%" stopColor="#15212E" />
        </linearGradient>

        <radialGradient id="pearlGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="80%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Floating sparkles around mascot */}
      <g opacity="0.85">
        <path d="M28 45L31 49L35 49L32 52L33 56L30 53L27 56L28 52L25 49L29 49Z" fill="#F8D45A" />
        <path d="M172 38L174 41L177 41L175 43L176 46L173 44L171 46L172 43L169 41L172 41Z" fill="#F8D45A" />
        <circle cx="20" cy="75" r="2.5" fill="#E8E9AE" />
        <circle cx="180" cy="70" r="2.5" fill="#E8E9AE" />
        <circle cx="45" cy="20" r="2" fill="#F47C91" />
        <circle cx="155" cy="22" r="2" fill="#F47C91" />
      </g>

      {/* Cross-legged Lotus Base / Pants */}
      <ellipse cx="100" cy="144" rx="46" ry="14" fill="url(#legGrad)" />
      {/* Crossed legs / feet */}
      <ellipse cx="68" cy="145" rx="14" ry="9" fill="#1C2B3A" />
      <ellipse cx="132" cy="145" rx="14" ry="9" fill="#1C2B3A" />

      {/* Main Brain Body - Cute bumpy lobes */}
      {/* Background lobe depth shadow */}
      <ellipse cx="100" cy="85" rx="66" ry="54" fill="#D8556F" opacity="0.3" />

      {/* Left hemisphere lobes */}
      <circle cx="68" cy="62" r="30" fill="url(#brainGrad)" />
      <circle cx="50" cy="88" r="28" fill="url(#brainGrad)" />
      <circle cx="70" cy="112" r="26" fill="url(#brainGrad)" />

      {/* Right hemisphere lobes */}
      <circle cx="132" cy="62" r="30" fill="url(#brainGrad)" />
      <circle cx="150" cy="88" r="28" fill="url(#brainGrad)" />
      <circle cx="130" cy="112" r="26" fill="url(#brainGrad)" />

      {/* Central brain core */}
      <ellipse cx="100" cy="84" rx="52" ry="46" fill="url(#brainGrad)" />

      {/* Brain convolution fold lines (soft organic grooves) */}
      <path d="M100 46V68" stroke="#D34F68" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M78 52C82 62 76 72 70 76" stroke="#D34F68" strokeWidth="3" strokeLinecap="round" />
      <path d="M122 52C118 62 124 72 130 76" stroke="#D34F68" strokeWidth="3" strokeLinecap="round" />
      <path d="M90 74C92 84 84 94 76 96" stroke="#D34F68" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 74C108 84 116 94 124 96" stroke="#D34F68" strokeWidth="3" strokeLinecap="round" />

      {/* Rosy blush cheeks */}
      <ellipse cx="76" cy="100" rx="9" ry="5.5" fill="#C52E4B" opacity="0.45" />
      <ellipse cx="124" cy="100" rx="9" ry="5.5" fill="#C52E4B" opacity="0.45" />

      {/* Serene closed smiling eyes ( ˘◡˘ ) */}
      <path d="M74 88C78 83 86 83 90 88" stroke="#25161A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M110 88C114 83 122 83 126 88" stroke="#25161A" strokeWidth="3.5" strokeLinecap="round" />

      {/* Sweet contented smile */}
      <path d="M95 102C97 106 103 106 105 102" stroke="#25161A" strokeWidth="3" strokeLinecap="round" />

      {/* Meditating Arms & Hands resting on knees */}
      {/* Left arm */}
      <path d="M52 108C42 118 42 135 56 138" stroke="#F47C91" strokeWidth="7" strokeLinecap="round" />
      {/* Right arm */}
      <path d="M148 108C158 118 158 135 144 138" stroke="#F47C91" strokeWidth="7" strokeLinecap="round" />

      {/* Glowing meditation orbs/pearls in hands */}
      <circle cx="56" cy="138" r="6" fill="url(#pearlGlow)" />
      <circle cx="56" cy="138" r="3" fill="#FFFFFF" />

      <circle cx="144" cy="138" r="6" fill="url(#pearlGlow)" />
      <circle cx="144" cy="138" r="3" fill="#FFFFFF" />
    </svg>
  );

  if (!withScenery) {
    return brainSvg;
  }

  // With surrounding botanical scenery (as in Screen C)
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden py-4 select-none">
      {/* Soft background hill */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#E8E9AE]/70 to-transparent rounded-t-[50%]" />

      {/* Botanical leaves Left */}
      <svg
        className="absolute left-1 bottom-4 w-20 h-32 pointer-events-none opacity-90 transition-transform duration-700 hover:rotate-2"
        viewBox="0 0 100 160"
        fill="none"
      >
        <path d="M10 160C20 120 40 90 20 50C10 30 0 20 0 20C20 40 50 70 30 160" fill="#6F8D45" />
        <path d="M25 150C45 110 70 95 60 40C50 15 35 5 35 5C55 30 85 75 45 150" fill="#A8BC78" />
        <circle cx="45" cy="55" r="4" fill="#E8E9AE" />
        <circle cx="20" cy="90" r="3" fill="#F47C91" />
      </svg>

      {/* Botanical leaves Right */}
      <svg
        className="absolute right-1 bottom-4 w-20 h-32 pointer-events-none opacity-90 transition-transform duration-700 hover:-rotate-2"
        viewBox="0 0 100 160"
        fill="none"
      >
        <path d="M90 160C80 120 60 90 80 50C90 30 100 20 100 20C80 40 50 70 70 160" fill="#6F8D45" />
        <path d="M75 150C55 110 30 95 40 40C50 15 65 5 65 5C45 30 15 75 55 150" fill="#A8BC78" />
        <circle cx="55" cy="55" r="4" fill="#E8E9AE" />
        <circle cx="80" cy="90" r="3" fill="#F47C91" />
      </svg>

      {/* Center Brain Mascot */}
      <div className="relative z-10">
        {brainSvg}
      </div>
    </div>
  );
};
