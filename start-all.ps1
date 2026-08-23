# Starts backend (port 8000) + frontend dev server (port 5173) in separate windows.
# Skips anything already running, then opens the browser.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Test-Port($port) {
  [bool](Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue)
}

if (-not (Test-Port 8000)) {
  Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$root\backend'; python -m uvicorn api.main:app --reload"
} else {
  Write-Host "Backend already running on :8000" -ForegroundColor Yellow
}

if (-not (Test-Port 5173)) {
  Start-Sleep -Seconds 1
  Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$root\frontend'; npm run dev"
} else {
  Write-Host "Frontend already running on :5173" -ForegroundColor Yellow
}

# Give vite time to boot (slower under OneDrive), then open the browser
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Seconds 2
  if ((Test-Port 5173) -and (Test-Port 8000)) { break }
}

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Backend:  http://localhost:8000/docs" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
