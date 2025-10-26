# Use Node.js LTS version
FROM node:20-slim

# Install system dependencies for audio processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    make \
    g++ \
    libtool \
    autoconf \
    automake \
    libsodium-dev \
    libopus-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application files
COPY . .

# Expose port (if needed for health checks)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
