import { z } from 'zod';

export const createTaskSchema = z.object({
  task_name: z
    .string()
    .trim()
    .min(1, 'Task name is required')
    .max(100, 'Task name must not exceed 100 characters'),

  task_description: z.string().trim().optional(),

  reminder_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Reminder date must be in YYYY-MM-DD format')
    .optional(),

  reminder_time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
      'Reminder time must be in HH:MM or HH:MM:SS format',
    ),

  timezone: z
    .string()
    .trim()
    .min(1, 'Timezone is required')
    .max(100, 'Timezone must not exceed 100 characters')
    .default('UTC'),

  repeat: z
    .enum([
      'off',
      'minute',
      'hour',
      'day',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'month',
      'year',
    ])
    .default('off'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
