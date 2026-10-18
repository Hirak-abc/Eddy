# Server — Express + TypeScript (dev image for colleague onboarding)
# Build context is the repo root (see docker-compose.yml), so npm
# workspaces (root package-lock.json) resolve reproducibly with `npm ci`.
FROM node:22-alpine

WORKDIR /app

# Install deps first (better layer caching, reproducible via lockfile)
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN npm ci --include=dev
RUN apk add --no-cache fontconfig ttf-dejavu

# Copy source without host secrets, dependencies, or build output.
COPY server ./server
# Social repositories use the generated Convex API at runtime.
COPY convex/_generated ./convex/_generated

WORKDIR /app/server

ENV NODE_ENV=development
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "run", "dev"]
