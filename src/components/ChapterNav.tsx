'use client';

import { chapters } from '@/lib/chapters';
import { ChapterKey, Message } from '@/lib/types';

interface ChapterNavProps {
  currentChapter: ChapterKey;
  onSelect: (key: ChapterKey) => void;
  messages: Message[];
}

export default function ChapterNav({
  currentChapter,
  onSelect,
  messages,
}: ChapterNavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chapters.map((chapter) => {
        const count = messages.filter(
          (m) => m.chapter === chapter.key && m.role === 'user'
        ).length;
        const isActive = currentChapter === chapter.key;

        return (
          <button
            key={chapter.key}
            onClick={() => onSelect(chapter.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base transition-colors ${
              isActive
                ? 'bg-gold text-white font-semibold'
                : 'bg-white border border-cream-dark text-brown-light hover:bg-cream-dark'
            }`}
          >
            <span>{chapter.icon}</span>
            <span>{chapter.title}</span>
            {count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-sage-light/30 text-sage'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
