# Use the official lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

# Expose the port your server runs on (e.g., 5000)
 EXPOSE 5000

# Command to run your application
CMD ["npm", "start"]
