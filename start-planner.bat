@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo ========================================
echo       Hitmo Planner - Startup
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install Node.js 22 or newer from https://nodejs.org/
  pause
  exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node -p "process.versions.node"') do set NODE_MAJOR=%%a
if !NODE_MAJOR! LSS 22 (
  echo [ERROR] Node.js 22 or newer is required. Current version:
  node -v
  pause
  exit /b 1
)

echo Checking the existing server on port 3000...
curl.exe -s -f --max-time 2 http://127.0.0.1:3000/api/v1/health > "%TEMP%\hitmo_health.txt" 2>nul
if not errorlevel 1 (
  echo [OK] Hitmo Planner is already running on port 3000.
  start "" http://localhost:3000/
  del "%TEMP%\hitmo_health.txt" >nul 2>&1
  exit /b 0
)
del "%TEMP%\hitmo_health.txt" >nul 2>&1

echo Checking whether another program is using port 3000...
set "PID="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":3000 .*LISTENING"') do set "PID=%%p"
if defined PID (
  echo [INFO] Port 3000 is occupied by PID !PID!.
  echo [INFO] Stopping that process so Hitmo Planner can start cleanly...
  taskkill /PID !PID! /F >nul 2>&1
  timeout /t 1 /nobreak >nul
)

echo Starting Hitmo Planner server...
start "Hitmo Planner Server" /min cmd /c "node server.js"

echo Waiting for the server to become ready...
set "READY=0"
for /l %%i in (1,1,20) do (
  timeout /t 1 /nobreak >nul
  curl.exe -s -f --max-time 2 http://127.0.0.1:3000/api/v1/health > "%TEMP%\hitmo_health.txt" 2>nul
  if not errorlevel 1 (
    set "READY=1"
    goto :ready
  )
)

:ready
if "!READY!"=="1" (
  del "%TEMP%\hitmo_health.txt" >nul 2>&1
  echo.
  echo ========================================
  echo Hitmo Planner is running successfully.
  echo http://localhost:3000/
  echo ========================================
  start "" http://localhost:3000/
  exit /b 0
)

del "%TEMP%\hitmo_health.txt" >nul 2>&1
echo.
echo [ERROR] The server did not become ready within 20 seconds.
echo Check the server window for the actual error.
pause
exit /b 1
