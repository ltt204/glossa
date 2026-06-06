-- +goose Up
SELECT 'up SQL query';

CREATE TABLE IF NOT EXISTS refresh_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- +goose Down
SELECT 'down SQL query';

DROP TABLE IF EXISTS refresh_token;