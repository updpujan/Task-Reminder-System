export type CreateTaskInput = {
  user_id: number;
  role: string;

  task_name: string;
  task_description?: string;

  status: 'enabled' | 'disabled';
  is_deleted: boolean;

  reminder_date?: string;
  reminder_time: string;
  timezone: string;
  repeat: 'off' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  is_active: boolean;
};
