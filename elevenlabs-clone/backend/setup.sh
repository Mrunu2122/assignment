#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Update pip and setuptools
python -m pip install --upgrade pip setuptools wheel

# Install dependencies with no-cache-dir to prevent caching issues
pip install --no-cache-dir -r requirements.txt

# Verify uvicorn installation
python -c "import uvicorn" || pip install --no-cache-dir uvicorn[standard]

# Create necessary directories
mkdir -p /tmp/tts_cache
chmod 777 /tmp/tts_cache

echo "Setup completed successfully"
