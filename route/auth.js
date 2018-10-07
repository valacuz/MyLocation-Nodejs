const jwt = require('express-jwt')
const secret = require('./../config').jwtSecret

function getTokenFromHeader (request) {
  if (request.headers.authorization &&
    request.headers.authorization.split(' ')[0] === 'Bearer') {
    return request.headers.authorization.split(' ')[1]
  }
  return null
}

// Work around when express-jwt throw error because of unauthorized.
// references: https://github.com/auth0/express-jwt#error-handling
module.exports.jwtErrorHandling = function (err, request, response, next) {
  /* istanbul ignore if */
  if (err.name === 'UnauthorizedError') {
    response.sendStatus(401)
  }
}

module.exports.rules = {
  required: jwt({
    secret: secret,
    credentialsRequired: true,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    credentialsRequired: false,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  })
}
