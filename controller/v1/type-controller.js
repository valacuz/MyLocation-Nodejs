const TypeSource = require('./../../model/source/type')
const Validator = require('./../../model/validator')

const CONTENT_TYPE_JSON = 'application/json'

const TypeController = function () { }

TypeController.prototype.getTypes = (_, response) => {
    const typeSource = new TypeSource()
    typeSource.getTypes()
        .then(types => response.json(types))
        .catch(_ => response.sendStatus(503))
}

TypeController.prototype.getTypeById = (request, response) => {
    const typeSource = new TypeSource()
    typeSource.getTypeById(request.params.id)
        .then(type => {
            if (type) {
                response.json(type)
            } else {
                response.sendStatus(404)
            }
        })
        .catch(_ => response.sendStatus(503))
}

TypeController.prototype.addType = (request, response) => {
    const body = request.body
    const contentType = request.headers['content-type']
    const result = new Validator().validatePlaceType(body)

    // If object is invalid form, return 400 (Bad request)
    if (contentType != CONTENT_TYPE_JSON || result.error) {
        response.sendStatus(400)
        return
    }
    // Otherwise, add type to data source
    const typeSource = new TypeSource()
    typeSource.addType(body)
        .then(newType => {
            response.status(201)
                .location(`/types/${newType.type_id}`)
                .contentType(CONTENT_TYPE_JSON)
                .send(JSON.stringify(newType))
        })
        .catch(_ => response.sendStatus(503))
}

TypeController.prototype.updateType = (request, response) => {
    // If type_id from body and type_id from query string is not the same, reject.
    const body = request.body
    const contentType = request.headers['content-type']
    const queryString = request.params
    const result = new Validator().validatePlaceType(body)

    if (queryString.id != body.type_id || contentType != CONTENT_TYPE_JSON || result.error) {
        response.sendStatus(400)
        return
    }
    const typeSource = new TypeSource()
    typeSource.getTypeById(queryString.id)
        .then(type => {
            if (type) {
                typeSource.updateType(body)
                    .then(() => response.sendStatus(200))
            } else {
                response.sendStatus(401)
            }
        })
        .catch(_ => response.sendStatus(503))
}

TypeController.prototype.deleteType = (request, response) => {
    const typeSource = new TypeSource()
    const id = request.params.id
    typeSource.getTypeById(id)
        .then(type => {
            if (type) {
                typeSource.deleteType(id)
                    .then(() => response.sendStatus(204))
            } else {
                response.sendStatus(401)
            }
        })
        .catch(_ => response.sendStatus(503))
}

module.exports = TypeController