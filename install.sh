#!/bin/bash

# Install system dependencies
apt-get update
apt-get install -y ffmpeg libsodium-dev libopus-dev python3 make g++

# Install node dependencies
npm install

echo "Dependencies installed successfully"
