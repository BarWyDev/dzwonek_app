#!/bin/bash

# Deploy frontend na mikr.us VPS
# Wymagania: dostęp SSH do serwera

SERVER_USER="user"
SERVER_HOST="your-mikrus-ip"
SERVER_PATH="/var/www/dzwonek-app"

echo "Building frontend..."
pnpm build

echo "Deploying to mikr.us..."
scp -r dist/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

echo "Restarting nginx..."
ssh $SERVER_USER@$SERVER_HOST "sudo systemctl reload nginx"

echo "Deployment complete!"
