# BS3206-Advanced-Software-Development

This is a gym fitness application designed to track workouts and diets, helping users maintain and follow through with their fitness goals. The app utilises a sleek dashboard theme for easy navigation and interaction.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Express.js
- **Database:** MongoDB

## Prerequisites

Before you begin, ensure you have met the following requirements:
- **Docker** For Docker users, install Docker by following the guide at [Docker's official site](https://docs.docker.com/get-docker/).
- **Node.js and npm:** For Node.js users, ensure that Node.js v20 and npm latest rmare installed. They can be downloaded from [nodejs.org](https://nodejs.org/).

_Docker is the prefered method_

## Getting Started

These instructions will get your project up and running on your local machine for development and testing purposes.

1. **Clone the repository**
   ```bash
   git clone git@github.com:CorruptBandit/BS3221-Developing-for-the-Cloud.git
   ```

   _Then enter the directory of the repository_

2. **Prepare environment variables**
   - Copy the `.env.template` file and rename it to `.env`.
   - Populate the `.env` file with the necessary environment variables, for example:
     ```sh
     NODE_ENV="development"
     MONGO_USERNAME="University"
     MONGO_PASSWORD="password"
     CLIENT_PORT="3000"
     SERVER_PORT="3001"
     JWT_SECRET_KEY="insecure"
     ```

### Using the Application
This application supports hot reloading, meaning that changes in the codebase will automatically refresh the application without needing a restart. Docker is the preferred method of running the application as it ensures a consistent environment across different platforms.

_Due to [WSL2 limitations](https://github.com/microsoft/WSL/issues/4739), hot reloading **only** works through polling, meaning the webpage **must** be open for the hot reload to take effect_

#### Docker (Preferred Method)
- **Non Docker Desktop users ONLY: Set UID and GID**
  ```bash
  export HOST_UID=$(id -u)
  export HOST_GID=$(id -g)
  ```

  _Do **NOT** use this when using Docker Desktop, this is already handled for you, for more info see the [notes section](#notes)_


- **Build and Run the Application**
  ```bash
  docker compose up --build
  ```

- **Test the Application**
  ```bash
  docker compose run --build --rm test
  ```

- **Lint the Application**
  ```bash
  docker compose run --build --rm lint
  ```

_The `--build` flag is used to ensure you have the latest version of the image, remove this if you would rather perform manual builds_

#### Node.js (Alternative Method)
- **Windows ONLY: Set PowerShell as the script shell**
  ```powershell
  npm config set script-shell powershell
  ```

  _Do **NOT** use this when using a Unix system_

- **Install Dependencies**
  - **Development:**
    ```bash
    npm install
    ```
  - **Production:**
    ```bash
    npm install --omit=dev
    ```

- **Start the Application**
  - **Development:**
    ```bash
    npm run dev
    ```
  - **Production:**
    ```bash
    npm start
    ```

- **Test the Application**
  ```bash
  npm test
  ```

- **Lint the Application**
  ```bash
  npm run lint
  ```
    
_Production should **only** be used when the system is ready for release_

## Notes
- Theme used: [Minimal Dashboard Free](https://mui.com/store/items/minimal-dashboard-free/)

- Non-Docker Desktop environments, such as Docker running on native Linux, often need to handle user permissions more explicitly to avoid file ownership issues with volumes. This is because Docker on Linux uses the host machine's user and group IDs directly, which can lead to permission denied errors if the container's processes attempt to write to bind mounts owned by a different user. By setting `HOST_UID` and `HOST_GID` to the IDs of the current user, we ensure that any files created by Docker on Linux are owned by the user, not by root or a mismatched user ID.

  **Important**: Do not use `sudo` to run the below commands as the environment variables will not work, either put the variables in the `.env`  or, see the official [Docker documentation](https://docs.docker.com/engine/install/linux-postinstall/) on how to run as a non-root user.