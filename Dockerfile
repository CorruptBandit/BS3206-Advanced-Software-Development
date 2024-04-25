# Specify the base image
FROM node:21-slim

# Set the working directory to /opt/node_app (one level above the app)
WORKDIR /opt/node_app

# Copy package.json and possibly package-lock.json
COPY package*.json ./

# Accept NODE_ENV as an argument; default to production
ARG NODE_ENV

# Install dependencies conditionally based on NODE_ENV
# and move the node_modules directory up one level from the app
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --omit=dev; \
    fi

RUN npm cache clean --force

# Set the PATH to include the node_modules/.bin from the /opt/node_app directory
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# Change the working directory to /opt/node_app/app
# This will be the directory where the application code resides
WORKDIR /opt/node_app/app

# Copy the rest of the application
COPY . .

# Default command to run the application
CMD if [ "$NODE_ENV" = "development" ]; \
    then npm run dev; \
    else npm start; \
    fi
