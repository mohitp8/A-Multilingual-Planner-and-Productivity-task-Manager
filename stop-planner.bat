@echo off
setlocal
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":3000 .*LISTENING"') do (
  echo Stopping process %%p using port 3000...
  taskkill /PID %%p /F >nul 2>&1
)
echo Hitmo Planner stopped.
pause
