#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-}"
PATHNAME="${2:-/}"

if [[ -z "$PORT" ]]; then
  echo "Usage: $0 <port> [path]" >&2
  exit 2
fi

URL="http://127.0.0.1:${PORT}${PATHNAME}"
echo "Checking ${URL} ..."
if curl -fsS -I "$URL" >/dev/null; then
  echo "OK: ${URL} is reachable"
  exit 0
else
  echo "FAIL: ${URL} is not reachable" >&2
  exit 1
fi

