const TypeSource = require('./../../model/source/type')
const UserSource = require('./../../model/source/user')
const Validator = require('./../../model/validator')

const CONTENT_TYPE_JSON = 'application/json'
const userSource = new UserSource()
const typeSource = new TypeSource()

const TypeController = function () { }

TypeController.prototype.getTypes = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized.
                response.sendStatus(401)
                return
            }
            typeSource.getTypes()
                .then(types => response.json(types))
        })
        .catch(_ => response.sendStatus(503))
}

TypeController.prototype.getTypeById = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized.
                response.sendStatus(401)
                return
            }
            typeSource.getTypeById(request.params.id)
                .then(type => {
                    if (type) {
                        response.json(type)
                    } else {
                        response.sendStatus(404)
                    }
                })
        })
        .catch(_ => response.sendStatus(503))
}

TypeController.prototype.addType = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized.
                response.sendStatus(401)
                return
            } else if (!user.can_insert) {
                // If user found but not allowed to insert records, response forbidden.
                response.sendStatus(403)
                return
            }
            const body = request.body
            const contentType = request.headers['content-type']
            const result = new Validator().validatePlaceType(body)

            // If object is invalid form, return 400 (Bad request)
            if (contentType != CONTENT_TYPE_JSON || result.error) {
                response.sendStatus(400)
                return
            }
            // Otherwise, add type to data source
            typeSource.addType(body)
                .then(newType => {
                    response.status(201)
                        .location(`/types/${newType.type_id}`)
                        .contentType(CONTENT_TYPE_JSON)
                        .send(newType)
                })
        })
        .catch(_ => sendStatus(503))
}

TypeController.prototype.updateType = (request, response) => {
    const payload = request.payload
    userSource.checkUser(payload.user, payload.password)
        .then(user => {
            if (!user) {
                // If user not found, response unauthorized.
                response.sendStatus(401)
                return
            } else if (!user.can_update) {
                // If user found but not allowed to insert records, response forbidden.
                response.sendStatus(403)
                return
            }
            // If type_id from body and type_id from query string is not the same, reject.
            const body = request.body
            const contentType = request.headers['content-type']
            const queryString = request.params
            const result = new Validator().validatePlaceType(body)

            if (queryString.id != body.type_id || contentType != CONTENT_TYPE_JSON || result.error) {
                response.sendStatus(400)
                return
            }
            // Try to find place type by id.
            typeSource.getTypeById(queryString.id)
                .then(type => {
                    if (type) {
                        // When place type was found, update it.
                        typeSource.updateType(body)
                            .then(() => response.sendStatus(200))
                    } else {
                        // otherwise, response not found.
                        response.sendStatus(404)
                    }
                })
        })
        .catch(_ => response.sendStatus(503))
}

TypeController.prototype.deleteType = (request, response) => {
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
            // Try to find place type by id.
            const id = request.params.id
            typeSource.getTypeById(id)
                .then(type => {
                    if (type) {
                        // When place type was found, delete it.
                        typeSource.deleteType(id)
                            .then(() => response.sendStatus(204))
                    } else {
                        // otherwise, response not found.
                        response.sendStatus(404)
                    }
                })
        })
        .catch(_ => response.sendStatus(503))
}

module.exports = TypeController