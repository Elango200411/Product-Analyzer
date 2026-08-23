# Starts ONLY the frontend dev server on http://localhost:5173
# (works even if the backend is not running — analysis needs the backend,
#  everything else works offline)

$frontend = Split-Path -Parent $MyInvocation.MyCommand.Path

# Free port 5173 if a stale server is holding it
Get-NetTCPConnection -State Listen -LocalPort 5173 -ErrorAction SilentlyContinue |
  ForEach-Object { try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {} }
Start-Sleep -Seconds 1

Write-Host "Starting frontend on http://localhost:5173 ..." -ForegroundColor Cyan
npm run dev
