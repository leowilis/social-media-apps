'use client';

import Image from 'next/image';
import {
  IoCloudUploadOutline,
  IoImagesOutline,
  IoCloseCircle,
} from 'react-icons/io5';

interface UploadAreaProps {
  preview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemove: () => void;
  isPending: boolean;
}

export function UploadArea({
  preview,
  fileInputRef,
  onImageChange,
  onDrop,
  onRemove,
  isPending,
}: UploadAreaProps) {
  return (
    <div className='flex flex-col gap-2 select-none'>
      <label
        htmlFor='media-uploader-input'
        className='text-sm font-bold text-neutral-50 md:text-lg'
      >
        Photo
      </label>

      {preview ? (
        <div className='relative aspect-square overflow-hidden rounded-2xl'>
          <Image
            src={preview}
            alt='Selected image preview'
            fill
            priority
            draggable={false}
            className='select-none object-cover'
          />

          <div className='absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent pb-4'>
            <button
              type='button'
              disabled={isPending}
              aria-label='Change selected image'
              onClick={() => fileInputRef.current?.click()}
              className='flex cursor-pointer items-center gap-1 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <IoImagesOutline className='size-4' aria-hidden='true' />
              Change Image
            </button>

            <button
              type='button'
              disabled={isPending}
              aria-label='Remove selected image'
              onClick={onRemove}
              className='flex cursor-pointer items-center gap-1 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <IoCloseCircle className='size-4' aria-hidden='true' />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          role='button'
          tabIndex={0}
          aria-label='Upload image'
          aria-describedby='upload-help'
          onClick={() => !isPending && fileInputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isPending) {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className='flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-900 bg-neutral-950 py-14 transition-colors hover:border-primary-400 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
        >
          <IoCloudUploadOutline
            className='size-10 text-neutral-500'
            aria-hidden='true'
          />

          <div className='text-center'>
            <p className='text-sm font-semibold text-neutral-600'>
              <span className='text-primary-300'>Click to upload</span> or drag
              and drop
            </p>

            <p id='upload-help' className='mt-1 text-xs text-neutral-600'>
              PNG, JPG, JPEG (max 5MB)
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        id='media-uploader-input'
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onImageChange}
      />
    </div>
  );
}
