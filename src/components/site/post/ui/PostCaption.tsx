'use client';

interface PostCardCaptionProps {
  authorName: string;
  caption: string;
  showFull: boolean;
  onToggle: () => void;
}

export default function PostCardCaption({
  authorName,
  caption,
  showFull,
  onToggle,
}: PostCardCaptionProps) {
  const isLong = caption.length > 100;

  const displayedCaption =
    showFull || !isLong ? caption : `${caption.slice(0, 100).trim()}...`;

  return (
    <div className='select-none px-4 py-2 pb-4'>
      <p className='mb-1 text-sm font-bold text-white'>{authorName}</p>

      <div className='whitespace-pre-line break-words text-sm leading-relaxed text-neutral-200'>
        {displayedCaption}

        {isLong && (
          <button
            type='button'
            aria-expanded={showFull}
            aria-label={showFull ? 'Collapse caption' : 'Expand full caption'}
            onClick={onToggle}
            className='mt-1 block text-xs font-bold text-primary-400 transition-colors hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
          >
            {showFull ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
}
