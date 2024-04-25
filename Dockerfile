# Specify the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and possibly package-lock.json
COPY package*.json ./

# Accept NODE_ENV as an argument; default to production
ARG NODE_ENV

# Install dependencies conditionally based on NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --omit=dev; \
    fi

# Copy the rest of the application
COPY . .

# Default command
CMD if [ "$NODE_ENV" = "development" ]; \
    then npm run dev; \
    else npm start; \
    fi
