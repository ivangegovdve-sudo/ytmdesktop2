#!/bin/bash

echo "=============================================="
echo "YouTube Music Desktop App - Local Testing"
echo "=============================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "[Error] Node.js could not be found."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null
then
    echo "[Info] pnpm is not installed. Installing it globally via npm..."
    npm install -g pnpm
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "[Info] node_modules not found. Installing dependencies..."
    pnpm install
else
    echo "[Info] Dependencies found. Proceeding..."
fi

echo ""
echo "=============================================="
echo "Starting the application..."
echo "You can use the app and close this window when done."
echo "=============================================="
echo ""

pnpm run dev
