import { z } from 'zod';

/**
 * Schema for login form validation.
 * Validates email format and required password field.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for register form validation.
 * Includes field constraints and password confirmation check.
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30)
      .regex(
        /^[a-z0-9_]+$/,
        'Only lowercase letters, numbers, and underscores',
      ),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Password and confirm password must match',
    path: ['confirmPassword'],
  });

/**
 * Inferred type for login form data.
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Inferred type for register form data.
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
