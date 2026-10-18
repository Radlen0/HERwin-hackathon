import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Palette,
  Home,
  User
} from 'lucide-react';
import { MascotBrain } from './components/mascots/MascotBrain';
import { MoodType, Language } from './types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatbotScreenProps {
  mood: MoodType;
  selectedProblems: string[];
  customDetail: string;
  language: Language;
  onBackToWelcome: () => void;
  onNavigateToPaint: () => void;
  onNavigateToHome?: () => void;
}

export const ChatbotScreen: React.FC<ChatbotScreenProps> = ({
  mood,
  selectedProblems,
  customDetail,
  language,
  onBackToWelcome,
  onNavigateToPaint,
  onNavigateToHome
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Translations
  const text = {
    en: {
      agentTitle: "MiraAI",
      agentStatus: "Empathetic academic companion",
      backToWelcome: "Welcome",
      goToPaint: "Paint Canvas",
      placeholder: "Message MiraAI...",
      discussProblemsBtn: "Discuss today's struggles",
      discussProblemsSub: "Let's work through what you selected on the welcome screen",
      initialGreeting: "Hello! I'm MiraAI, your well-being companion. Whatever is on your mind today, we can take it one calm breath and one small step at a time. What would you like to focus on?",
      problemsSelectedTag: "Struggles noted:",
      errorMsg: "I'm right here with you. Take a comfortable breath and let's try again in a moment.",
      statusOnline: "Online & Listening"
    },
    fr: {
      agentTitle: "MiraAI",
      agentStatus: "Compagnon d'étude bienveillant",
      backToWelcome: "Accueil",
      goToPaint: "Espace Peinture",
      placeholder: "Écris à MiraAI...",
      discussProblemsBtn: "Discuter des défis du jour",
      discussProblemsSub: "Abordons ensemble les difficultés choisies à l'accueil",
      initialGreeting: "Bonjour ! Je suis MiraAI, ton compagnon d'études et de bien-être. Nous pouvons décomposer chaque défi en petits pas doux et clairs. Comment puis-je t'aider aujourd'hui ?",
      problemsSelectedTag: "Défis notés :",
      errorMsg: "Je suis là avec toi. Prends une grande inspiration, réessayons dans un instant.",
      statusOnline: "En ligne et à l'écoute"
    },
    derja: {
      agentTitle: "MiraAI",
      agentStatus: "Rfii9ak dima m3ak",
      backToWelcome: "El Bdeya",
      goToPaint: "Espace Lawwen",
      placeholder: "Farragh 9albek w kteb l'MiraAI...",
      discussProblemsBtn: "Nahkiw 3la hal machakel",
      discussProblemsSub: "Khellina nchoufou el machakel eli 9oltelhomli 9bila",
      initialGreeting: "Mar7ba bik! Ena MiraAI rfii9ak. 3aref elli la pression mta3 el 9raya t3ayyi, ama m3a ba3dhna kol chay yetssalla7 khotwa b khotwa. Ahkili chnouwa m9al9ek tawa?",
      problemsSelectedTag: "Machaklek el youm:",
      errorMsg: "M3ak dima. Khedhe tanaffes merta7 w taw nchoufou kol chay.",
      statusOnline: "M3ak 7adher"
    }
  }[language] || {
    agentTitle: "MiraAI",
    agentStatus: "Empathetic academic companion",
    backToWelcome: "Welcome",
    goToPaint: "Paint Canvas",
    placeholder: "Message MiraAI...",
    discussProblemsBtn: "Discuss today's struggles",
    discussProblemsSub: "Let's work through what you selected on the welcome screen",
    initialGreeting: "Hello! I'm MiraAI, your well-being companion. Whatever is on your mind today, we can take it one calm breath and one small step at a time. What would you like to focus on?",
    problemsSelectedTag: "Struggles noted:",
    errorMsg: "I'm right here with you. Take a comfortable breath and let's try again in a moment.",
    statusOnline: "Online & Listening"
  };

  useEffect(() => {
    setMessages([
      {
        id: 'msg-init',
        role: 'assistant',
        content: text.initialGreeting,
        timestamp: Date.now()
      }
    ]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setHasSentFirstMessage(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          mood,
          selectedProblems,
          language
        })
      });

      const data = await res.json();
      const botReply = data?.response || text.errorMsg;

      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: botReply,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: text.errorMsg,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscussProblemsClick = () => {
    let prompt = "";
    const problemsText = selectedProblems.join(', ');
    const noteText = customDetail.trim() ? ` (${customDetail.trim()})` : '';

    if (language === 'fr') {
      prompt = `J'aimerais qu'on parle des difficultés que je traverse aujourd'hui : ${problemsText}${noteText}. Comment puis-je m'en sortir pas à pas ?`;
    } else if (language === 'derja') {
      prompt = `N7eb nahki m3ak 3la hal machakel lyoum: ${problemsText}${noteText}. Kifech tnajjem t3awenni n7ellhom chwaya chwaya?`;
    } else {
      prompt = `I'd like to discuss the struggles I noted today: ${problemsText}${noteText}. How can we break this down into manageable steps?`;
    }

    sendMessage(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Button shown on first turn if user selected problems on welcome screen
  const showDiscussProblemsButton = !hasSentFirstMessage && selectedProblems.length > 0;

  return (
    <div className="h-screen w-full flex flex-col bg-[#FFF9E9] text-[#202019] font-sans selection:bg-[#E8E9AE] overflow-hidden">
      {/* Top Header Bar */}
      <header className="w-full bg-[#FAF5E2] border-b border-[#ECE7D4] px-4 py-3 select-none flex-shrink-0 z-10 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBackToWelcome}
              className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 border border-[#ECE7D4] flex items-center justify-center text-[#555447] transition-all cursor-pointer shadow-2xs flex-shrink-0"
              title={text.backToWelcome}
              aria-label="Back to Welcome Screen"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-white border border-[#ECE7D4] flex items-center justify-center shadow-2xs flex-shrink-0">
                <MascotBrain size="sm" animated={false} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-black text-[#202019] truncate leading-tight tracking-tight">
                    {text.agentTitle}
                  </h1>
                </div>
                <p className="text-[11px] text-[#737264] truncate">
                  {text.agentStatus} • <span className="capitalize">{mood}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Switch to Home Dashboard */}
            {onNavigateToHome && (
              <button
                onClick={onNavigateToHome}
                className="text-xs font-bold bg-white hover:bg-neutral-50 border border-[#ECE7D4] text-[#3D5834] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs flex-shrink-0"
                title="Go to Home"
              >
                <Home className="w-3.5 h-3.5 text-[#6F8D45]" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            {/* Direct Switch to Paint Screen */}
            <button
              onClick={onNavigateToPaint}
              className="text-xs font-bold bg-white hover:bg-neutral-50 border border-[#ECE7D4] text-[#872132] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs flex-shrink-0"
              title={text.goToPaint}
            >
              <Palette className="w-3.5 h-3.5 text-[#CE4C64]" />
              <span className="hidden sm:inline">{text.goToPaint}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Message Scroll Area */}
      <main className="flex-1 w-full overflow-y-auto px-4 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#ECE7D4] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <MascotBrain size="sm" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#1C1C17] text-white rounded-br-xs'
                      : 'bg-[#FFFDF7] text-[#202019] border border-[#ECE7D4] rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#3D5834] text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#ECE7D4] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <MascotBrain size="sm" animated={true} />
              </div>
              <div className="bg-[#FFFDF7] border border-[#ECE7D4] rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6F8D45] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#6F8D45] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#6F8D45] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Docked Bottom Chat Footer with Struggles Noted directly on top of the input box */}
      <footer className="w-full bg-[#FAF5E2] border-t border-[#ECE7D4] p-3 sm:p-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto space-y-2.5">
          {/* Struggles noted placed directly on top of the input box */}
          {selectedProblems.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFFDF7] border border-[#ECE7D4] rounded-2xl px-3.5 py-2 shadow-2xs">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <span className="text-[11px] font-bold text-[#555447] flex-shrink-0">
                  {text.problemsSelectedTag}
                </span>
                {selectedProblems.map((prob, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[10.5px] font-semibold text-[#202019] bg-[#FAF5E2] border border-[#DDD6C0] px-2.5 py-0.5 rounded-lg"
                  >
                    {prob}
                  </span>
                ))}
                {customDetail && (
                  <span className="inline-flex items-center text-[10.5px] font-semibold text-[#785412] bg-[#FFF2D6] border border-[#F5D547] px-2 py-0.5 rounded-lg">
                    {customDetail}
                  </span>
                )}
              </div>

              {showDiscussProblemsButton && (
                <button
                  type="button"
                  onClick={handleDiscussProblemsClick}
                  disabled={isLoading}
                  className="text-[11px] font-bold text-[#3D5834] bg-[#FAF5E2] hover:bg-[#F2EDE0] border border-[#D9E3C5] px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs flex-shrink-0 active:scale-95"
                >
                  <span>{text.discussProblemsBtn}</span>
                  <Send className="w-3 h-3 text-[#6F8D45]" />
                </button>
              )}
            </div>
          )}

          {/* Chat Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={text.placeholder}
              disabled={isLoading}
              className="flex-1 bg-white border border-[#DDD6C0] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#202019] placeholder:text-[#9A988A] focus:outline-none focus:ring-2 focus:ring-[#3D5834]/40 transition-all shadow-2xs"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-11 h-11 rounded-2xl bg-[#1C1C17] hover:bg-black disabled:bg-[#DDD6C0] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default ChatbotScreen;
