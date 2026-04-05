interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3 ${
          isUser
            ? 'bg-gold text-white rounded-br-md'
            : 'bg-white border border-cream-dark text-brown rounded-bl-md'
        }`}
      >
        {!isUser && (
          <div className="text-xs text-gold-dark font-semibold mb-1">
            Farmors Berättelser
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
