#!/usr/bin/env bash
set -euo pipefail

# Usage: ./pizza_test.sh <github_account> <config_js_path>
# Optional env vars:
#   GH_HOST - GitHub host (default: github.com)

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <github_account> <config_js_path>" >&2
  exit 1
fi

ACCOUNT_ID="$1"
CONFIG_PATH="$2"
BASE_DIR="test-${ACCOUNT_ID}"
BASE_DIR_ABS="$(pwd)/${BASE_DIR}"
REPOS=("jwt-pizza" "jwt-pizza-service")
GH_HOST="${GH_HOST:-github.com}"
API_BASE="https://api.${GH_HOST}"
if [[ "${GH_HOST}" == "github.com" ]]; then
  API_BASE="https://api.github.com"
fi

mkdir -p "$BASE_DIR"
cd "$BASE_DIR"

for repo in "${REPOS[@]}"; do
  if [[ -d "$repo/.git" ]]; then
    echo "Repo $repo already exists. Skipping clone."
  else
    if command -v curl >/dev/null 2>&1; then
      status=$(curl -fsSL -o /dev/null -w "%{http_code}" \
        "${API_BASE}/repos/${ACCOUNT_ID}/${repo}" || true)
      if [[ "${status}" != "200" ]]; then
        echo "Repo ${ACCOUNT_ID}/${repo} not found or inaccessible (HTTP ${status}). Skipping clone."
        continue
      fi
    fi
    git clone "https://${GH_HOST}/${ACCOUNT_ID}/${repo}.git"
  fi

done

# Ensure jwt-pizza-service config symlink exists (after clone)
if [[ ! -e "$CONFIG_PATH" ]]; then
  echo "Config file not found: $CONFIG_PATH" >&2
  exit 1
fi
if [[ -d "jwt-pizza-service" ]]; then
  mkdir -p "jwt-pizza-service/src"
  ln -sf "$CONFIG_PATH" "jwt-pizza-service/src/config.js"
else
  echo "jwt-pizza-service directory not found; cannot create config symlink." >&2
  exit 1
fi

for repo in "${REPOS[@]}"; do
  echo "Installing deps in $repo..."
  (cd "$repo" && npm install)

done

# Start apps in background
cleanup() {
  echo -e "\n\n***************\nEverything is running. You can check logs in $BASE_DIR/*.log"
  read -r -p "Do you want to stop the services? [y/N] " answer
  if [[ "$answer" =~ ^[Yy]$ ]]; then
    kill_tree() {
      local pid="$1"
      local child
      for child in $(ps -o pid= --ppid "$pid" 2>/dev/null); do
        kill_tree "$child"
      done
      kill "$pid" >/dev/null 2>&1 || true
    }
    if [[ -n "${PIZZA_PID:-}" ]]; then
      kill_tree "$PIZZA_PID"
    fi
    if [[ -n "${SERVICE_PID:-}" ]]; then
      kill_tree "$SERVICE_PID"
    fi

    read -r -p "Do you want to delete the test directory? [y/N] " answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
      echo "Cleaning up test directory..."
      cd ..
      rm -rf "$BASE_DIR_ABS"
    fi
  fi
}
trap cleanup EXIT INT TERM

echo "Starting jwt-pizza (npm run dev)..."
bash -c 'cd jwt-pizza && exec npm run dev' >"pizza.log" 2>&1 &
PIZZA_PID=$!

echo "Starting jwt-pizza-service (npm run start)..."
bash -c 'cd jwt-pizza-service && exec npm run start' >"pizza-service.log" 2>&1 &
SERVICE_PID=$!

cat <<INFO
Apps started.
- jwt-pizza PID: $PIZZA_PID (logs: $BASE_DIR/pizza.log)
- jwt-pizza-service PID: $SERVICE_PID (logs: $BASE_DIR/pizza-service.log)
INFO

# Basic health check for pizza-service
if command -v curl >/dev/null 2>&1; then
  echo "Waiting for pizza-service to start..."
  ok=0
  for i in $(seq 1 30); do
    if curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
      echo "pizza-service is responding on http://localhost:3000"
      ok=1
      break
    fi
    sleep 1
  done
  if [[ "$ok" -ne 1 ]]; then
    echo "pizza-service did not start within 30 seconds. Check logs: $BASE_DIR/pizza-service.log" >&2
    exit 1
  fi
else
  echo "curl not found; cannot verify http://localhost:3000" >&2
  exit 1
fi
