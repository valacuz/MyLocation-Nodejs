# My Location web services (node.js)
A practicing web services project written on node.js contains CRUD operation.

## **Dependencies**
- Application
    - [expressjs](https://github.com/expressjs/express) - Web framework for node.js
    - [body-parser](https://github.com/expressjs/body-parser) - Node.js body parsing middleware
    - [joijs](https://github.com/hapijs/joi) - Object schema description language and validator for javascript objects.
    - [helmetjs](https://github.com/helmetjs/helmet) - A collection of middleware functions to help security headers for express.js

- Testing
    - [mocha](https://mochajs.org) - Javascript testing framework for node.js
    - [chaijs](http://www.chaijs.com) - BDD/TDD assertion library for node.js
    - [chai-http](https://github.com/chaijs/chai-http) - HTTP integration testing for chai assertion

## **Structure**
- `app.js` - The entry point to application. This file defines express server. It also requires `route` to handle request from clients.
- `config` - This folder contains configuration/environment variables.
- `controller` - This folder contains business flow of application, It defines how application process with request. It also working between `route` and `model`.
- `model` - This folder contains business logic of application such as Data sources, Validation rules, etc.
- `route` - This folder contains route for api, decide what to do when clients connected to services in various path.
- `test` - This folder contains test script.

## Future implmentation
- Database (MongoDB with mongoose)
- Authentication or Token (JWT)
- API References (Swagger)