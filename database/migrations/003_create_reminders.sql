-- migrate:up

CREATE TABLE IF NOT EXISTS reminders (
            reminder_id SERIAL PRIMARY KEY,
            task_id INTEGER NOT NULL REFERENCES tasks(task_id),
            reminder_date DATE,
            reminder_time TIME NOT NULL,
            timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
            repeat VARCHAR(20) NOT NULL DEFAULT 'off'
                CHECK (repeat IN (
                    'off',
                    'minute',
                    'hour',
                    'day',
                    'week',
                    'month',
                    'year'
                )),
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
        
-- migrate:down
DROP TABLE reminders