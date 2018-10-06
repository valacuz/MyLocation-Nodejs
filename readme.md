# My Location web services (express.js)
A practicing web services project written on node.js + express.js contains CRUD operation.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/valacuz/my-location-node.svg?branch=master)](https://travis-ci.org/valacuz/my-location-node)
[![Coverage Status](https://coveralls.io/repos/github/valacuz/my-location-node/badge.svg?branch=master)](https://coveralls.io/github/valacuz/my-location-node?branch=master)

## Dependencies
- Application
    - [expressjs](https://github.com/expressjs/express) - Web framework for node.js
    - [body-parser](https://github.com/expressjs/body-parser) - Node.js body parsing middleware
    - [joijs](https://github.com/hapijs/joi) - Object schema description language and validator for javascript objects.
    - [helmetjs](https://github.com/helmetjs/helmet) - A collection of middleware functions to help security headers for express.js
    - [mongoose](http://mongoosejs.com/) - mongodb object model for node.js
    - [express-jwt](https://github.com/auth0/express-jwt) - Middleware that validates JsonWebTokens

- Testing
    - [mocha](https://mochajs.org) - Javascript testing framework for node.js
    - [chaijs](http://www.chaijs.com) - BDD/TDD assertion library for node.js
    - [chai-http](https://github.com/chaijs/chai-http) - HTTP integration testing for chai assertion
    - [istanbuljs](https://github.com/istanbuljs/nyc) - Javascript test coverage
    - [coveralls](https://github.com/nickmerwin/node-coveralls) - Great coverage reporting with cool badge 

- Etc.
    - [env2](https://github.com/dwyl/env2) - Environment variable loader
    - [standardjs](https://github.com/standard/standard) - JavaScript standard style

## Structure
- `app.js` - The entry point to application. This file defines express server. It also requires `route` to handle request from clients.
- `config` - This folder contains configuration/environment variables.
- `controller` - This folder contains business flow of application, It defines how application process with request. It also working between `route` and `model`.
- `model` - This folder contains business logic of application such as Data sources, Validation rules, etc.
- `route` - This folder contains route for api, decide what to do when clients connected to services in various path.
- `test` - This folder contains test script.

## Pipeline
- `local` -> `github` -> `travisci` -> `coveralls` -> `heroku`

## Future implmentation
- Upload picture to Amazon S3
- API References (Swagger)