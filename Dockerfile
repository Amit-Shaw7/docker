# Prisma 8 requires Node >= 22.18
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# Migrate job: needs the prisma CLI (a large dev dependency)
FROM base AS migrate
RUN npm ci && npm cache clean --force
COPY . .
CMD ["npx", "prisma", "db", "update"]

# Server: production dependencies only
FROM base AS app
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
