import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFollowButtonClass(
  isFollowing: boolean,
) {
  return isFollowing
    ? 'border border-primary-400/20 bg-primary-400/15 text-primary-400'
    : 'border border-white/10 bg-white/5 text-white';
}