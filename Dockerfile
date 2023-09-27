# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY . /app

# Expose a port
EXPOSE 3000
EXPOSE 3001

# Install application dependencies
RUN npm install

# Define the command to run your application
CMD ["npm", "start"]
