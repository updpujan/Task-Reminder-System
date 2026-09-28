-- migrate:up

CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
            password VARCHAR(100) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now());

-- migrate:down
DROP TABLE users