# Use an official Node.js runtime as the base image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY . /app

# Install application dependencies
RUN npm install

# Define the command to run your application
CMD ["npm", "start"]
