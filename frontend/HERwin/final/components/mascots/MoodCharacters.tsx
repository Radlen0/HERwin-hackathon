import React from 'react';
import { MoodType } from '../../types';

interface MoodCharacterProps {
  mood: MoodType;
  size?: number;
  className?: string;
  selected?: boolean;
}

export const MoodCharacter: React.FC<MoodCharacterProps> = ({
  mood,
  size = 48,
  className = '',
  selected = false
}) => {
  switch (mood) {
    case 'calm':
      // Sage green, peaceful smile, serene closed eyes
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${selected ? 'scale-110 drop-shadow-md' : 'hover:scale-105'} ${className}`}
          aria-label="Calm mood"
        >
          {/* Outer circle */}
          <circle cx="30" cy="30" r="28" fill="#A8BC78" stroke="#6F8D45" strokeWidth="2.5" />
          {/* Rosy cheeks */}
          <ellipse cx="18" cy="35" rx="4" ry="2.5" fill="#8FA55E" opacity="0.6" />
          <ellipse cx="42" cy="35" rx="4" ry="2.5" fill="#8FA55E" opacity="0.6" />
          {/* Eyes - gentle closed smiling curves */}
          <path d="M19 26C21 23 25 23 27 26" stroke="#2B3E1F" strokeWidth="3" strokeLinecap="round" />
          <path d="M33 26C35 23 39 23 41 26" stroke="#2B3E1F" strokeWidth="3" strokeLinecap="round" />
          {/* Gentle happy smile */}
          <path d="M25 36C27 39 33 39 35 36" stroke="#2B3E1F" strokeWidth="3" strokeLinecap="round" />
          {/* Cute leaf sprout on top */}
          <path d="M30 10C30 5 36 6 36 10C36 14 30 13 30 10Z" fill="#3D5834" />
        </svg>
      );

    case 'anxious':
      // Yellow with little crown/sprout, wide worried eyes, wavy mouth
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${selected ? 'scale-110 drop-shadow-md' : 'hover:scale-105'} ${className}`}
          aria-label="Anxious mood"
        >
          {/* Outer circle */}
          <circle cx="30" cy="30" r="28" fill="#F8D45A" stroke="#D8A922" strokeWidth="2.5" />
          {/* Tiny decorative crown / ears like reference */}
          <path d="M22 10L26 15L30 8L34 15L38 10L36 17H24L22 10Z" fill="#E86C86" />
          {/* Rosy cheeks */}
          <ellipse cx="17" cy="36" rx="4" ry="2.5" fill="#E89F2A" opacity="0.4" />
          <ellipse cx="43" cy="36" rx="4" ry="2.5" fill="#E89F2A" opacity="0.4" />
          {/* Wide rounded eyes with dots */}
          <circle cx="21" cy="27" r="5" fill="#FFFFFF" />
          <circle cx="21" cy="27" r="2.5" fill="#202019" />
          <circle cx="39" cy="27" r="5" fill="#FFFFFF" />
          <circle cx="39" cy="27" r="2.5" fill="#202019" />
          {/* Wavy mouth */}
          <path d="M22 39C24 37 27 41 30 38C33 36 36 40 38 38" stroke="#202019" strokeWidth="2.8" strokeLinecap="round" />
          {/* Sweat drop */}
          <path d="M48 18C48 21 45 23 45 20C45 17 48 16 48 18Z" fill="#39A9E8" />
        </svg>
      );

    case 'sad':
      // Lavender with pink bow, sleepy drooping eyes, teardrop
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${selected ? 'scale-110 drop-shadow-md' : 'hover:scale-105'} ${className}`}
          aria-label="Sad mood"
        >
          {/* Outer circle */}
          <circle cx="30" cy="30" r="28" fill="#A89DE0" stroke="#786CB7" strokeWidth="2.5" />
          {/* Cute pink bow on left ear like reference */}
          <path d="M16 11C13 8 10 11 13 14C16 17 20 13 16 11Z" fill="#F47C91" />
          <path d="M22 11C25 8 28 11 25 14C22 17 18 13 22 11Z" fill="#F47C91" />
          <circle cx="19" cy="13" r="2.5" fill="#E85D75" />
          {/* Rosy blush */}
          <ellipse cx="17" cy="37" rx="4" ry="2.5" fill="#8878C8" opacity="0.5" />
          <ellipse cx="43" cy="37" rx="4" ry="2.5" fill="#8878C8" opacity="0.5" />
          {/* Drooping closed sad eyes */}
          <path d="M18 28C21 31 25 31 27 28" stroke="#202019" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M33 28C35 31 39 31 42 28" stroke="#202019" strokeWidth="2.8" strokeLinecap="round" />
          {/* Pout / downturned mouth */}
          <path d="M26 38C28 35 32 35 34 38" stroke="#202019" strokeWidth="2.8" strokeLinecap="round" />
          {/* Blue teardrop */}
          <path d="M42 34C42 37 39 39 39 36C39 33 42 32 42 34Z" fill="#39A9E8" />
        </svg>
      );

    case 'focused':
      // Sky blue with starry eyes and energetic smile
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${selected ? 'scale-110 drop-shadow-md' : 'hover:scale-105'} ${className}`}
          aria-label="Focused mood"
        >
          {/* Outer circle */}
          <circle cx="30" cy="30" r="28" fill="#39A9E8" stroke="#1D81BA" strokeWidth="2.5" />
          {/* Sparkles / headband */}
          <path d="M15 16L45 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          {/* Rosy cheeks */}
          <ellipse cx="17" cy="36" rx="4" ry="2.5" fill="#1C7EBA" opacity="0.4" />
          <ellipse cx="43" cy="36" rx="4" ry="2.5" fill="#1C7EBA" opacity="0.4" />
          {/* Big determined sparkle eyes */}
          <circle cx="21" cy="27" r="6" fill="#FFFFFF" />
          <circle cx="21" cy="27" r="3.5" fill="#102C42" />
          <circle cx="23" cy="25" r="1.5" fill="#FFFFFF" />
          <circle cx="39" cy="27" r="6" fill="#FFFFFF" />
          <circle cx="39" cy="27" r="3.5" fill="#102C42" />
          <circle cx="41" cy="25" r="1.5" fill="#FFFFFF" />
          {/* Confident open smile */}
          <path d="M24 38C26 42 34 42 36 38" stroke="#102C42" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'frustrated':
      // Coral red with little horns/angry brows and pout
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${selected ? 'scale-110 drop-shadow-md' : 'hover:scale-105'} ${className}`}
          aria-label="Frustrated mood"
        >
          {/* Outer circle */}
          <circle cx="30" cy="30" r="28" fill="#F47C91" stroke="#CE4C64" strokeWidth="2.5" />
          {/* Rosy flushed cheeks */}
          <ellipse cx="16" cy="37" rx="5" ry="3" fill="#D33F59" opacity="0.5" />
          <ellipse cx="44" cy="37" rx="5" ry="3" fill="#D33F59" opacity="0.5" />
          {/* Furrowed angry eyebrows */}
          <path d="M17 21L27 26" stroke="#202019" strokeWidth="3" strokeLinecap="round" />
          <path d="M43 21L33 26" stroke="#202019" strokeWidth="3" strokeLinecap="round" />
          {/* Squinted determined eyes */}
          <circle cx="23" cy="28" r="4" fill="#202019" />
          <circle cx="37" cy="28" r="4" fill="#202019" />
          {/* Tight straight or zig-zag mouth */}
          <path d="M24 39L36 39" stroke="#202019" strokeWidth="3" strokeLinecap="round" />
          {/* Little steam puffs */}
          <circle cx="10" cy="16" r="2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="50" cy="16" r="2" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );

    case 'overwhelmed':
      // Bright pink with spiral/dizzy eyes and little open mouth
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${selected ? 'scale-110 drop-shadow-md' : 'hover:scale-105'} ${className}`}
          aria-label="Overwhelmed mood"
        >
          {/* Outer circle */}
          <circle cx="30" cy="30" r="28" fill="#FB7BA2" stroke="#E34E7C" strokeWidth="2.5" />
          {/* Rosy flushed cheeks */}
          <ellipse cx="16" cy="36" rx="5" ry="3" fill="#CF2F61" opacity="0.4" />
          <ellipse cx="44" cy="36" rx="5" ry="3" fill="#CF2F61" opacity="0.4" />
          {/* Spiral / dizzy eyes */}
          <path d="M18 26C18 24 22 24 22 26C22 28 17 28 17 25C17 22 24 22 24 26" stroke="#202019" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M36 26C36 24 40 24 40 26C40 28 35 28 35 25C35 22 42 22 42 26" stroke="#202019" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Small rounded 'O' mouth */}
          <ellipse cx="30" cy="39" rx="3.5" ry="4.5" fill="#202019" />
          {/* Dizzy stars above head */}
          <path d="M29 8L31 12L35 12L32 14L33 18L30 15L27 18L28 14L25 12L29 12Z" fill="#F5D547" />
        </svg>
      );

    case 'moderate':
      // Balanced teal/mint with calm open eyes, slight neutral smile, and tiny balance scale or spectacles
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${selected ? 'scale-110 drop-shadow-md' : 'hover:scale-105'} ${className}`}
          aria-label="Moderate mood"
        >
          {/* Outer circle */}
          <circle cx="30" cy="30" r="28" fill="#7FB3B8" stroke="#438990" strokeWidth="2.5" />
          {/* Rosy subtle cheeks */}
          <ellipse cx="17" cy="36" rx="4" ry="2.5" fill="#5E9EA4" opacity="0.4" />
          <ellipse cx="43" cy="36" rx="4" ry="2.5" fill="#5E9EA4" opacity="0.4" />
          {/* Calm reflective eyes */}
          <circle cx="21" cy="27" r="4.5" fill="#FFFFFF" />
          <circle cx="21" cy="27" r="2.5" fill="#184F54" />
          <circle cx="22" cy="26" r="1" fill="#FFFFFF" />
          <circle cx="39" cy="27" r="4.5" fill="#FFFFFF" />
          <circle cx="39" cy="27" r="2.5" fill="#184F54" />
          <circle cx="40" cy="26" r="1" fill="#FFFFFF" />
          {/* Relaxed neutral-curved smile */}
          <path d="M25 38C28 40 32 40 35 38" stroke="#184F54" strokeWidth="2.8" strokeLinecap="round" />
          {/* Subtle balanced antenna / sprout */}
          <path d="M30 14L30 8" stroke="#184F54" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="30" cy="7" r="2.5" fill="#E8D166" />
        </svg>
      );

    default:
      return null;
  }
};
