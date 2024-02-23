#!/usr/bin/env sh

FILES_LIST="dist bin LICENSE main.py package.json plugin.json README.md"
DECK_IP="192.168.0.125"
HOMEBREW_DIR="/home/deck/homebrew"

PLUGIN_DIR="plugins/decky-filebrowser"
# Create folder at destination
ssh deck@$DECK_IP "mkdir $HOMEBREW_DIR/$PLUGIN_DIR"

ssh deck@$DECK_IP "chmod a+w -R $HOMEBREW_DIR/$PLUGIN_DIR"

# Cleaning directory
echo "Cleaning old files"
ssh deck@$DECK_IP "rm -rf $HOMEBREW_DIR/$PLUGIN_DIR/*"

echo "Copying files to Steam Deck:"
for i in $FILES_LIST; do
    scp -r $i deck@$DECK_IP:$HOMEBREW_DIR/plugins/decky-filebrowser
done
