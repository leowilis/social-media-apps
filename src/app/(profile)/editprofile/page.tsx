"use client";

import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { useEditProfile } from "./hooks/useEditProfile";

export default function EditProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    form,
    avatarPreview,
    isLoading,
    isSaving,
    success,
    error,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  } = useEditProfile();

  const avatarSrc = avatarPreview ?? form.avatarUrl ?? "";
  const avatarFallback = form.name?.[0]?.toUpperCase() ?? "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4 py-6">

      {/* Success Toast */}
      {success && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          <IoCheckmarkCircle className="size-5" />
          Profile Successfully Updated
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          <IoCloseCircle className="size-5" />
          {error}
        </div>
      )}

      {/* Avatar */}
      <div className="flex flex-col items-center gap-5 mb-6">
        <Avatar className="size-20 border border-[rgba(126,145,183,0.32)]">
          <AvatarImage src={avatarSrc} alt={form.name} />
          <AvatarFallback className="text-2xl font-bold bg-neutral-800">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="border border-neutral-900 rounded-full px-7 py-2">
            <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-semibold text-neutral-25 hover:text-primary-300 transition-colors"
        >
          Change Photo
        </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm font-bold text-neutral-50">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            className="h-13 rounded-xl font-semibold border border-neutral-900 bg-neutral-950 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="username" className="text-sm font-bold text-neutral-50">Username</Label>
          <Input
            id="username"
            value={form.username}
            onChange={handleChange}
            className="h-13 rounded-xl font-semibold border border-neutral-900 bg-neutral-950 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-sm font-bold text-neutral-50">Email</Label>
          <Input
            id="email"
            value={form.email}
            onChange={handleChange}
            disabled
            className="h-13 rounded-xl font-semibold border border-neutral-900 bg-neutral-950 text-neutral-500 focus-visible:ring-0 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="phone" className="text-sm font-bold text-neutral-50">Number Phone</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={handleChange}
            className="h-13 rounded-xl font-semibold border border-neutral-900 bg-neutral-950 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="bio" className="text-sm font-bold text-neutral-50">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            placeholder="Tell something about yourself..."
            className="h-30 rounded-xl border border-neutral-900 bg-neutral-950 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0 resize-none"
          />
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={isSaving}
          className="h-13 rounded-full bg-purple-600 hover:bg-purple-700 font-bold text-white disabled:opacity-60 mt-2"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}