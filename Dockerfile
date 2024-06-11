###############
# Stage 1: Build the React app
FROM oven/bun:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Build the React app
RUN bun run build

###############
# Stage 2: Serve the built app
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install 

# Copy the built files from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose the port
EXPOSE 3031

# Serve the built app
CMD ["bun", "run", "preview"]
