package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(connectionString string) (*pgxpool.Pool, error) {
	ctx := context.Background()

	config, err := pgxpool.ParseConfig(connectionString)
	if err != nil {
		log.Printf("Invalid Connection String: %v", err)
		return nil, err
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Printf("Failed to create connection pool, please check your config: %v", err)
		return nil, err
	}

	err = pool.Ping(ctx)
	if err != nil {
		log.Printf("Cannot Ping to database: %v", err)
		pool.Close()
		return nil, err
	}

	return pool, nil
}
