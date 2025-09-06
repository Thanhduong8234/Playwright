# DOCKER-BASED TEST RUNNER
# Provides isolated, consistent test execution environment

FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set working directory
WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Install Playwright browsers
RUN npx playwright install

# Create reports directory
RUN mkdir -p reports screenshots

# Set environment variables
ENV NODE_ENV=production
ENV HEADED=false
ENV BROWSER=chromium
ENV TIMEOUT=120000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Container is healthy')" || exit 1

# Default command
CMD ["node", "enhanced-test-runner.js", "--help"]

# Labels for metadata
LABEL maintainer="test-team@company.com"
LABEL version="1.0.0"
LABEL description="Playwright + Cucumber Test Runner Container"
