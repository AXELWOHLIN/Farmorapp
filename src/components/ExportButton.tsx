'use client';

import { useState } from 'react';
import { Story } from '@/lib/types';
import { chapters } from '@/lib/chapters';

interface ExportButtonProps {
  story: Story;
}

export default function ExportButton({ story }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);

  function generateText(): string {
    let text = `${story.name}s Livsberättelse\n`;
    text += `${'='.repeat(40)}\n\n`;

    for (const chapter of chapters) {
      const msgs = story.messages.filter((m) => m.chapter === chapter.key);
      const userMsgs = msgs.filter((m) => m.role === 'user');
      if (userMsgs.length === 0) continue;

      text += `${chapter.icon} ${chapter.title}\n`;
      text += `${'-'.repeat(30)}\n\n`;

      for (const msg of msgs) {
        if (msg.role === 'assistant') {
          text += `Fråga: ${msg.content}\n\n`;
        } else {
          text += `${msg.content}\n\n`;
        }
      }
      text += '\n';
    }

    return text;
  }

  async function handleCopy() {
    const text = generateText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const text = generateText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.name}s-livsberattelse.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopy}
        className="bg-white border border-cream-dark hover:bg-cream-dark text-brown font-semibold px-5 py-3 rounded-xl transition-colors min-h-[48px]"
      >
        {copied ? 'Kopierad!' : 'Kopiera text'}
      </button>
      <button
        onClick={handleDownload}
        className="bg-gold hover:bg-gold-dark text-white font-semibold px-5 py-3 rounded-xl transition-colors min-h-[48px]"
      >
        Ladda ner
      </button>
    </div>
  );
}
