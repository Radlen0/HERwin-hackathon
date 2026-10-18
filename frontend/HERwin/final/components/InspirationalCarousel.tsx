import React, { useState } from 'react';
import {
  motion,
  MotionConfig,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  type Transition,
} from 'motion/react';
import { Quote, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { InspirationalMessage, INSPIRATIONAL_MESSAGES } from '../data/inspirationalMessages';
import { Language } from '../types';

interface InspirationalCarouselProps {
  messages?: InspirationalMessage[];
  language?: Language;
  initialIndex?: number;
}

const CARD_HEIGHT = 280;
const DRAG_BUFFER = 35;
const VELOCITY_THRESHOLD = 20;

const SPRING_OPTIONS: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 36,
};

interface CardProps {
  item: InspirationalMessage;
  index: number;
  y: any;
  language: Language;
}

const InspirationCard: React.FC<CardProps> = ({ item, index, y, language }) => {
  const cardOffset = index * CARD_HEIGHT;

  const rotateX = useTransform(
    y,
    [
      -(cardOffset + CARD_HEIGHT),
      -cardOffset,
      -(cardOffset - CARD_HEIGHT),
    ],
    [-22, 0, 22],
    { clamp: true }
  );

  const DEAD_ZONE = CARD_HEIGHT * 0.25;

  const blur = useTransform(
    y,
    [
      -(cardOffset + CARD_HEIGHT),
      -(cardOffset + DEAD_ZONE),
      -cardOffset,
      -(cardOffset - DEAD_ZONE),
      -(cardOffset - CARD_HEIGHT),
    ],
    [6, 0, 0, 0, 6],
    { clamp: true }
  );

  const filter = useMotionTemplate`blur(${blur}px)`;

  const title = item.title[language] || item.title.en;
  const quote = item.quote[language] || item.quote.en;
  const message = item.message[language] || item.message.en;

  return (
    <motion.div
      key={item.id}
      className="flex h-[280px] w-full flex-col justify-between p-6 sm:p-7 select-none transform-3d"
      style={{
        rotateX,
        filter,
        transformPerspective: 1000,
      }}
    >
      <div>
        {/* Category & Tone Badge */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#6F8D45] bg-[#E8E9AE]/40 border border-[#D9E3C5] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F8D45A]" />
            {item.category}
          </span>
          <span className="text-[10px] font-bold text-[#8C8A7B]">
            {item.tone}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-black tracking-tight text-[#202019] mb-1.5 leading-snug">
          {title}
        </h3>

        {/* Short heartfelt message */}
        <p className="text-xs sm:text-[13px] text-[#555447] leading-relaxed line-clamp-3">
          {message}
        </p>
      </div>

      {/* Quote callout */}
      <div className="mt-2 pt-2.5 border-t border-[#ECE7D4]/80 flex items-start gap-2 bg-[#FAF6EC]/60 rounded-xl p-2.5">
        <Quote className="w-3.5 h-3.5 text-[#6F8D45] flex-shrink-0 mt-0.5" />
        <p className="text-xs font-bold text-[#3D5834] italic line-clamp-2">
          "{quote}"
        </p>
      </div>
    </motion.div>
  );
};

export const InspirationalCarousel: React.FC<InspirationalCarouselProps> = ({
  messages = INSPIRATIONAL_MESSAGES,
  language = 'en',
  initialIndex = 0,
}) => {
  const [index, setIndex] = useState(initialIndex);
  const y = useMotionValue(-(initialIndex * CARD_HEIGHT));

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setIndex((prev) => Math.min(prev + 1, messages.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handlePrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setIndex((prev) => Math.min(prev + 1, messages.length - 1));
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      <MotionConfig transition={SPRING_OPTIONS}>
        <div className="relative w-full max-w-md">
          {/* Subtle 3D background depth layer matching Nefes aesthetic */}
          <div className="absolute right-4 -bottom-2.5 left-4 z-0 h-10 rounded-[32px] border-2 border-[#E5E0D0] bg-[#FAF5E2] shadow-xs" />

          {/* Main 3D Interactive Container */}
          <div className="relative h-[280px] w-full overflow-hidden rounded-[36px] border-2 border-[#ECE7D4] bg-[#FFFDF7] shadow-md perspective-[1000px] transform-3d">
            <motion.div
              drag="y"
              dragConstraints={{
                top: -((messages.length - 1) * CARD_HEIGHT),
                bottom: 0,
              }}
              dragElastic={0.15}
              style={{ y }}
              onDragEnd={handleDragEnd}
              animate={{
                y: -(index * CARD_HEIGHT),
              }}
              className="flex cursor-grab flex-col transform-3d active:cursor-grabbing"
            >
              {messages.map((item, i) => (
                <InspirationCard
                  key={item.id}
                  item={item}
                  index={i}
                  y={y}
                  language={language}
                />
              ))}
            </motion.div>

            {/* Right-side Vertical Indicator Pills */}
            <div className="absolute top-1/2 right-3.5 z-20 flex -translate-y-1/2 flex-col items-center">
              {messages.map((_, i) => (
                <button
                  key={i}
                  title={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="py-1 px-1 focus:outline-none cursor-pointer"
                >
                  <motion.div
                    animate={{
                      height: i === index ? 32 : 8,
                      backgroundColor: i === index ? '#3D5834' : '#DCD6C4',
                    }}
                    transition={{ duration: 0.25 }}
                    className="w-[6px] rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </MotionConfig>

      {/* Up/Down Quick Controls and Drag Helper */}
      <div className="flex items-center justify-between w-full max-w-md px-3 pt-2 text-[11px] text-[#8C8A7B]">
        <span className="flex items-center gap-1 font-medium">
          <span>↕️ Drag or tap to switch</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="w-6 h-6 rounded-full bg-white border border-[#ECE7D4] disabled:opacity-30 flex items-center justify-center text-[#555447] hover:bg-[#FAF5E2] cursor-pointer shadow-2xs"
            title="Previous inspiration"
            aria-label="Previous inspiration"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-bold text-[#555447] min-w-[28px] text-center">
            {index + 1} / {messages.length}
          </span>
          <button
            onClick={handleNext}
            disabled={index === messages.length - 1}
            className="w-6 h-6 rounded-full bg-white border border-[#ECE7D4] disabled:opacity-30 flex items-center justify-center text-[#555447] hover:bg-[#FAF5E2] cursor-pointer shadow-2xs"
            title="Next inspiration"
            aria-label="Next inspiration"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspirationalCarousel;
