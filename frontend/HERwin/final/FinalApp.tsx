import React, { useState } from 'react';
import { WelcomeScreen, DestinationType } from './WelcomeScreen';
import { HomeScreen } from './HomeScreen';
import { ChatbotScreen } from './ChatbotScreen';
import { PaintScreen } from './PaintScreen';
import { MoodType, Language } from './types';

export type ScreenType = 'welcome' | 'home' | 'chatbot' | 'paint';

/**
 * FinalApp - Main container for the Final version of Nefes
 * Features currently implemented:
 * - Feature 1: Welcome Screen (floating panel, identical common problems, multi-select)
 * - Feature 2: Mascot Agent Chatbot Screen (with special 'Discuss today's problems' button on first request)
 * - Feature 3: Paint Screen (expressive drawing canvas)
 * - Feature 4: Home Screen (3D motion vertical dragging inspirational messages carousel & feature access, without mood evaluation)
 */
export const FinalApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [currentMood, setCurrentMood] = useState<MoodType>('moderate');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [customDetail, setCustomDetail] = useState<string>('');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nefes_final_lang') as Language) || 'en';
  });

  // Called when Proceed is clicked on WelcomeScreen
  const handleProceedFromWelcome = (data: {
    mood: MoodType;
    selectedProblems: string[];
    customDetail: string;
    destination: DestinationType;
    language: Language;
  }) => {
    setCurrentMood(data.mood);
    setSelectedProblems(data.selectedProblems);
    setCustomDetail(data.customDetail);
    setLanguage(data.language);

    if (data.destination === 'home') {
      setCurrentScreen('home');
    } else if (data.destination === 'chatbot') {
      setCurrentScreen('chatbot');
    } else if (data.destination === 'paint') {
      setCurrentScreen('paint');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF9E9]">
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onProceed={handleProceedFromWelcome}
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          mood={currentMood}
          selectedProblems={selectedProblems}
          language={language}
          onNavigateToChatbot={() => setCurrentScreen('chatbot')}
          onNavigateToPaint={() => setCurrentScreen('paint')}
          onNavigateToWelcome={() => setCurrentScreen('welcome')}
          onLanguageChange={setLanguage}
        />
      )}

      {currentScreen === 'chatbot' && (
        <ChatbotScreen
          mood={currentMood}
          selectedProblems={selectedProblems}
          customDetail={customDetail}
          language={language}
          onBackToWelcome={() => setCurrentScreen('welcome')}
          onNavigateToPaint={() => setCurrentScreen('paint')}
          onNavigateToHome={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'paint' && (
        <PaintScreen
          mood={currentMood}
          selectedProblems={selectedProblems}
          customDetail={customDetail}
          language={language}
          onBackToWelcome={() => setCurrentScreen('welcome')}
          onNavigateToChatbot={() => setCurrentScreen('chatbot')}
          onNavigateToHome={() => setCurrentScreen('home')}
        />
      )}
    </div>
  );
};

export default FinalApp;
