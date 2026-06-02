#!/usr/bin/env bash
set -euo pipefail

: "${POSTGRES_URI:?POSTGRES_URI not set}"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql client not found on PATH." >&2
  echo "Install a Postgres client before running migrations:" >&2
  echo "  brew install libpq" >&2
  echo '  export PATH="/opt/homebrew/opt/libpq/bin:$PATH"' >&2
  echo "Or install postgresql@16 and add its bin directory to PATH." >&2
  exit 1
fi

for f in db/migrations/*.sql; do
  echo "Applying $f"
  psql "${POSTGRES_URI}" -v ON_ERROR_STOP=1 -f "$f"
done
