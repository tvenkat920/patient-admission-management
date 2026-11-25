# PowerShell Runner for Patient Admission Management System
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Starting MediCare Patient Admission Management System..." -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# Start Backend
Write-Host "Starting Python FastAPI Backend on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; `$env:PYTHONPATH='.'; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting React Vite Frontend on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Start-Sleep -Seconds 2

# Open in Browser
Write-Host "Opening application in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Application is live at: http://localhost:5173" -ForegroundColor Green
Write-Host "API Documentation at:  http://127.0.0.1:8000/api/docs" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan
