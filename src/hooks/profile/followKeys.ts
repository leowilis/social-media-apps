export const followKeys = {
  profile: (username: string) => ['profile', username] as const,
} as const;
