'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStory } from '@/hooks/useStory';
import { ChapterKey, Message } from '@/lib/types';
import { getNextQuestion, getChapter } from '@/lib/chapters';
import { getMessagesForChapter } from '@/lib/storage';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import ChapterNav from '@/components/ChapterNav';
import SaveIndicator from '@/components/SaveIndicator';

export default function BerattaPage() {
  const {
    story,
    loading,
    lastSaved,
    startStory,
    addUserMessage,
    addAssistantMessage,
    editMessage,
    removeMessage,
    setCurrentChapter,
  } = useStory();
  const [nameInput, setNameInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialQuestionSent = useRef<Set<string>>(new Set());

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [story?.messages.length, streamingText, scrollToBottom]);

  // When entering a chapter with no messages, send initial AI question
  useEffect(() => {
    if (!story || streaming) return;
    const key = `${story.id}-${story.currentChapter}`;
    if (initialQuestionSent.current.has(key)) return;
    const chapterMessages = getMessagesForChapter(story, story.currentChapter);
    if (chapterMessages.length === 0) {
      initialQuestionSent.current.add(key);
      sendInitialQuestion(story.currentChapter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.currentChapter, story?.id]);

  async function sendInitialQuestion(chapter: ChapterKey) {
    await fetchAIResponse([], chapter);
  }

  async function fetchAIResponse(
    chatMessages: { role: 'user' | 'assistant'; content: string }[],
    chapter: ChapterKey
  ) {
    setStreaming(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          chapter,
          name: story?.name || 'du',
        }),
      });

      if (res.status === 501) {
        const userCount = chatMessages.filter((m) => m.role === 'user').length;
        const fallbackQ = getNextQuestion(chapter, userCount);
        const fallback =
          fallbackQ ||
          `Tack for att du delade med dig! Vill du beratta nagot mer om "${getChapter(chapter).title}"?`;
        addAssistantMessage(fallback, chapter);
        setStreaming(false);
        return;
      }

      if (!res.ok) {
        throw new Error('API error');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamingText(fullText);
      }

      addAssistantMessage(fullText, chapter);
    } catch {
      const userCount = chatMessages.filter((m) => m.role === 'user').length;
      const fallbackQ = getNextQuestion(chapter, userCount);
      const fallback =
        fallbackQ ||
        `Tack for att du delade med dig! Vill du beratta nagot mer om "${getChapter(chapter).title}"?`;
      addAssistantMessage(fallback, chapter);
    } finally {
      setStreaming(false);
      setStreamingText('');
    }
  }

  async function handleSend(text: string) {
    if (!story) return;
    const chapter = story.currentChapter;
    const updatedStory = addUserMessage(text, chapter);
    if (!updatedStory) return;

    const chapterMsgs = getMessagesForChapter(updatedStory, chapter);
    const chatMessages = chapterMsgs.map((m: Message) => ({
      role: m.role,
      content: m.content,
    }));

    await fetchAIResponse(chatMessages, chapter);
  }

  function handleChapterSelect(key: ChapterKey) {
    if (streaming) return;
    setCurrentChapter(key);
  }

  function handleStartStory() {
    const name = nameInput.trim();
    if (!name) return;
    startStory(name);
  }

  function handleEditMessage(messageId: string, newContent: string) {
    editMessage(messageId, newContent);
  }

  function handleDeleteMessage(messageId: string) {
    removeMessage(messageId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-brown-light/60 text-lg">Laddar...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Välkommen!</h1>
          <p className="text-lg text-brown-light mb-8">
            Innan vi börjar &ndash; vad heter du?
          </p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartStory()}
            placeholder="Ditt namn"
            className="w-full text-lg px-4 py-3 rounded-xl border border-cream-dark bg-white text-brown placeholder:text-brown-light/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold mb-4"
            autoFocus
          />
          <button
            onClick={handleStartStory}
            disabled={!nameInput.trim()}
            className="w-full bg-gold hover:bg-gold-dark disabled:opacity-40 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Börja berätta
          </button>
        </div>
      </div>
    );
  }

  const currentMessages = getMessagesForChapter(story, story.currentChapter);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1 overflow-x-auto">
          <ChapterNav
            currentChapter={story.currentChapter}
            onSelect={handleChapterSelect}
            messages={story.messages}
          />
        </div>
        <SaveIndicator lastSaved={lastSaved} />
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {currentMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            messageId={msg.id}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
          />
        ))}
        {streaming && streamingText && (
          <ChatMessage role="assistant" content={streamingText} />
        )}
        {streaming && !streamingText && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-cream-dark rounded-2xl rounded-bl-md px-5 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gold/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gold/40 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-gold/40 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 border-t border-cream-dark">
        <ChatInput onSend={handleSend} disabled={streaming} />
      </div>
    </div>
  );
}
