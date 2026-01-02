# Use a simple lightweight image to serve static files
FROM node:20-alpine

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy the entire project (assuming it is already built locally!)
COPY . .

# Expose port 8080
EXPOSE 8080

# Serve the repository root
CMD ["http-server", ".", "-p", "8080", "--cors", "-c-1"]
