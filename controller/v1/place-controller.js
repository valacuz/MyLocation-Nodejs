"use strict"

const PlaceSource = require('./../../model/source/place')
const UserSource = require('./../../model/source/user')
const Validator = require('./../../model/validator')
const to = require('./../../extension/to').to

const CONTENT_TYPE_JSON = 'application/json'
const userSource = new UserSource()
const placeSource = new PlaceSource()

const PlaceController = function () { }

PlaceController.prototype.getPlaces = async (request, response) => {
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
    const offset = request.query.offset !== undefined ? Number(request.query.offset) : 0
    const limit = request.query.limit !== undefined ? Number(request.query.limit) : 20
    var [err, places] = await to(placeSource.getPlaces(offset, limit))
    if (err) {
        response.sendStatus(503)
        return
    }
    // query successful, response ok with json array of places.
    response.json(places)
}

PlaceController.prototype.getPlaceById = async (request, response) => {
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
    var [err, place] = await to(placeSource.getPlaceById(request.params.id))
    if (err) {
        response.sendStatus(503)
        return
    } else if (!place) {
        // place not found, response not found.
        response.sendStatus(404)
        return
    }
    // query successful, response ok with json of place.
    response.json(place)
}

PlaceController.prototype.addPlace = async (request, response) => {
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
    const result = new Validator().validatePlace(body)
    if (contentType != CONTENT_TYPE_JSON || result.error) {
        // content not provided or invalid form of request, response bad request.
        response.sendStatus(400)
        return
    }
    var [err, newPlace] = await to(placeSource.addPlace(body))
    if (err) {
        response.sendStatus(503)
        return
    }
    // creation successful, response created.
    response.status(201)
        .location(`/places/${newPlace.place_id}`)
        .contentType(CONTENT_TYPE_JSON)
        .send(newPlace)
}

PlaceController.prototype.updatePlace = async (request, response) => {
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
    const result = new Validator().validatePlace(body)
    if (queryString.id != body.place_id || contentType != CONTENT_TYPE_JSON || result.error) {
        // content not provided or invalid form of request, response bad request.
        response.sendStatus(400)
        return
    }
    var [err, place] = await to(placeSource.getPlaceById(queryString.id))
    if (err) {
        response.sendStatus(503)
        return
    } else if (!place) {
        // place to updated not found, response not found.
        response.sendStatus(404)
        return
    }
    var [err] = await to(placeSource.updatePlace(body))
    if (err) {
        response.sendStatus(503)
        return
    }
    // updation successful, response ok.
    response.sendStatus(200)
}

PlaceController.prototype.deletePlace = async (request, response) => {
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
    const queryString = request.params
    var [err, place] = await to(placeSource.getPlaceById(queryString.id))
    if (err) {
        response.sendStatus(503)
        return
    } else if (!place) {
        // place not found, response not found.
        response.sendStatus(404)
        return
    }
    var [err] = await to(placeSource.deletePlace(queryString.id))
    if (err) {
        response.sendStatus(503)
        return
    }
    // deletion successful, response no content.
    response.sendStatus(204)
}

module.exports = PlaceController