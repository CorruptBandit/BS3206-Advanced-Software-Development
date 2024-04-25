# BS3206-Advanced-Software-Development

This is a gym fitness application designed to track workouts and diets, helping users maintain and follow through with their fitness goals. The app utilises a sleek dashboard theme for easy navigation and interaction.

## Tech Stack

- **Frontend:** React.js - Theme used: [Minimal Dashboard Free](https://mui.com/store/items/minimal-dashboard-free/)
- **Backend:** Express.js
- **Database:** MongoDB

## Prerequisites

Before you begin, ensure you have met the following requirements:
- **Docker** For Docker users, install Docker by following the guide at [Docker's official site](https://docs.docker.com/get-docker/).
- **Node.js and npm:** For Node.js users, ensure that Node.js and npm are installed. They can be downloaded from [nodejs.org](https://nodejs.org/).

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

### Running the Application

#### Docker (Preferred Method)
- **Build and run the Docker container**
  ```bash
  docker-compose up --build
  ```

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
    
_Production should **only** be used when the system is ready for release_
