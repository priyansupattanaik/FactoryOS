@echo off
echo ========================================================
echo Starting FactoryOS Dashboard Setup...
echo ========================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install it from https://nodejs.org/
    echo Press any key to exit...
    pause >nul
    exit /b
)

echo [1/2] Installing required packages (this may take a minute)...
call npm install

echo.
echo [2/2] Starting the web server...
echo.
echo ========================================================
echo The dashboard will be available at: http://localhost:5173
echo (Restarts cleanly if a previous instance is still running.)
echo Please open your browser (Chrome/Edge) and go to that link.
echo Keep this window open while you are viewing the dashboard.
echo ========================================================
echo.

call npm run dev:restart
pause
