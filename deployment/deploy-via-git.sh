#!/bin/bash

# Deploy script for mikr.us via GitHub
# Uruchamiany NA SERWERZE mikr.us

set -e

echo "🔄 Updating from GitHub..."
cd /var/www/dzwonek-app-repo
git pull origin main

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔨 Building application..."
# .env musi być w tym katalogu!
pnpm build

echo "📂 Copying build to web directory..."
rm -rf /var/www/dzwonek-app/*
cp -r dist/* /var/www/dzwonek-app/

echo "🔄 Reloading nginx..."
service nginx reload

echo "✅ Deployment complete!"
echo "🌐 App available at: https://dzwonek.byst.re"
