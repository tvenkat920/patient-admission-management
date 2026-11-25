@echo off
echo =========================================================
echo Starting MediCare Patient Admission Management System...
echo =========================================================

echo Starting Python FastAPI Backend on port 8000...
start "MediCare Backend (FastAPI)" cmd /k "cd backend && set PYTHONPATH=. && venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo Starting React Vite Frontend on port 5173...
start "MediCare Frontend (React)" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo Opening application in default browser...
start http://localhost:5173

echo =========================================================
echo Backend API Docs: http://127.0.0.1:8000/api/docs
echo Frontend App:    http://localhost:5173
echo =========================================================
