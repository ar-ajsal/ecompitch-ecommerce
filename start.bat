@echo off
echo =========================================
echo ecompitch Complete E-Commerce Platform
echo =========================================
echo Starting Backend API (Port 5000)...
start cmd /k "title Backend && cd backend && npm run dev"

echo Starting Admin Dashboard (Port 3001)...
start cmd /k "title Admin Dashboard && cd frontend\admin && pnpm run dev"

echo Starting Storefront (Port 3000)...
start cmd /k "title Storefront && cd frontend\store && pnpm run dev"

echo =========================================
echo All servers are booting up!
echo - Storefront: http://localhost:3000
echo - Admin Dashboard: http://localhost:3001
echo - Backend API: http://localhost:5000
echo =========================================
pause
