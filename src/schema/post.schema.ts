import { z } from 'zod';

// Constants

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_CAPTION_SIZE = 2200;

// Schema

// Zod schema for create post form validation
export const createPostSchema = z.object({
  // Optional post caption, max 2200 characters
  caption: z
    .string()
    .max(
      MAX_CAPTION_SIZE,
      `Caption must be under ${MAX_CAPTION_SIZE} characters`,
    )
    .optional(),

  // Required image file — max 5MB, JPG/PNG/WEBP only.
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((f) => f.size <= MAX_FILE_SIZE, 'Image must be under 5MB')
    .refine(
      (f) => (ALLOWED_TYPES as readonly string[]).includes(f.type),
      'Only JPG, PNG, or WEBP allowed',
    ),
});

/** Inferred type for create post form data. */
export type CreatePostFormData = z.infer<typeof createPostSchema>;
