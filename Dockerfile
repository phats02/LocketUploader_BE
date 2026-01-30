# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# =============================================================================
# Stage 2: Production stage
# =============================================================================
FROM node:18-alpine AS production

# Install ffmpeg for video processing
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY package*.json ./
COPY main.js ./
COPY src ./src

# Copy environment and credential files
# Note: For production, consider using Azure Key Vault instead of bundling credentials
COPY .env.production ./
COPY key.json* ./

# Create uploads directory
RUN mkdir -p uploads

# Azure App Service uses PORT environment variable (default 8080)
# Your app reads from process.env.PORT, so this works automatically
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port (Azure will set PORT=8080)
EXPOSE 8080

# Health check for Azure App Service
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

CMD ["node", "main.js"]