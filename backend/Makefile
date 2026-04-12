ifneq (,$(wildcard .env))
include .env
export
endif

setup:
	go mod tidy

verify:
	go mod verify

run:
	docker compose up -d 
	go build -o tmp/main cmd/api/main.go
	air

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