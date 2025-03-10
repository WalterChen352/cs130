# GoNOW Mobile Appliction

This is GoNow!, a mobile planner and calendar app for students and busy schedulers. The app uses Node.js for backend development, React Native for mobile platforms, and SQLite as storage. The main task is events planning taking into account travel time and local conditions.

# Project Structure

The project follows a modular structure to keep the codebase clean and maintainable:
```
/GoNOW
│── /__mocks__             # Mock implementations of modules
│── /__tests__             # Unit and integration tests
│── /app
│   │── /components       # Reusable UI components (e.g., AddressPicker, ButtonSave)
│   │── /models           # Model classes used in the application
│   │── /screens          # App screens (Calendar, Map, Tasks, Profile, Workflow, etc.)
│   │── /scripts          # Class and methods for working with storage (SQLite)
│   │── /styles           # Style files for application components
│   |── __layout.tsx      # Global layout for the app
│   |── index.tsx         # Entry point of the application
│── /assets               # Static assets (icons, images, etc.)
│── /node_modules         # Dependencies (libraries, packages) required for project
│── .gitignore            # Git file with list of files and directories to ignore in version control
│── .env                  # Environment variables in a key-value format (everyone creates for themselves)
│── app.json              # Main configuration file
│── eslint.config.mjs     # ESLint configuration file for static code analysis
│── package.json          # Project file with configuration and Dependencies
│── README.md             # Project documentation
│── tsconfig.json         # TypeScript configuration file
│── typedoc.json          # Configuration file for TypeDoc
```

Link: [TS Doc](https://walterchen352.github.io/)

# How to Run Mobile App Locally
Mobile application expects environment variables:
- `EXPO_PUBLIC_APP_HOST=https://<backend host>`
- `EXPO_PUBLIC_ACCESS_TOKEN=<access token for backend>`

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

## Build Mobile App

Go to project folder:
```shell
cd GoNOW;
```

Install dependencies from packege.json
```shell
npm install;
```

Build Mobile app start the Expo server:
```shell
npx expo start;
```

## Check Mobile App in your smartphone

- Installed Expo Go ( [Apple Store](https://apps.apple.com/us/app/expo-go/id982107779), [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US))
- Your smartphone must be connected to the same network as the Expo server.
- Open Expo Go app on your smartphone and use `Scan QR code` option to conect to Expo server and open the Mobile app.

# Run Tests
Run jest (unit) tests:
```shell
npm test;
```

Run static code analysis tests:
```shell
npm run lint;
```
