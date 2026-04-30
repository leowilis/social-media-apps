import { z } from 'zod';

// Schema

// Zod schema for edit profile form validation
export const profileSchema = z.object({
  // Display name, min 2 characters.
  name: z.string().min(2, 'Name must be at least 2 characters'),

  // Unique username, 3-30 characters, alphanumeric and underscores only
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be under 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),

  // Optional phone number
  phone: z.string().optional(),

  // Optional bio, max 200 characters
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
});

// Inferred type for edit profile form data
export type ProfileFormData = z.infer<typeof profileSchema>;
