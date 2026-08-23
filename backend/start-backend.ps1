# Starts ONLY the backend API on http://localhost:8000
# Docs: http://localhost:8000/docs

$backend = Split-Path -Parent $MyInvocation.MyCommand.Path

# Free port 8000 if a stale server is holding it
Get-NetTCPConnection -State Listen -LocalPort 8000 -ErrorAction SilentlyContinue |
  ForEach-Object { try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {} }
Start-Sleep -Seconds 1

Write-Host "Starting backend on http://localhost:8000 ..." -ForegroundColor Cyan
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
