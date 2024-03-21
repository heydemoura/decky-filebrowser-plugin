#!/usr/bin/env sh

#!/bin/sh
set -e

echo "Container's IP address: `awk 'END{print $1}' /etc/hosts`"

cd /backend

mkdir -p out

echo "--- Building File Browser front end ---"
git clone https://github.com/filebrowser/filebrowser filebrowser
chmod a+w -R filebrowser
cd filebrowser/frontend
npm install
npm run build

echo "--- Building File Browser back end ---"
cd ../
go mod download
go build -o filebrowser
cp filebrowser /backend/out

echo "--- Bundling TLS certificates ---"
mkdir -p /backend/out/certs
cp /backend/certs/*.pem /backend/out/certs

echo "--- Cleanup File Browser repo ---"
cd /backend
rm -rf filebrowser
