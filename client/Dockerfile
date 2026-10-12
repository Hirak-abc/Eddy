# Client — React + Vite (dev image for colleague onboarding)
# Build context is the repo root (see docker-compose.yml), so npm
# workspaces (root package-lock.json) resolve reproducibly with `npm ci`.
FROM node:22-alpine

WORKDIR /app

# Install deps first (better layer caching, reproducible via lockfile)
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm ci --include=dev

# Copy client source only
COPY client ./client

WORKDIR /app/client

ENV NODE_ENV=development

EXPOSE 5173

# --host is required so Vite is reachable outside the container
CMD ["npm", "run", "dev", "--", "--host", "--port", "5173"]
