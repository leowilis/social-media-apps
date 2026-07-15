'use client';

import { IoHappyOutline } from 'react-icons/io5';
import EmojiPicker from './EmojiPicker';

interface CommentInputProps {
  text: string;
  isSending: boolean;
  showEmoji: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onTextChange: (value: string) => void;
  onToggleEmoji: () => void;
  onInsertEmoji: (emoji: string) => void;
  onSend: () => void;
}

export default function CommentInput({
  text,
  isSending,
  showEmoji,
  inputRef,
  onTextChange,
  onToggleEmoji,
  onInsertEmoji,
  onSend,
}: CommentInputProps) {
  return (
    <>
      {showEmoji && <EmojiPicker onSelect={onInsertEmoji} />}

      <div className='flex shrink-0 items-center gap-2.5 border-t border-white/5 px-3 py-3'>
        <button
          type='button'
          onClick={onToggleEmoji}
          className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-all ${
            showEmoji
              ? 'bg-primary-500/15 text-primary-400'
              : 'text-neutral-500 hover:bg-white/5 hover:text-white'
          }`}
        >
          <IoHappyOutline className='size-5' />
        </button>

        <div className='flex-1'>
          <input
            ref={inputRef}
            value={text}
            placeholder='Add Comment'
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSend();
              }
            }}
            className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm placeholder:text-neutral-500 text-white outline-none transition focus:border-primary-400/50'
          />
        </div>

        <button
          type='button'
          disabled={!text.trim() || isSending}
          onClick={onSend}
          className='shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-primary-400 transition disabled:opacity-40'
        >
          {isSending ? (
            <div className='size-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
          ) : (
            'Post'
          )}
        </button>
      </div>
    </>
  );
}
