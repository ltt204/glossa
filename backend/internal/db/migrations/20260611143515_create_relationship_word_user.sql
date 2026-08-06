-- +goose Up
SELECT 'up SQL query';

ALTER TABLE words
ADD COLUMN is_saved BOOLEAN DEFAULT FALSE;


-- +goose Down
SELECT 'down SQL query';
ALTER TABLE words
DROP COLUMN user_id;
DROP COLUMN is_saved;