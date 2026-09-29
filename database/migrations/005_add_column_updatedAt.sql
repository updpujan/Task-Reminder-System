-- migrate:up

ALTER TABLE users
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE tasks
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- migrate:down

DROP TRIGGER IF EXISTS users_updated_at ON users;
DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;

DROP FUNCTION IF EXISTS update_updated_at_column();

ALTER TABLE users
DROP COLUMN IF EXISTS updated_at;

ALTER TABLE tasks
DROP COLUMN IF EXISTS updated_at;