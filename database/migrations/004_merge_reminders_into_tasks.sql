-- migrate:up

ALTER TABLE tasks
ADD COLUMN reminder_date DATE,
ADD COLUMN reminder_time TIME,
ADD COLUMN timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
ADD COLUMN repeat VARCHAR(20) NOT NULL DEFAULT 'off',
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

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

UPDATE tasks t
SET
    reminder_date = r.reminder_date,
    reminder_time = r.reminder_time,
    timezone = r.timezone,
    repeat = r.repeat,
    is_active = r.is_active
FROM reminders r
WHERE t.task_id = r.task_id;

DROP TABLE reminders;


-- migrate:down

CREATE TABLE reminders (
    reminder_id SERIAL PRIMARY KEY,

    task_id INTEGER NOT NULL REFERENCES tasks(task_id),

    reminder_date DATE,

    reminder_time TIME NOT NULL,

    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',

    repeat VARCHAR(20) NOT NULL DEFAULT 'off'
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
        ),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO reminders (
    task_id,
    reminder_date,
    reminder_time,
    timezone,
    repeat,
    is_active
)
SELECT
    task_id,
    reminder_date,
    reminder_time,
    timezone,
    repeat,
    is_active
FROM tasks
WHERE reminder_time IS NOT NULL;

ALTER TABLE tasks
DROP CONSTRAINT tasks_repeat_check;

ALTER TABLE tasks
DROP COLUMN reminder_date,
DROP COLUMN reminder_time,
DROP COLUMN timezone,
DROP COLUMN repeat,
DROP COLUMN is_active;