#!/bin/bash
set -e
npm run build
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
cp .env.local .next/standalone/
sudo systemctl restart brand-checker
echo "Deployed."
