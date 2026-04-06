'use client';

import { useEffect, useState } from 'react';

interface SaveIndicatorProps {
  lastSaved: number | null;
}

export default function SaveIndicator({ lastSaved }: SaveIndicatorProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!lastSaved) return;

    function update() {
      const seconds = Math.floor((Date.now() - lastSaved!) / 1000);
      if (seconds < 5) setText('Sparad');
      else if (seconds < 60) setText(`Sparad för ${seconds}s sedan`);
      else {
        const mins = Math.floor(seconds / 60);
        setText(`Sparad för ${mins} min sedan`);
      }
    }

    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  if (!lastSaved) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-sage">
      <span className="w-2 h-2 rounded-full bg-sage" />
      {text}
    </div>
  );
}
