import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .regex(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      'Name can contain only alphabets and single spaces between names',
    ),

  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must not exceed 20 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),

  role: z.enum(['user', 'admin'], {
    message: 'Role must be either user or admin',
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
