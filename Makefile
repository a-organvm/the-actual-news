export PLATFORM_ID ?= $(PLATFORM_ID)
export POSTGRES_URI ?= $(POSTGRES_URI)

.PHONY: up up-public up-internal down down-public down-internal migrate reset lint test dev dev-minimal

up:
	docker compose -f infra/docker-compose.yml up -d

up-public:
	docker compose --env-file .env.public.example -f infra/docker-compose.public.yml up --build -d

up-internal:
	docker compose --env-file .env.internal.example -f infra/docker-compose.internal.yml up --build -d

down:
	docker compose -f infra/docker-compose.yml down -v

down-public:
	docker compose --env-file .env.public.example -f infra/docker-compose.public.yml down

down-internal:
	docker compose --env-file .env.internal.example -f infra/docker-compose.internal.yml down -v

migrate:
	POSTGRES_URI="$(POSTGRES_URI)" bash tools/migrate.sh

reset: down up migrate

lint:
	npx @redocly/cli lint

test:
	node tools/conformance/run.mjs

dev:
	pnpm -r --parallel dev

dev-minimal:
	cd services/gateway && pnpm dev
