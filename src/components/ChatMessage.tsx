'use client';

import { useState } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  messageId?: string;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
}

export default function ChatMessage({
  role,
  content,
  messageId,
  onEdit,
  onDelete,
}: ChatMessageProps) {
  const isUser = role === 'user';
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(content);

  function handleSaveEdit() {
    const trimmed = editText.trim();
    if (!trimmed || !messageId || !onEdit) return;
    onEdit(messageId, trimmed);
    setEditing(false);
  }

  function handleCancelEdit() {
    setEditText(content);
    setEditing(false);
  }

  if (editing && isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] md:max-w-[75%] w-full">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full rounded-xl border border-gold bg-white px-4 py-3 text-brown focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            rows={Math.max(3, editText.split('\n').length)}
            autoFocus
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-sm rounded-lg border border-cream-dark text-brown-light hover:bg-cream-dark transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 text-sm rounded-lg bg-gold text-white hover:bg-gold-dark transition-colors"
            >
              Spara
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3 relative ${
          isUser
            ? 'bg-gold text-white rounded-br-md'
            : 'bg-white border border-cream-dark text-brown rounded-bl-md'
        }`}
      >
        {!isUser && (
          <div className="text-xs text-gold-dark font-semibold mb-1">
            Farmors Berattelser
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        {isUser && messageId && (onEdit || onDelete) && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-white/80 hover:text-white transition-colors"
              >
                Redigera
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(messageId)}
                className="text-xs text-white/80 hover:text-white transition-colors"
              >
                Ta bort
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
