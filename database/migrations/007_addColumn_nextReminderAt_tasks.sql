-- migrate:up

ALTER TABLE tasks
ADD COLUMN next_reminder_at TIMESTAMPTZ;


-- migrate:down

ALTER TABLE tasks
DROP COLUMN IF EXISTS next_reminder_at;