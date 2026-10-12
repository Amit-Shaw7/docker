# Prisma 8 requires Node >= 22.18
FROM node:22-alpine

WORKDIR /app

# Copy package files first to leverage caching
COPY package*.json ./

# Full install: the prisma CLI (a dev dependency) is needed by the migrate service
RUN npm ci

# Copy the rest of the application code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
