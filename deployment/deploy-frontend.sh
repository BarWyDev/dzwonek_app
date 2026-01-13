#!/bin/bash

# Deploy frontend na mikr.us VPS
# INSTRUKCJA: Zaktualizuj poniższe zmienne swoimi danymi z mikr.us

SERVER_USER="u123"              # 👈 Twój login z emaila mikr.us (np. u123)
SERVER_HOST="frog01.mikr.us"    # 👈 Hostname z emaila (np. srv03.mikr.us, frog01.mikr.us)
SERVER_PORT="10123"             # 👈 Port SSH: 10000 + numer maszyny (np. 10123)
SERVER_PATH="/var/www/dzwonek-app"

echo "🔨 Building frontend..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📦 Deploying to mikr.us ($SERVER_HOST)..."
scp -P $SERVER_PORT -r dist/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🔄 Reloading nginx..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "service nginx reload"

echo "✅ Deployment complete!"
echo "🌐 App available at: https://dzwonek.byst.re"
