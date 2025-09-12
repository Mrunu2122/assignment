#!/bin/bash
# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir

# Create necessary directories
mkdir -p /tmp/tts_cache

# Set permissions
chmod +x /tmp/tts_cache
