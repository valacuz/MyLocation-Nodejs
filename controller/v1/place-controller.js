const PlaceSource = require('./../../model/source/place')
const UserSource = require('./../../model/source/user')
const Validator = require('./../../model/validator')

const CONTENT_TYPE_JSON = 'application/json'
const userSource = new UserSource()
const placeSource = new PlaceSource()

const PlaceController = function () { }

PlaceController.prototype.getPlaces = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized.
                response.sendStatus(401)
                return
            }
            var offset = 0
            var limit = 20

            if (request.query.offset !== undefined) {
                offset = Number(request.query.offset)
            }
            if (request.query.limit !== undefined) {
                limit = Number(request.query.limit)
            }
            placeSource.getPlaces(offset, limit)
                .then(places => response.json(places))
        })
        .catch(_ => response.sendStatus(503))
}

PlaceController.prototype.getPlaceById = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized.
                response.sendStatus(401)
                return
            }
            placeSource.getPlaceById(request.params.id)
                .then(place => {
                    if (place) {
                        response.json(place)
                    } else {
                        response.sendStatus(404)
                    }
                })
        })
        .catch(() => response.sendStatus(503))
}

PlaceController.prototype.addPlace = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized
                response.sendStatus(401)
                return
            } else if (!user.can_insert) {
                // If user found but not allowed to insert records, response forbidden
                response.sendStatus(403)
                return
            }
            const body = request.body
            const contentType = request.headers['content-type']
            const result = new Validator().validatePlace(body)

            // If object is invalid form, return 400 (Bad request)
            if (contentType != CONTENT_TYPE_JSON || result.error) {
                response.sendStatus(400)
                return
            }
            // Otherwise, add place to data source
            placeSource.addPlace(body)
                .then(newPlace => {
                    response.status(201)
                        .location(`/places/${newPlace.place_id}`)
                        .contentType(CONTENT_TYPE_JSON)
                        .send(newPlace)
                })
        })
        .catch(_ => response.sendStatus(503))
}

PlaceController.prototype.updatePlace = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized.
                response.sendStatus(401)
                return
            } else if (!user.can_update) {
                // If user found but not allowed to update records, response forbidden.
                response.sendStatus(403)
                return
            }
            // If place_id from body and place_id from query string is not the same, reject.
            const body = request.body
            const contentType = request.headers['content-type']
            const queryString = request.params
            const result = new Validator().validatePlace(body)

            if (queryString.id != body.place_id || contentType != CONTENT_TYPE_JSON || result.error) {
                response.sendStatus(400)
                return
            }
            placeSource.getPlaceById(request.params.id)
                .then(place => {
                    if (place) {
                        // When place was found, update it.
                        placeSource.updatePlace(body)
                            .then(() => response.sendStatus(200))
                    } else {
                        // otherwise, response not found.
                        response.sendStatus(404)
                    }
                })
        })
        .catch(() => response.sendStatus(503))
}

PlaceController.prototype.deletePlace = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized.
                response.sendStatus(401)
                return
            } else if (!user.can_delete) {
                // If user found but not allowed to delete records, response forbidden.
                response.sendStatus(403)
                return
            }
            // Try to find place by id
            const id = request.params.id
            placeSource.getPlaceById(id)
                .then(place => {
                    if (place) {
                        // When place was found, delete it.
                        placeSource.deletePlace(id)
                            .then(() => response.sendStatus(204))
                    } else {
                        // otherwise, response not found.
                        response.sendStatus(404)
                    }
                })
        })
        .catch(() => response.sendStatus(503))
}

module.exports = PlaceController