export type ChapterKey =
  | 'barndom'
  | 'ungdom'
  | 'karlek'
  | 'familj'
  | 'arbete'
  | 'livsvisdom'
  | 'ovrigt';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  chapter: ChapterKey;
}

export interface Chapter {
  key: ChapterKey;
  title: string;
  description: string;
  icon: string;
  questions: string[];
}

export interface Story {
  id: string;
  name: string;
  messages: Message[];
  currentChapter: ChapterKey;
  createdAt: number;
  updatedAt: number;
}
