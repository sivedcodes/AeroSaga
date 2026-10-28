@echo off
set "ROOT_DIR=%~dp0"

where temporal >nul 2>&1
if %errorlevel%==0 (
  echo Starting Temporal dev server...
  start "Temporal Server" cmd /k "temporal server start-dev --db-filename %ROOT_DIR%.temporal.db"
  timeout /t 5 /nobreak >nul
  echo Temporal UI: http://localhost:8233
) else (
  echo Temporal CLI not found. Start Temporal server manually on localhost:7233.
)

echo Starting AeroSaga backend...
start "AeroSaga Backend" cmd /k "cd /d %ROOT_DIR%aerosaga-backend && mvnw.cmd spring-boot:run -Dmaven.test.skip=true"

echo Starting AeroSaga frontend...
start "AeroSaga Frontend" cmd /k "cd /d %ROOT_DIR%aerosaga-frontend && npm run dev"

echo Backend URL:  http://localhost:8080
echo Frontend URL: http://localhost:5173
pause
