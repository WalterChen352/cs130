# GoNOW

This is "GoNow!" solution for mobile planner and calendar app for students and busy schedulers. The main task is events planning taking into account travel time and local conditions.

# Solution Structure

[Mobile project](./GoNOW/) | [Backend project](./backend/)

The solution follows a project structure to keep the codebase clean and maintainable:
```
/Solution
│── /.github
│   │── /workflows
│       │── ci.yml        # CI configuration based on GitHub actions
│── /backend              # Backend application
│── /GoNOW                # Mobile application
│── README.md             # Solution documentation
│── .gitignore            # Git file with list of files and directories to ignore in version control
│── docker-compose.yaml   # Docker-compose file to run dev environment (backend)
```

Link: [TS Doc](https://walterchen352.github.io/)

# How to Run Dev Environment (backend) Locally
You need to have :
- `API_KEY=<Google API key for routing requests>`
- `ACCESS_TOKEN=<access token for backend>`

## Clone Project
```shell
cd <YOUR_SOLUTIONS_FOLDER>;

# clone the repo
git clone https://github.com/WalterChen352/cs130;

# go to solution folder
cd cs130;
```

## Run Environment

For Unix:
```shell
API_KEY=<API_KEY> ACCESS_TOKEN=<ACCESS_TOKEN> docker-compose up --build;
```

For Windows:
```shell
$env:API_KEY="<API_KEY>"; $env:ACCESS_TOKEN="<ACCESS_TOKEN>"; docker-compose up --build;
```

You will be able to use backend application locally by `http://<your internal IP>:8080`
(mobile environment variable `EXPO_PUBLIC_APP_HOST`)
