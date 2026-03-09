"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { IoCloudUploadOutline, IoImagesOutline, IoCloseCircle, IoHappyOutline } from "react-icons/io5";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function AddPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);
      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-6 min-h-screen bg-black text-white">

      {/* Photo Upload */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-neutral-300">Photo</span>

        {preview ? (
          <div className="relative w-full rounded-2xl overflow-hidden aspect-square">
            <Image src={preview} alt="preview" fill className="object-cover" />
            <div className="absolute inset-0 flex items-end justify-center gap-2 pb-4 bg-gradient-to-t from-black/60 to-transparent">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
              >
                <IoImagesOutline className="size-4" />
                Change Image
              </button>
              <button
                onClick={handleRemoveImage}
                className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
              >
                <IoCloseCircle className="size-4" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center gap-3 w-full rounded-2xl border border-neutral-900 bg-neutral-950 py-14 cursor-pointer hover:border-purple-500 hover:bg-neutral-800 transition-colors"
          >
            <IoCloudUploadOutline className="size-10 text-neutral-500" />
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                <span className="text-primary-300">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-neutral-500 mt-1">PNG, JPG, JPEG (max 10MB)</p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Caption */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-neutral-300">Caption</span>
          <span className="text-xs text-neutral-500">{caption.length}/500</span>
        </div>

        <div className="relative">
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 500))}
            placeholder="Create your caption..."
            rows={4}
            className="rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0 resize-none pr-10"
          />

          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className="absolute top-3 right-3 text-neutral-400 hover:text-white transition-colors"
          >
            <IoHappyOutline className="size-5" />
          </button>

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="absolute bottom-14 top-14 right-0 z-50">
              <EmojiPicker
                theme={"dark" as any}
                onEmojiClick={(emojiData) => {
                  setCaption((prev) => (prev + emojiData.emoji).slice(0, 500));
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 font-semibold">{error}</p>
      )}

      {/* Share Button */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading || !image}
        className="h-12 rounded-full bg-primary-300 hover:bg-purple-700 font-bold text-white disabled:opacity-50"
      >
        {isLoading ? "Sharing..." : "Share"}
      </Button>
    </div>
  );
}