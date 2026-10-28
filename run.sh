#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

if command -v temporal >/dev/null 2>&1; then
  TEMPORAL_BIN="temporal"
elif [ -x "$HOME/.temporalio/bin/temporal" ]; then
  TEMPORAL_BIN="$HOME/.temporalio/bin/temporal"
else
  echo "Temporal CLI not found. Start Temporal server manually on localhost:7233."
  TEMPORAL_BIN=""
fi

if [ -n "$TEMPORAL_BIN" ]; then
  echo "Starting Temporal dev server..."
  "$TEMPORAL_BIN" server start-dev --db-filename "$ROOT_DIR/.temporal.db" > "$ROOT_DIR/temporal.log" 2>&1 &
  TEMPORAL_PID=$!
  sleep 5
  echo "Temporal UI: http://localhost:8233"
else
  echo "Temporal CLI not found. Start Temporal server manually on localhost:7233."
fi

echo "Starting AeroSaga backend..."
(
  cd "$ROOT_DIR/aerosaga-backend" || exit 1
  ./mvnw spring-boot:run -Dmaven.test.skip=true
) &
BACKEND_PID=$!

echo "Starting AeroSaga frontend..."
(
  cd "$ROOT_DIR/aerosaga-frontend" || exit 1
  npm run dev
) &
FRONTEND_PID=$!

echo "Backend URL:  http://localhost:8080"
echo "Frontend URL: http://localhost:5173"
echo "Press Ctrl+C to stop all services."

cleanup() {
  kill $BACKEND_PID $FRONTEND_PID ${TEMPORAL_PID:-} 2>/dev/null
}
trap cleanup INT TERM

wait $BACKEND_PID $FRONTEND_PID
