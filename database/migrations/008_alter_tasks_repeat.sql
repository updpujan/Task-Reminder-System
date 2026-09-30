-- migrate:up

ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_repeat_check;

ALTER TABLE tasks
ADD CONSTRAINT tasks_repeat_check
CHECK (
    repeat IN (
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
        'year'
    )
);


-- migrate:down

ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_repeat_check;

ALTER TABLE tasks
ADD CONSTRAINT tasks_repeat_check
CHECK (
    repeat IN (
        'off',
        'minute',
        'hour',
        'day',
        'week',
        'month',
        'year'
    )
);
