# GoNOW Backend Appliction

This is GoNow! backend application for mobile planner and calendar app for students and busy schedulers. The app uses Node.js and Express framework for backend project. The main task is events planning taking into account travel time and local conditions.

# Project Structure

The project follows a modular structure to keep the codebase clean and maintainable:
```
/backend
│── /__tests__            # Unit and integration tests
│── /node_modules         # Dependencies (libraries, packages) required for project
│── deploy.bat            # Script to deploy backend to Google Cloud
│── Dockerfile            # Docker file for backend application
│── eslint.config.mjs     # ESLint configuration file for static code analysis
│── index.ts              # Entry point to run backend application
│── mapsQueries.ts        # Geo module
│── package.json          # Project file with configuration and Dependencies
│── README.md             # Project documentation
│── scedule.ts            # Schedule module
│── tsconfig.json         # TypeScript configuration file
│── types.ts              # Custom types
```

# How to Run Backend App Locally
Backend application expects environment variables:
- `API_KEY=<Google API Key>`
- `ACCESS_TOKEN=<access token for backend>`

You can add them on `.env` file.


## Prerequsites for Developer's Machine:
- [Node.js](https://nodejs.org/en/download) 22.13.1 or higher
- NPM 10.9.2 or higher

Check Node.js and NPM:
```shell
node -v; # shold print ver
npm -v; # shold print ver
```

## Clone Project
```shell
cd YOUR_PROJECTS_FOLDER;

# clone the project repo
git clone https://github.com/WalterChen352/cs130;

# go to project folder
cd cs130;
```

## Run Backend App

Go to project folder:
```shell
cd backend;
```

Install dependencies from packege.json
```shell
npm install;
```

Run backend server:
```shell
npm start;
```
or run via [docker-compose](../README.md)

# Run Tests
Run jest (unit) tests:
```shell
npm test;
```

Run static code analysis tests:
```shell
npm run lint;
```
