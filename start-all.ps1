# Starts backend (port 8000) + frontend dev server (port 5173).
# Usage:
#   .\start-all.ps1          -> dev mode  (hot reload)
#   .\start-all.ps1 preview  -> production build served via vite preview on :4173
#
# Skips anything already running, cleans up stale node/python servers on those
# ports, then opens the browser.

param(
  [switch]$Preview
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Test-Port($port) {
  [bool](Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue)
}

function Stop-Port($port) {
  $conns = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
  foreach ($c in $conns) {
    try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
  }
}

$fePort = 5173
if ($Preview) { $fePort = 4173 }

if (-not (Test-Port 8000)) {
  Start-Process powershell -ArgumentList '-NoExit', '-Command', `
    "Set-Location '$root\backend'; python -m uvicorn api.main:app --reload"
} else {
  Write-Host "Backend already running on :8000" -ForegroundColor Yellow
}

if (-not (Test-Port $fePort)) {
  if ($Preview) {
    Write-Host "Building frontend..." -ForegroundColor Cyan
    Push-Location "$root\frontend"
    npm run build
    Pop-Location
    Start-Sleep -Seconds 1
    Start-Process powershell -ArgumentList '-NoExit', '-Command', `
      "Set-Location '$root\frontend'; npm run preview"
  } else {
    Start-Process powershell -ArgumentList '-NoExit', '-Command', `
      "Set-Location '$root\frontend'; npm run dev"
  }
} else {
  Write-Host "Frontend already running on :$fePort" -ForegroundColor Yellow
}

# Give vite time to boot (slower under OneDrive), then open the browser
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 2
  if ((Test-Port $fePort) -and (Test-Port 8000)) { break }
}

Start-Process "http://localhost:$fePort"

Write-Host ""
Write-Host "Backend:  http://localhost:8000/docs" -ForegroundColor Green
if ($Preview) {
  Write-Host "Frontend: http://localhost:4173 (production preview)" -ForegroundColor Green
} else {
  Write-Host "Frontend: http://localhost:5173 (dev)" -ForegroundColor Green
}
