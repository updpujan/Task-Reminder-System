-- migrate:up

ALTER TABLE tasks
DROP COLUMN is_deleted;


-- migrate:down

ALTER TABLE tasks
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;