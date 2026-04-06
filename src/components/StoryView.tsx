'use client';

import { useState } from 'react';
import { Message, Chapter } from '@/lib/types';

interface StoryViewProps {
  chapter: Chapter;
  messages: Message[];
  onEditMessage?: (messageId: string, newContent: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export default function StoryView({
  chapter,
  messages,
  onEditMessage,
  onDeleteMessage,
}: StoryViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const userMessages = messages.filter((m) => m.role === 'user');

  if (userMessages.length === 0) {
    return (
      <div className="text-brown-light/50 text-center py-8">
        <p>Inga berättelser än i detta kapitel.</p>
      </div>
    );
  }

  function startEdit(msg: Message) {
    setEditingId(msg.id);
    setEditText(msg.content);
  }

  function saveEdit() {
    if (!editingId || !onEditMessage) return;
    const trimmed = editText.trim();
    if (trimmed) {
      onEditMessage(editingId, trimmed);
    }
    setEditingId(null);
    setEditText('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{chapter.icon}</span>
        <h3 className="text-xl font-bold">{chapter.title}</h3>
      </div>
      <div className="space-y-6">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'assistant' ? (
              <p className="text-brown-light/60 italic text-base">
                {msg.content}
              </p>
            ) : editingId === msg.id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full rounded-xl border border-gold bg-cream px-4 py-3 text-brown focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                  rows={Math.max(3, editText.split('\n').length + 1)}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 text-sm rounded-lg bg-gold text-white hover:bg-gold-dark transition-colors"
                  >
                    Spara
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 text-sm rounded-lg border border-cream-dark text-brown-light hover:bg-cream-dark transition-colors"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <p className="text-brown leading-relaxed pr-20">
                  {msg.content}
                </p>
                {(onEditMessage || onDeleteMessage) && (
                  <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEditMessage && (
                      <button
                        onClick={() => startEdit(msg)}
                        className="text-xs text-gold-dark hover:text-gold transition-colors px-2 py-1 rounded bg-cream-dark/50"
                      >
                        Redigera
                      </button>
                    )}
                    {onDeleteMessage && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded bg-cream-dark/50"
                      >
                        Ta bort
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
