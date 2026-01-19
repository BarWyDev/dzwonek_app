# Deploy używając PuTTY plink (zapisuje hasło w sesji)
# Download PuTTY: https://www.putty.org/

# KONFIGURACJA - VPS: florian114
$SERVER_USER = "root"
$SERVER_HOST = "florian114.mikrus.xyz"
$SERVER_PORT = "10114"
$SERVER_PATH = "/var/www/dzwonek-app"
$SESSION_NAME = "mikrus-florian"

Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Sprawdź czy plink/pscp są dostępne
$plinkPath = "plink.exe"
$pscpPath = "pscp.exe"

try {
    Get-Command $plinkPath -ErrorAction Stop | Out-Null
    Get-Command $pscpPath -ErrorAction Stop | Out-Null
} catch {
    Write-Host "❌ PuTTY tools not found!" -ForegroundColor Red
    Write-Host "Download from: https://www.putty.org/" -ForegroundColor Yellow
    Write-Host "Dodaj katalog PuTTY do PATH lub zainstaluj przez: winget install PuTTY.PuTTY" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Deploying to mikr.us..." -ForegroundColor Cyan

# Upload plików (pscp automatycznie użyje zapisanej sesji)
& $pscpPath -P $SERVER_PORT -r dist\* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Upload failed!" -ForegroundColor Red
    Write-Host "" -ForegroundColor Yellow
    Write-Host "PIERWSZE UŻYCIE: Zapisz hasło w PuTTY:" -ForegroundColor Yellow
    Write-Host "1. Otwórz PuTTY" -ForegroundColor Cyan
    Write-Host "2. Host Name: ${SERVER_HOST}, Port: ${SERVER_PORT}" -ForegroundColor Cyan
    Write-Host "3. Connection → Data → Auto-login username: ${SERVER_USER}" -ForegroundColor Cyan
    Write-Host "4. Saved Sessions: wpisz '${SESSION_NAME}' i kliknij Save" -ForegroundColor Cyan
    Write-Host "5. Zaloguj się raz (wprowadź hasło)" -ForegroundColor Cyan
    Write-Host "6. Zamknij PuTTY i uruchom skrypt ponownie" -ForegroundColor Cyan
    exit 1
}

Write-Host "🔄 Reloading nginx..." -ForegroundColor Cyan
& $plinkPath -P $SERVER_PORT ${SERVER_USER}@${SERVER_HOST} "service nginx reload"

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 App available at: https://dzwonek.byst.re" -ForegroundColor Yellow
