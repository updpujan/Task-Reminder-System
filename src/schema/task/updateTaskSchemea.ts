import { z } from 'zod';

export const updateTaskSchema = z
  .object({
    task_name: z
      .string()
      .trim()
      .min(1, 'Task name is required')
      .max(100, 'Task name must not exceed 100 characters')
      .optional(),

    task_description: z.string().trim().nullable().optional(),

    status: z
      .enum(['enabled', 'disabled'], {
        message: 'Status must be either enabled or disabled',
      })
      .optional(),

    reminder_date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Reminder date must be in YYYY-MM-DD format',
      )
      .nullable()
      .optional(),

    reminder_time: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
        'Reminder time must be in HH:MM or HH:MM:SS format',
      )
      .nullable()
      .optional(),

    timezone: z
      .string()
      .trim()
      .min(1, 'Timezone is required')
      .max(100, 'Timezone must not exceed 100 characters')
      .optional(),

    repeat: z
      .enum(
        [
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
        ],
        {
          message: 'Invalid repeat value',
        },
      )
      .optional(),

    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
  });

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
