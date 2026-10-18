import { InspirationalMessage } from '../data/inspirationalMessages';
import { Language, MoodType, MotivationalSpeech } from '../types';

const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8000'
).replace(/\/+$/, '');

const toLocalized = (value: string) => ({ en: value, fr: value, derja: value });

export const toInspirationalMessage = (
  speech: MotivationalSpeech
): InspirationalMessage => ({
  id: speech.id,
  category: speech.category || 'Inspiration',
  title: toLocalized(speech.title),
  quote: toLocalized(speech.quote),
  message: toLocalized(speech.speech),
  tone: speech.authorOrTone || 'MiraAI',
});

export async function fetchMotivationalSpeeches(
  language: Language,
  mood?: MoodType
): Promise<InspirationalMessage[]> {
  const params = new URLSearchParams({
    stress_level: mood || 'moderate',
    language,
    count: '5',
  });

  const res = await fetch(`${API_BASE_URL}/daily?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to load motivational speeches (${res.status})`);
  }

  const data = await res.json();
  const speeches: MotivationalSpeech[] = Array.isArray(data?.speeches)
    ? data.speeches
    : [];

  return speeches.map(toInspirationalMessage);
}

export interface ChatPayload {
  messages: { role: 'user' | 'assistant'; content: string }[];
  mood: MoodType;
  selectedProblems: string[];
  language: Language;
}

export async function sendChatMessage(payload: ChatPayload): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed (${res.status})`);
  }

  const data = await res.json();
  const reply = typeof data?.response === 'string' ? data.response.trim() : '';
  if (!reply) {
    throw new Error('Empty chat response');
  }

  return reply;
}
