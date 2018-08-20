const PlaceSource = require('./../../model/source/place')
const Validator = require('./../../model/validator')

const CONTENT_TYPE_JSON = 'application/json'

const PlaceController = function () { }

PlaceController.prototype.getPlaces = (request, response) => {
    var offset = 0
    var limit = 20

    if (request.query.offset !== undefined) {
        offset = Number(request.query.offset)
    }
    if (request.query.limit !== undefined) {
        limit = Number(request.query.limit)
    }
    const placeSource = new PlaceSource()
    placeSource.getPlaces(offset, limit)
        .then(places => response.json(places))
        .catch(() => response.sendStatus(503))
}

PlaceController.prototype.getPlaceById = (request, response) => {
    const placeSource = new PlaceSource()
    placeSource.getPlaceById(request.params.id)
        .then(place => {
            if (place) {
                response.json(place)
            } else {
                response.sendStatus(404)
            }
        })
        .catch(() => response.sendStatus(503))
}

PlaceController.prototype.addPlace = (request, response) => {
    const body = request.body
    const contentType = request.headers['content-type']
    const result = new Validator().validatePlace(body)

    // If object is invalid form, return 400 (Bad request)
    if (contentType != CONTENT_TYPE_JSON || result.error) {
        response.sendStatus(400)
        return
    }
    // Otherwise, add place to data source
    const placeSource = new PlaceSource()
    placeSource.addPlace(body)
        .then(newPlace => {
            response.status(201)
                .location(`/places/${newPlace.place_id}`)
                .contentType(CONTENT_TYPE_JSON)
                .send(newPlace)
        })
        .catch(() => response.sendStatus(503))
}

PlaceController.prototype.updatePlace = (request, response) => {
    // If place_id from body and place_id from query string is not the same, reject.
    const body = request.body
    const contentType = request.headers['content-type']
    const queryString = request.params
    const result = new Validator().validatePlace(body)

    if (queryString.id != body.place_id || contentType != CONTENT_TYPE_JSON || result.error) {
        response.sendStatus(400)
        return
    }
    const placeSource = new PlaceSource()
    placeSource.getPlaceById(request.params.id)
        .then(place => {
            if (place) {
                placeSource.updatePlace(body)
                    .then(() => response.sendStatus(200))
            } else {
                response.sendStatus(401)
            }
        })
        .catch(() => response.sendStatus(503))
}

PlaceController.prototype.deletePlace = (request, response) => {
    const placeSource = new PlaceSource()
    placeSource.getPlaceById(request.params.id)
        .then(place => {
            if (place) {
                placeSource.deletePlace(request.params.id)
                    .then(() => response.sendStatus(204))
            } else {
                response.sendStatus(401)
            }
        })
        .catch(() => response.sendStatus(503))
}

module.exports = PlaceController