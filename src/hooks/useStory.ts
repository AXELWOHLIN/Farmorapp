'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Story, ChapterKey } from '@/lib/types';
import {
  loadStory,
  saveStory,
  createStory,
  addMessage,
  updateMessage,
  deleteMessage,
} from '@/lib/storage';

export function useStory() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const storyRef = useRef<Story | null>(null);

  // Keep ref in sync so callbacks always see latest story
  useEffect(() => {
    storyRef.current = story;
  }, [story]);

  useEffect(() => {
    const saved = loadStory();
    setStory(saved);
    storyRef.current = saved;
    if (saved) setLastSaved(saved.updatedAt);
    setLoading(false);
  }, []);

  const startStory = useCallback((name: string) => {
    const newStory = createStory(name);
    setStory(newStory);
    storyRef.current = newStory;
    setLastSaved(newStory.updatedAt);
    return newStory;
  }, []);

  const addUserMessage = useCallback(
    (content: string, chapter: ChapterKey) => {
      const current = storyRef.current;
      if (!current) return null;
      const updated = addMessage(current, 'user', content, chapter);
      setStory(updated);
      storyRef.current = updated;
      setLastSaved(updated.updatedAt);
      return updated;
    },
    []
  );

  const addAssistantMessage = useCallback(
    (content: string, chapter: ChapterKey) => {
      const current = storyRef.current;
      if (!current) return null;
      const updated = addMessage(current, 'assistant', content, chapter);
      setStory(updated);
      storyRef.current = updated;
      setLastSaved(updated.updatedAt);
      return updated;
    },
    []
  );

  const editMessage = useCallback(
    (messageId: string, newContent: string) => {
      const current = storyRef.current;
      if (!current) return;
      const updated = updateMessage(current, messageId, newContent);
      setStory(updated);
      storyRef.current = updated;
      setLastSaved(updated.updatedAt);
    },
    []
  );

  const removeMessage = useCallback(
    (messageId: string) => {
      const current = storyRef.current;
      if (!current) return;
      const updated = deleteMessage(current, messageId);
      setStory(updated);
      storyRef.current = updated;
      setLastSaved(updated.updatedAt);
    },
    []
  );

  const setCurrentChapter = useCallback(
    (chapter: ChapterKey) => {
      const current = storyRef.current;
      if (!current) return;
      const updated = {
        ...current,
        currentChapter: chapter,
        updatedAt: Date.now(),
      };
      saveStory(updated);
      setStory(updated);
      storyRef.current = updated;
    },
    []
  );

  return {
    story,
    loading,
    lastSaved,
    startStory,
    addUserMessage,
    addAssistantMessage,
    editMessage,
    removeMessage,
    setCurrentChapter,
  };
}
