ifneq (,$(wildcard .env))
include .env
export
endif

setup:
	go mod tidy

verify:
	go mod verify

## Start everything in Docker with hot reload (Air watches for changes)
run:
	docker compose -f ../docker-compose.yml up --build

## Run the backend locally (without Docker) — useful for quick iteration
run-local:
	go build -o tmp/main ./cmd/api/main.go
	air

## Build the production Docker image
build-prod:
	docker build --target prod -t glossa-backend:latest .

# FOR MIGRATION
migrate-up:                                                                                                                                                                                                                                                                                                                 
	@if [ -z "$(CONNECTION_STRING)" ]; then echo "CONNECTION_STRING is not set (define it in .env or environment)"; exit 1; fi
	goose -dir ./internal/db/migrations postgres "$(CONNECTION_STRING)" up                                                                                                                                                                                                                                                     
																																																																															
migrate-down:                                                                                                                                                                                                                                                                                                               
	@if [ -z "$(CONNECTION_STRING)" ]; then echo "CONNECTION_STRING is not set (define it in .env or environment)"; exit 1; fi
	goose -dir ./internal/db/migrations postgres "$(CONNECTION_STRING)" down
																																																																															
migrate-status: 
	@if [ -z "$(CONNECTION_STRING)" ]; then echo "CONNECTION_STRING is not set (define it in .env or environment)"; exit 1; fi
	goose -dir ./internal/db/migrations postgres "$(CONNECTION_STRING)" status                                                                                                                                                                                                                                                 

migrate-create:
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "Usage: make migrate-create <migration_name>"; \
		exit 1; \
	fi
	goose -dir ./internal/db/migrations create "$(filter-out $@,$(MAKECMDGOALS))" sql

%:
	@: