'use client';

import { useAddPost } from '@/hooks/post/useAddPost';
import { UploadArea } from './components/UploadArea';
import { CaptionEditor } from './components/CaptionEditor';
import { DesktopHeader } from './components/DesktopHeader';
import { SubmitButton } from './components/SubmitButton';


export default function AddPostPage() {
  const addPost = useAddPost();

  return (
    <div className='flex flex-col gap-5 px-4 py-6 min-h-screen bg-black text-white select-none md:max-w-2xl md:mx-auto'>
      {/* Header — desktop only */}
      <DesktopHeader onBack={addPost.goBack} />
      {/* Photo Upload */}
      <UploadArea
        preview={addPost.preview}
        fileInputRef={addPost.fileInputRef}
        onImageChange={addPost.handleImageChange}
        onDrop={addPost.handleDrop}
        onRemove={addPost.handleRemoveImage}
        isPending={addPost.isPending}
      />

      {/* Caption */}
      <CaptionEditor
        caption={addPost.caption}
        showEmoji={addPost.showEmoji}
        maxCaption={addPost.MAX_CAPTION}
        onCaptionChange={addPost.setCaption}
        onToggleEmoji={addPost.toggleEmoji}
        onEmojiClick={addPost.handleEmojiClick}
        textareaRef={addPost.textareaRef}
      />

      {/* Submit */}
      <SubmitButton
        disabled={!addPost.image || addPost.isPending}
        isPending={addPost.isPending}
        onSubmit={addPost.handleSubmit}
      />
    </div>
  );
}
