import { Story, Message, ChapterKey } from './types';

const STORY_KEY = 'farmors-berattelser-story';

export function loadStory(): Story | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORY_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as Story;
  } catch {
    return null;
  }
}

export function saveStory(story: Story): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORY_KEY, JSON.stringify(story));
}

export function createStory(name: string): Story {
  const story: Story = {
    id: crypto.randomUUID(),
    name,
    messages: [],
    currentChapter: 'barndom',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveStory(story);
  return story;
}

export function addMessage(
  story: Story,
  role: 'user' | 'assistant',
  content: string,
  chapter: ChapterKey
): Story {
  const message: Message = {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
    chapter,
  };
  const updated: Story = {
    ...story,
    messages: [...story.messages, message],
    updatedAt: Date.now(),
  };
  saveStory(updated);
  return updated;
}

export function updateMessage(
  story: Story,
  messageId: string,
  newContent: string
): Story {
  const updated: Story = {
    ...story,
    messages: story.messages.map((m) =>
      m.id === messageId ? { ...m, content: newContent, timestamp: Date.now() } : m
    ),
    updatedAt: Date.now(),
  };
  saveStory(updated);
  return updated;
}

export function deleteMessage(story: Story, messageId: string): Story {
  const updated: Story = {
    ...story,
    messages: story.messages.filter((m) => m.id !== messageId),
    updatedAt: Date.now(),
  };
  saveStory(updated);
  return updated;
}

export function getMessagesForChapter(
  story: Story,
  chapter: ChapterKey
): Message[] {
  return story.messages.filter((m) => m.chapter === chapter);
}

export function deleteStory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORY_KEY);
}
