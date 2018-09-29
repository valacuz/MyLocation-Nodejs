'use strict'

const TypeSource = require('./../../model/source/type')
const UserSource = require('./../../model/source/user')
const Validator = require('./../../model/validator')
const to = require('./../../extension/to').to

const CONTENT_TYPE_JSON = 'application/json'
const userSource = new UserSource()
const typeSource = new TypeSource()

const TypeController = function () { }

TypeController.prototype.getTypes = async (request, response) => {
  const payload = request.payload
  var [userErr, user] = await to(userSource.checkUser(payload.username, payload.password))
  if (userErr) {
    // any error, response unavailable.
    response.sendStatus(503)
    return
  } else if (!user) {
    // user not found due to invalid information, response unauthorized.
    response.sendStatus(401)
    return
  }
  var [queryErr, types] = await to(typeSource.getTypes())
  if (queryErr) {
    response.sendStatus(503)
    return
  }
  // query successful, response ok with json array of place types.
  response.json(types)
}

TypeController.prototype.getTypeById = async (request, response) => {
  const payload = request.payload
  var [userErr, user] = await to(userSource.checkUser(payload.username, payload.password))
  if (userErr) {
    // any error, response unavailable.
    response.sendStatus(503)
    return
  } else if (!user) {
    // user not found due to invalid information, response unauthorized.
    response.sendStatus(401)
    return
  }
  const queryString = request.params
  var [queryErr, type] = await to(typeSource.getTypeById(queryString.id))
  if (queryErr) {
    response.sendStatus(503)
    return
  } else if (!type) {
    // place type not found, response not found.
    response.sendStatus(404)
    return
  }
  // query successful, response ok with json of place type.
  response.json(type)
}

TypeController.prototype.addType = async (request, response) => {
  const payload = request.payload
  var [userErr, user] = await to(userSource.checkUser(payload.username, payload.password))
  if (userErr) {
    // any error, response unavailable.
    response.sendStatus(503)
    return
  } else if (!user) {
    // user not found due to invalid information, response unauthorized.
    response.sendStatus(401)
    return
  } else if (!user.group.can_insert) {
    // user not allow to insert, response forbidden.
    response.sendStatus(403)
    return
  }
  const body = request.body
  const contentType = request.headers['content-type']
  const result = new Validator().validatePlaceType(body)
  if (contentType !== CONTENT_TYPE_JSON || result.error) {
    // content not provided or invalid form of request, response bad request.
    response.sendStatus(400)
    return
  }
  var [addErr, newType] = await to(typeSource.addType(body))
  if (addErr) {
    response.sendStatus(503)
    return
  }
  // creation successful, response created.
  response.status(201)
    .location(`/types/${newType.type_id}`)
    .contentType(CONTENT_TYPE_JSON)
    .send(newType)
}

TypeController.prototype.updateType = async (request, response) => {
  const payload = request.payload
  var [userErr, user] = await to(userSource.checkUser(payload.username, payload.password))
  if (userErr) {
    // any error, response unavailable.
    response.sendStatus(503)
    return
  } else if (!user) {
    // user not found due to invalid information, response unauthorized.
    response.sendStatus(401)
    return
  } else if (!user.group.can_update) {
    // user not allow to update, response forbidden.
    response.sendStatus(403)
    return
  }
  const body = request.body
  const contentType = request.headers['content-type']
  const queryString = request.params
  const result = new Validator().validatePlaceType(body)
  if (queryString.id !== body.type_id || contentType !== CONTENT_TYPE_JSON || result.error) {
    // content not provided or invalid form of request, response bad request.
    response.sendStatus(400)
    return
  }
  var [err, type] = await to(typeSource.getTypeById(queryString.id))
  if (err) {
    response.sendStatus(503)
    return
  } else if (!type) {
    // place type to updated not found, response not found.
    response.sendStatus(404)
    return
  }
  var [updateErr] = await to(typeSource.updateType(body))
  if (updateErr) {
    response.sendStatus(503)
    return
  }
  // updation successful, response ok.
  response.sendStatus(200)
}

TypeController.prototype.deleteType = async (request, response) => {
  const payload = request.payload
  var [userErr, user] = await to(userSource.checkUser(payload.username, payload.password))
  if (userErr) {
    response.sendStatus(503)
    return
  } else if (!user) {
    // user not found due to invalid information, response unauthorized.
    response.sendStatus(401)
    return
  } else if (!user.group.can_delete) {
    // user not allow to delete, response forbidden.
    response.sendStatus(403)
    return
  }
  const queryString = request.params
  var [queryErr, type] = await to(typeSource.getTypeById(queryString.id))
  if (queryErr) {
    response.sendStatus(503)
    return
  } else if (!type) {
    // place type not found, response not found.
    response.sendStatus(404)
    return
  }
  var [deleteErr] = await to(typeSource.deleteType(queryString.id))
  if (deleteErr) {
    response.sendStatus(503)
    return
  }
  // deletion successful, response no content.
  response.sendStatus(204)
}

module.exports = TypeController
