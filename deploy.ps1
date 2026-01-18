# Deployment script dla dzwonek.byst.re
# 
# UWAGA: Uzupełnij poniższe dane przed pierwszym użyciem!

# ========================================
# KONFIGURACJA - UZUPEŁNIJ SWOJE DANE
# ========================================

$SERVER_USER = "root"              # 👈 Twój login z mikr.us
$SERVER_HOST = "florian114.mikr.us" # 👈 Twój hostname
$SERVER_PORT = "10114"             # 👈 Twój port SSH (sprawdź w emailu!)
$SERVER_PATH = "/var/www/dzwonek-app"

# ========================================
# DEPLOYMENT
# ========================================

Write-Host "`n🔨 Building frontend..." -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Deploying to mikr.us ($SERVER_HOST:$SERVER_PORT)..." -ForegroundColor Cyan
Write-Host "Target: https://dzwonek.byst.re" -ForegroundColor Yellow

# Upload plików
scp -P $SERVER_PORT -r dist\* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔄 Reloading nginx..." -ForegroundColor Cyan
ssh -p $SERVER_PORT ${SERVER_USER}@${SERVER_HOST} "service nginx reload"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Warning: nginx reload failed (app may still work)" -ForegroundColor Yellow
}

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 App available at: https://dzwonek.byst.re" -ForegroundColor Cyan
Write-Host ""
