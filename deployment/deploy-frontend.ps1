# Deploy frontend na mikr.us VPS (PowerShell dla Windows)
# VPS: florian114 | Serwer: florian114.mikrus.xyz

$SERVER_USER = "root"                        # Login mikr.us
$SERVER_HOST = "florian114.mikrus.xyz"       # Hostname serwera
$SERVER_PORT = "10114"                       # Port SSH
$SERVER_PATH = "/var/www/dzwonek-app"

Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Deploying to mikr.us ($SERVER_HOST)..." -ForegroundColor Cyan

# Usuń stare pliki assets (żeby nie zajmowały miejsca)
ssh -p $SERVER_PORT ${SERVER_USER}@${SERVER_HOST} "rm -rf ${SERVER_PATH}/assets/*"

# Upload nowych plików
scp -P $SERVER_PORT -r dist\* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Setting permissions..." -ForegroundColor Cyan
ssh -p $SERVER_PORT ${SERVER_USER}@${SERVER_HOST} "chmod -R 755 ${SERVER_PATH} && chmod 644 ${SERVER_PATH}/assets/*.js ${SERVER_PATH}/assets/*.css"

Write-Host "🔄 Reloading nginx..." -ForegroundColor Cyan
ssh -p $SERVER_PORT ${SERVER_USER}@${SERVER_HOST} "service nginx reload"

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 App available at: https://dzwonek.byst.re" -ForegroundColor Yellow
