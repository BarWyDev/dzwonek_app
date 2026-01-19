#!/bin/bash

# Deploy frontend na mikr.us VPS
# VPS: florian114 | Serwer: florian114.mikrus.xyz

SERVER_USER="root"                        # Login mikr.us
SERVER_HOST="florian114.mikrus.xyz"       # Hostname serwera
SERVER_PORT="10114"                       # Port SSH
SERVER_PATH="/var/www/dzwonek-app"

echo "🔨 Building frontend..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📦 Deploying to mikr.us ($SERVER_HOST)..."

# Usuń stare pliki assets (żeby nie zajmowały miejsca)
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "rm -rf $SERVER_PATH/assets/*"

# Upload nowych plików
scp -P $SERVER_PORT -r dist/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🔧 Setting permissions..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "chmod -R 755 $SERVER_PATH && chmod 644 $SERVER_PATH/assets/*.js $SERVER_PATH/assets/*.css"

echo "🔄 Reloading nginx..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "service nginx reload"

echo "✅ Deployment complete!"
echo "🌐 App available at: https://dzwonek.byst.re"
