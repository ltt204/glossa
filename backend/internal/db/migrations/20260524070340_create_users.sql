-- +goose Up
SELECT 'up SQL query';

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- +goose Down
SELECT 'down SQL query';

DROP TABLE IF EXISTS users;