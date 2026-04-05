'use client';

import { useState, useEffect, useCallback } from 'react';
import { Story, ChapterKey } from '@/lib/types';
import { loadStory, saveStory, createStory, addMessage } from '@/lib/storage';

export function useStory() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadStory();
    setStory(saved);
    setLoading(false);
  }, []);

  const startStory = useCallback((name: string) => {
    const newStory = createStory(name);
    setStory(newStory);
    return newStory;
  }, []);

  const addUserMessage = useCallback(
    (content: string, chapter: ChapterKey) => {
      if (!story) return story;
      const updated = addMessage(story, 'user', content, chapter);
      setStory(updated);
      return updated;
    },
    [story]
  );

  const addAssistantMessage = useCallback(
    (content: string, chapter: ChapterKey) => {
      if (!story) return story;
      const updated = addMessage(story, 'assistant', content, chapter);
      setStory(updated);
      return updated;
    },
    [story]
  );

  const setCurrentChapter = useCallback(
    (chapter: ChapterKey) => {
      if (!story) return;
      const updated = { ...story, currentChapter: chapter, updatedAt: Date.now() };
      saveStory(updated);
      setStory(updated);
    },
    [story]
  );

  return {
    story,
    loading,
    startStory,
    addUserMessage,
    addAssistantMessage,
    setCurrentChapter,
  };
}
