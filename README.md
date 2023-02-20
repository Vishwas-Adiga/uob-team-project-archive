# Uni Portfolio

## Project structure
The project is written in React + TypeScript and uses a NodeJS backend. An overview of directories is as follows:
- `client/`: Client-side/front-end code
  - `routes/`: Routes are standalone pages of the app, each with a unique URL slug
  - `components/`: Reusable components that are common across routes
  - `config.ts`: Front-end configuration tokens
- `server/`: Back-end code
  - `configs/`: Collection of back-end configuration tokens (eg `db.config.ts`, `twitter-keys.config.ts`)
  - `middleware/`: Project-specific NodeJS middleware
  - `routes/`: Collection of API routes
  - `services/`: DB-level access services consumed by routes and middleware

## Development
Before you can build this project, you must install and configure its dependencies on your machine using
```shell
npm install
```

To start the app in development mode, run
```shell
npm run dev
```
## Building for production

This project can be packaged for production using:
```shell
npm run build
```
To deploy the packaged build, run the following command from the directory containing the packaged files (`./dist` by default)
```shell
npm install
node ./server/main.cjs
```
> Ensure the NODE_ENV environment variable is set to `production`
> 
> ```NODE_ENV=production node ./server/main.cjs```
