'use client';

import { useStory } from '@/hooks/useStory';
import { chapters } from '@/lib/chapters';
import { getMessagesForChapter } from '@/lib/storage';
import StoryView from '@/components/StoryView';
import ExportButton from '@/components/ExportButton';
import Link from 'next/link';

export default function MinBerattelsePage() {
  const { story, loading } = useStory();

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
        <h1 className="text-3xl font-bold mb-4">Min berättelse</h1>
        <p className="text-lg text-brown-light mb-8">
          Du har inte börjat berätta än.
        </p>
        <Link
          href="/beratta"
          className="bg-gold hover:bg-gold-dark text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
        >
          Börja berätta
        </Link>
      </div>
    );
  }

  const chaptersWithContent = chapters.filter((ch) => {
    const msgs = getMessagesForChapter(story, ch.key);
    return msgs.some((m) => m.role === 'user');
  });

  const totalAnswers = story.messages.filter((m) => m.role === 'user').length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{story.name}s berättelse</h1>
          <p className="text-brown-light/60 mt-1">
            {totalAnswers} svar i {chaptersWithContent.length} kapitel
          </p>
        </div>
        {totalAnswers > 0 && <ExportButton story={story} />}
      </div>

      {chaptersWithContent.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-brown-light/60 mb-6">
            Inga berättelser sparade än. Börja berätta så dyker de upp här!
          </p>
          <Link
            href="/beratta"
            className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Börja berätta
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {chaptersWithContent.map((chapter) => (
            <div
              key={chapter.key}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-dark"
            >
              <StoryView
                chapter={chapter}
                messages={getMessagesForChapter(story, chapter.key)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
