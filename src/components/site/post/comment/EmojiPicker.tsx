'use client';

import { EMOJIS } from './constants';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <div
      role='listbox'
      aria-label='Emoji selection tray'
      className='mx-3 mb-2 grid grid-cols-10 place-items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-3'
    >
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type='button'
          aria-label={`Insert ${emoji}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(emoji);
          }}
          className='rounded p-1 text-lg transition-transform hover:scale-125 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
