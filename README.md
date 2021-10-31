# Skynet

## App Server

### Setup

- cd into "app" directory.
- Run `npm install` to install all the packages.
- Run `npm install -g @angular/cli` to install angular into your system.
- Add the variables in `environment.ts` file or create a new file `environment.localhost.ts` directly in app directory with same value defined in `environment.ts`.

### Running the server

- Run following to start the app server:

```sh
ng serve
or
ng serve --configuration=localhost(if you have created environment.localhost.ts file)
```

- Open `localhost:4200` to see the app running in browser

## Backend Server

### Setup

- cd into "backend" directory of Skynet
- Run `npm install` to install all the packages.
- Rename `.env.example` to `.env` and input the required fields in file.

### Running the server

- Run `ng serve` to start the app server
- Open `localhost:<port-mentioned-in-env>` to see the app running in browser

#### [Postman API collection](https://documenter.getpostman.com/view/14223391/UV5f9Efd#92535086-0eb8-484a-a07d-65be89167acb)
