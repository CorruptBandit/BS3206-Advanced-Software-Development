# Inspired from: https://github.com/BretFisher/node-docker-good-defaults/

# Specify the base image
FROM node:20-slim

# Accept NODE_ENV as an argument; default to production
ARG NODE_ENV
ARG HOST_UID
ARG HOST_GID


# Fix bind-mount permissions on non-Docker-Deskop environments
RUN if [ ! -z "$HOST_UID" ] && [ ! -z "$HOST_GID" ]; then \
        groupmod -g $HOST_GID node && \
        usermod -u $HOST_UID -g $HOST_GID node; \
    fi

# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@latest -g

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app.
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node

# install dependencies conditionally based on NODE_ENV first
# in a different location for easier app bind mounting for local development
# WORKDIR now sets correct permissions if you set USER first
WORKDIR /opt/node_app
RUN mkdir -p ./app/node_modules/.vite
RUN chown -R node:node ./app/node_modules/.vite
COPY --chown=node:node package.json package-lock.json* ./
# and move the node_modules directory up one level from the app
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm ci; \
    else npm ci --omit=dev; \
    fi
RUN npm cache clean --force

# Set the PATH to include the node_modules/.bin from the /opt/node_app directory
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# Change the working directory to /opt/node_app/app
# This will be the directory where the application code resides
WORKDIR /opt/node_app/app
COPY --chown=node:node . .

# Default command to run the application
CMD if [ "$NODE_ENV" = "development" ]; \
    then FORCE_COLOR=1 npm run dev; \
    else FORCE_COLOR=1 npm start; \
    fi
