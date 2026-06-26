@echo off
cd /d "%~dp0"
if not exist node_modules (
  npm install
)
start "ControlPro Dev" cmd /k npm run dev
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:5173"
