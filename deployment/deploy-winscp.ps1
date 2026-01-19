# Deploy przez WinSCP (wymaga zainstalowanego WinSCP)
# Download: https://winscp.net/eng/download.php

# KONFIGURACJA - VPS: florian114
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

Write-Host "📦 Opening WinSCP for deployment..." -ForegroundColor Cyan

# Ścieżka do WinSCP (zaktualizuj jeśli zainstalowane gdzie indziej)
$winscpPath = "C:\Program Files (x86)\WinSCP\WinSCP.com"

if (-not (Test-Path $winscpPath)) {
    Write-Host "❌ WinSCP not found at: $winscpPath" -ForegroundColor Red
    Write-Host "Download from: https://winscp.net/eng/download.php" -ForegroundColor Yellow
    exit 1
}

# Skrypt WinSCP
$winscpScript = @"
open sftp://${SERVER_USER}@${SERVER_HOST}:${SERVER_PORT}/ -hostkey=*
lcd $PSScriptRoot\..\dist
cd $SERVER_PATH
synchronize remote -delete
exit
"@

# Zapisz skrypt tymczasowo
$scriptPath = "$env:TEMP\winscp_deploy.txt"
$winscpScript | Out-File -FilePath $scriptPath -Encoding ASCII

# Wykonaj deploy
& $winscpPath /script=$scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
    Write-Host "🌐 App available at: https://dzwonek.byst.re" -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
}

# Usuń tymczasowy skrypt
Remove-Item $scriptPath -ErrorAction SilentlyContinue
