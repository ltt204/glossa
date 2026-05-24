# ================================================================
#  Stage 1 – base: shared Go toolchain setup
# ================================================================
FROM golang:1.26 AS base

WORKDIR /app

# Download dependencies first so Docker can cache this layer.
# The source code changes often; go.mod/go.sum change rarely.
COPY go.mod go.sum ./
RUN go mod download

# ================================================================
#  Stage 2 – dev: hot-reload with Air
#  docker compose up  →  uses this stage
# ================================================================
FROM base AS dev

# Install Air (the hot-reload tool you already use locally)
RUN go install github.com/air-verse/air@latest

# Source code is NOT copied here — it is mounted as a volume
# so Air can watch real files and rebuild on every save.
EXPOSE 8000
CMD ["air", "-c", ".air.toml"]

# ================================================================
#  Stage 3 – builder: compile a static production binary
# ================================================================
FROM base AS builder

COPY . .

# CGO_ENABLED=0   → no C deps, fully static binary
# -ldflags "-s -w" → strip debug info, smaller binary
RUN CGO_ENABLED=0 GOOS=linux \
    go build -ldflags="-s -w" -o /app/server ./cmd/api/main.go

# ================================================================
#  Stage 4 – prod: minimal final image (no Go toolchain)
#  docker build --target prod -t glossa-backend .
# ================================================================
FROM gcr.io/distroless/static-debian12 AS prod

WORKDIR /app

# Copy only the compiled binary from the builder stage
COPY --from=builder /app/server .

EXPOSE 8000
ENTRYPOINT ["/app/server"]
