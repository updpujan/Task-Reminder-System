import { DateTime } from 'luxon';

export type RepeatType =
  | 'off'
  | 'minute'
  | 'hour'
  | 'day'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'month'
  | 'year';

interface ReminderInput {
  reminderDate?: string | undefined;
  reminderTime: string;
  timezone: string;
  repeat: RepeatType;
}

export const calculateInitialReminder = ({
  reminderDate,
  reminderTime,
  timezone,
  repeat,
}: ReminderInput): Date => {
  let localDateTime: DateTime;

  if (reminderDate) {
    localDateTime = DateTime.fromISO(`${reminderDate}T${reminderTime}`, {
      zone: timezone,
    });
  } else {
    const now = DateTime.now().setZone(timezone);

    localDateTime = DateTime.fromISO(`${now.toISODate()}T${reminderTime}`, {
      zone: timezone,
    });

    if (localDateTime <= now) {
      localDateTime = calculateNextOccurrence(localDateTime, repeat, timezone);
    }
  }

  if (!localDateTime.isValid) {
    throw new Error(
      `Invalid reminder date, time, or timezone: ${localDateTime.invalidReason}`,
    );
  }

  return localDateTime.toUTC().toJSDate();
};

export const calculateNextOccurrence = (
  current: DateTime,
  repeat: RepeatType,
  timezone: string,
): DateTime => {
  const currentLocal = current.setZone(timezone);

  switch (repeat) {
    case 'off':
      return currentLocal;

    case 'minute':
      return currentLocal.plus({ minutes: 1 });

    case 'hour':
      return currentLocal.plus({ hours: 1 });

    case 'day':
      return currentLocal.plus({ days: 1 });

    case 'sunday':
      return getNextWeekday(currentLocal, 7);

    case 'monday':
      return getNextWeekday(currentLocal, 1);

    case 'tuesday':
      return getNextWeekday(currentLocal, 2);

    case 'wednesday':
      return getNextWeekday(currentLocal, 3);

    case 'thursday':
      return getNextWeekday(currentLocal, 4);

    case 'friday':
      return getNextWeekday(currentLocal, 5);

    case 'saturday':
      return getNextWeekday(currentLocal, 6);

    case 'month':
      return currentLocal.plus({ months: 1 });

    case 'year':
      return currentLocal.plus({ years: 1 });
  }
};

const getNextWeekday = (current: DateTime, targetWeekday: number): DateTime => {
  let daysUntil = targetWeekday - current.weekday;

  if (daysUntil <= 0) {
    daysUntil += 7;
  }

  return current.plus({ days: daysUntil });
};
