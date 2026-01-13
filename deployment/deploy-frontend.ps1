# Deploy frontend na mikr.us VPS (PowerShell dla Windows)
# INSTRUKCJA: Zaktualizuj poniższe zmienne swoimi danymi z mikr.us

$SERVER_USER = "u123"              # 👈 Twój login z emaila mikr.us (np. u123)
$SERVER_HOST = "frog01.mikr.us"    # 👈 Hostname z emaila (np. srv03.mikr.us, frog01.mikr.us)
$SERVER_PORT = "10123"             # 👈 Port SSH: 10000 + numer maszyny (np. 10123)
$SERVER_PATH = "/var/www/dzwonek-app"

Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Deploying to mikr.us ($SERVER_HOST)..." -ForegroundColor Cyan
scp -P $SERVER_PORT -r dist\* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Reloading nginx..." -ForegroundColor Cyan
ssh -p $SERVER_PORT ${SERVER_USER}@${SERVER_HOST} "service nginx reload"

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 App available at: https://dzwonek.byst.re" -ForegroundColor Yellow
