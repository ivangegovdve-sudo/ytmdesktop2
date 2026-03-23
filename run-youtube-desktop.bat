@echo off
echo ==============================================
echo YouTube Music Desktop App - Local Testing
echo ==============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [Error] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [Info] pnpm is not installed. Installing it globally via npm...
    npm install -g pnpm
)

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo [Info] node_modules not found. Installing dependencies...
    pnpm install
) else (
    echo [Info] Dependencies found. Proceeding...
)

echo.
echo ==============================================
echo Starting the application...
echo You can use the app and close this window when done.
echo ==============================================
echo.

pnpm run dev
