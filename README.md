# BS3206-Advanced-Software-Development

React.js Frontend - Theme: https://mui.com/store/items/minimal-dashboard-free/

Express.js Backend

MongoDB Database

## Setup

1. Copy the [.env.template](./.env.template)
1. Rename to `.env`
1. Populate the values in the `.env`
1. **Windows ONLY**: `npm config set script-shell powershell`
1. Install Dependencies: `npm install` (in Production add the following flag: `--omit=dev`)


## Run

**Production**:
```sh
npm start
```

**Development**:
```sh
npm run dev
```

_Includes ESLint_


## Running in Docker

1. Setup: Create and populate `.env` from the template
1. Build: `docker compose build`
1. Run: `docker compose up`
