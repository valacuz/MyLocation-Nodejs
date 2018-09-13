"use strict";

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
    var [err, user] = await to(userSource.checkUser(payload.user, payload.password))
    if (err) {
        // any error, response unavailable.
        response.sendStatus(503)
        return
    } else if (!user) {
        // user not found due to invalid information, response unauthorized.
        response.sendStatus(401)
        return
    }
    var [err, types] = await to(typeSource.getTypes())
    if (err) {
        response.sendStatus(503)
        return
    }
    // Query successful, response ok with json array of place types.
    response.json(types)
}

TypeController.prototype.getTypeById = async (request, response) => {
    const payload = request.payload
    var [err, user] = await to(userSource.checkUser(payload.user, payload.password))
    if (err) {
        // any error, response unavailable.
        response.sendStatus(503)
        return
    } else if (!user) {
        // user not found due to invalid information, response unauthorized.
        response.sendStatus(401)
        return
    }
    var [err, type] = await to(typeSource.getTypeById(request.params.id))
    if (err) {
        response.sendStatus(503)
        return
    } else if (!type) {
        // place type not found, response not found.
        response.sendStatus(404)
        return
    }
    // Query successful, response ok with json of place type.
    response.json(type)
}

TypeController.prototype.addType = async (request, response) => {
    const payload = request.payload
    var [err, user] = await to(userSource.checkUser(payload.user, payload.password))
    if (err) {
        // any error, response unavailable.
        response.sendStatus(503)
        return
    } else if (!user) {
        // user not found due to invalid information, response unauthorized.
        response.sendStatus(401)
        return
    } else if (!user.can_insert) {
        // user not allow to insert, response forbidden.
        response.sendStatus(403)
        return
    }
    const body = request.body
    const contentType = request.headers['content-type']
    const result = new Validator().validatePlaceType(body)
    if (contentType != CONTENT_TYPE_JSON || result.error) {
        // content not provided or invalid form of request, response bad request.
        response.sendStatus(400)
        return
    }
    var [err, newType] = await to(typeSource.addType(body))
    if (err) {
        response.sendStatus(503)
        return
    }
    // Creation successful, response created.
    response.status(201)
        .location(`/types/${newType.type_id}`)
        .contentType(CONTENT_TYPE_JSON)
        .send(newType)
}

TypeController.prototype.updateType = async (request, response) => {
    const payload = request.payload
    var [err, user] = await to(userSource.checkUser(payload.user, payload.password))
    if (err) {
        // any error, response unavailable.
        response.sendStatus(503)
        return
    } else if (!user) {
        // user not found due to invalid information, response unauthorized.
        response.sendStatus(401)
        return
    } else if (!user.can_update) {
        // user not allow to update, response forbidden.
        response.sendStatus(403)
        return
    }
    const body = request.body
    const contentType = request.headers['content-type']
    const queryString = request.params
    const result = new Validator().validatePlaceType(body)
    if (queryString.id != body.type_id || contentType != CONTENT_TYPE_JSON || result.error) {
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
    var [err] = await to(typeSource.updateType(body))
    if (err) {
        response.sendStatus(503)
        return
    }
    // Updation successful, response ok.
    response.sendStatus(200)
}

TypeController.prototype.deleteType = async (request, response) => {
    const payload = request.payload
    var [err, user] = await to(userSource.checkUser(payload.user, payload.password))
    if (err) {
        response.sendStatus(503)
        return
    } else if (!user) {
        // user not found due to invalid information, response unauthorized.
        response.sendStatus(401)
        return
    } else if (!user.can_delete) {
        // user not allow to delete, response forbidden.
        response.sendStatus(403)
        return
    }
    const queryString = request.params;
    var [err, type] = await to(typeSource.getTypeById(queryString.id))
    if (err) {
        response.sendStatus(503)
        return
    } else if (!type) {
        // place type not found, response not found.
        response.sendStatus(404)
        return
    }
    var [err] = await to(typeSource.deleteType(queryString.id))
    if (err) {
        response.sendStatus(503)
        return
    }
    // deletion successful, response no content.
    response.sendStatus(204)
}

module.exports = TypeController