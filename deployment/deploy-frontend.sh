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
scp -P $SERVER_PORT -r dist/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🔄 Reloading nginx..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "service nginx reload"

echo "✅ Deployment complete!"
echo "🌐 App available at: https://dzwonek.byst.re"
