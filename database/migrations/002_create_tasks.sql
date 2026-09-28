-- migrate:up

CREATE TABLE IF NOT EXISTS tasks(
            task_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            task_name VARCHAR(100) NOT NULL,
            task_description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            status VARCHAR(10) NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled','disabled')),
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE );

-- migrate:down
DROP TABLE tasks