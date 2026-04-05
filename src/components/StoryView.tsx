import { Message } from '@/lib/types';
import { Chapter } from '@/lib/types';

interface StoryViewProps {
  chapter: Chapter;
  messages: Message[];
}

export default function StoryView({ chapter, messages }: StoryViewProps) {
  const userMessages = messages.filter((m) => m.role === 'user');

  if (userMessages.length === 0) {
    return (
      <div className="text-brown-light/50 text-center py-8">
        <p>Inga berättelser än i detta kapitel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{chapter.icon}</span>
        <h3 className="text-xl font-bold">{chapter.title}</h3>
      </div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.role === 'assistant' ? (
            <p className="text-brown-light/60 italic text-base">{msg.content}</p>
          ) : (
            <p className="text-brown leading-relaxed">{msg.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
