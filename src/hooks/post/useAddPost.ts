'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EmojiClickData } from 'emoji-picker-react';
import { useToast } from '@/hooks/common/useToast';
import { useCreatePost } from '@/hooks/post/useCreatePost';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_CAPTION = 500;

export function useAddPost() {
  const router = useRouter();
  const toast = useToast();

  const { mutate: createPost, isPending } = useCreatePost();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (!preview) return;

    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Maximum image size is 5 MB.');
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleEmoji = () => {
    setShowEmoji((prev) => !prev);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const input = textareaRef.current;

    if (!input) {
      setCaption((prev) => (prev + emojiData.emoji).slice(0, MAX_CAPTION));

      setShowEmoji(false);
      return;
    }

    const start = input.selectionStart ?? caption.length;
    const end = input.selectionEnd ?? caption.length;

    const value =
      caption.slice(0, start) + emojiData.emoji + caption.slice(end);

    const next = value.slice(0, MAX_CAPTION);

    setCaption(next);
    setShowEmoji(false);

    requestAnimationFrame(() => {
      input.focus();

      const cursor = Math.min(start + emojiData.emoji.length, MAX_CAPTION);

      input.setSelectionRange(cursor, cursor);
    });
  };

  const handleSubmit = () => {
    if (!image || isPending) return;

    createPost(
      {
        image,
        caption: caption.trim(),
      },
      {
        onSuccess: () => {
          handleRemoveImage();
          setCaption('');
          setShowEmoji(false);

          toast.success('Post created successfully.');

          router.push('/');
        },

        onError: () => {
          toast.error('Failed to create post.');
        },
      },
    );
  };

  const goBack = () => {
    router.back();
  };

  return {
    MAX_CAPTION,
    image,
    preview,
    caption,
    showEmoji,
    isPending,
    fileInputRef,
    textareaRef,
    setCaption,
    goBack,
    toggleEmoji,
    handleDrop,
    handleSubmit,
    handleEmojiClick,
    handleImageChange,
    handleRemoveImage,
  };
}
