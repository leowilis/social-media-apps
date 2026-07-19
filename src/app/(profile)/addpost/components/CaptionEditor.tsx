'use client';

import { IoHappyOutline } from 'react-icons/io5';
import EmojiPickerComponent, {
  Theme,
  type EmojiClickData,
} from 'emoji-picker-react';
import { Textarea } from '@/components/ui/textarea';

interface CaptionEditorProps {
  caption: string;
  showEmoji: boolean;
  maxCaption: number;
  onCaptionChange: (value: string) => void;
  onToggleEmoji: () => void;
  onEmojiClick: (emoji: EmojiClickData) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function CaptionEditor({
  caption,
  showEmoji,
  maxCaption,
  onCaptionChange,
  onToggleEmoji,
  onEmojiClick,
  textareaRef,
}: CaptionEditorProps) {
  return (
    <div className='flex flex-col gap-2 select-none'>
      <div className='flex items-center justify-between'>
        <label
          htmlFor='post-caption-input'
          className='text-sm font-bold text-neutral-50 md:text-lg'
        >
          Caption
        </label>

        <span aria-live='polite' className='text-xs text-neutral-500'>
          {caption.length}/{maxCaption}
        </span>
      </div>

      <div className='relative'>
        <Textarea
          ref={textareaRef}
          id='post-caption-input'
          value={caption}
          rows={4}
          placeholder='Create your caption'
          onChange={(e) => onCaptionChange(e.target.value.slice(0, maxCaption))}
          className='resize-none rounded-xl border-neutral-800 bg-neutral-950 pr-10 text-white placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:border-primary-400'
        />

        <button
          type='button'
          aria-haspopup='dialog'
          aria-expanded={showEmoji}
          aria-label={
            showEmoji ? 'Close emoji tray picker' : 'Open emoji tray picker'
          }
          onClick={onToggleEmoji}
          className='absolute right-3 top-3 text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
        >
          <IoHappyOutline className='size-5' aria-hidden='true' />
        </button>

        {showEmoji && (
          <>
            <div
              className='fixed inset-0 z-30 bg-transparent cursor-default'
              onClick={onToggleEmoji}
              aria-hidden='true'
            />

            <div className='absolute bottom-14 right-0 z-40 shadow-2xl rounded-2xl border border-white/5 bg-[#0e0e13] animate-in fade-in slide-in-from-bottom-1 duration-150'>
              <EmojiPickerComponent
                theme={Theme.DARK}
                onEmojiClick={onEmojiClick}
                lazyLoadEmojis
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
