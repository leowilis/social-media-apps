'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  IoCloudUploadOutline,
  IoImagesOutline,
  IoCloseCircle,
  IoHappyOutline,
  IoArrowBack,
} from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePost } from '@/hooks/post/usePostActions';
import type { EmojiClickData } from 'emoji-picker-react';
import EmojiPickerComponent, { Theme } from 'emoji-picker-react';

// Constants

const MAX_CAPTION = 500;

// Component

/**
 * Add post page — handles image upload and caption input.
 * Uses useCreatePost for the mutation and redirects to feed on success.
 */
export default function AddPostPage() {
  const router = useRouter();
  const { mutate: createPost, isPending, error } = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  // Handlers

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setCaption((prev) => (prev + emojiData.emoji).slice(0, MAX_CAPTION));
    setShowEmoji(false);
  };

  const handleSubmit = () => {
    if (!image) return;
    createPost({ image, caption }, { onSuccess: () => router.push('/') });
  };

  // Render

  return (
    <div className='flex flex-col gap-5 px-4 py-6 min-h-screen bg-black text-white md:max-w-2xl md:mx-auto'>
      {/* Header — desktop only */}
      <div className='hidden md:flex items-center gap-3 mb-8'>
        <button
          onClick={() => router.back()}
          className='text-white hover:text-neutral-400 transition-colors'
        >
          <IoArrowBack className='size-5' />
        </button>
        <span className='text-lg font-bold md:text-2xl'>Add Post</span>
      </div>
      {/* Photo Upload */}
      <div className='flex flex-col gap-2 '>
        <span className='text-sm font-bold text-neutral-50 md:text-lg'>Photo</span>

        {preview ? (
          <div className='relative w-full rounded-2xl overflow-hidden aspect-square'>
            <Image src={preview} alt='preview' fill className='object-cover' />
            <div className='absolute inset-0 flex items-end justify-center gap-2 pb-4 bg-gradient-to-t from-black/60 to-transparent'>
              <button
                onClick={() => fileInputRef.current?.click()}
                className='flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-colors'
              >
                <IoImagesOutline className='size-4' />
                Change Image
              </button>
              <button
                onClick={handleRemoveImage}
                className='flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-colors'
              >
                <IoCloseCircle className='size-4' />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className='flex flex-col items-center justify-center gap-3 w-full rounded-2xl border border-neutral-900 bg-neutral-950 py-14 cursor-pointer hover:border-purple-500 hover:bg-neutral-800 transition-colors'
          >
            <IoCloudUploadOutline className='size-10 text-neutral-500' />
            <div className='text-center'>
              <p className='text-sm font-semibold text-neutral-600'>
                <span className='text-primary-300'>Click to upload</span> or
                drag and drop
              </p>
              <p className='text-xs text-neutral-600 mt-1'>
                PNG, JPG, JPEG (max 5MB)
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleImageChange}
        />
      </div>

      {/* Caption */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-bold text-neutral-50 md:text-lg'>Caption</span>
          <span className='text-xs text-neutral-500'>
            {caption.length}/{MAX_CAPTION}
          </span>
        </div>

        <div className='relative'>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
            placeholder='Create your caption'
            rows={4}
            className='rounded-xl border border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0 resize-none pr-10'
          />
          <button
            type='button'
            onClick={() => setShowEmoji((v) => !v)}
            className='absolute top-3 right-3 text-neutral-400 hover:text-white transition-colors'
          >
            <IoHappyOutline className='size-5' />
          </button>
          {showEmoji && (
            <div className='absolute bottom-14 right-0 z-50'>
              <EmojiPickerComponent
                theme={Theme.DARK}
                onEmojiClick={handleEmojiClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className='text-sm text-red-400 font-semibold'>
          {error.message ?? 'Failed to create post.'}
        </p>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isPending || !image}
        className='h-12 rounded-full bg-primary-300 hover:bg-purple-700 font-bold text-white disabled:opacity-50'
      >
        {isPending ? 'Sharing...' : 'Share'}
      </Button>
    </div>
  );
}
