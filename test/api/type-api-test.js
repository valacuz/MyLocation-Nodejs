const chai = require('chai')
const chaiHttp = require('chai-http')
const config = require('./../../config/test')
const server = require('./../../app')
const TypeSource = require('./../../model/source/type')

const expect = chai.expect
const timeout = 20000   // 20 Seconds

chai.use(chaiHttp)

describe('Place types API', () => {
    after(() => {
        // Clean up data source before unit test starts
        new TypeSource().clearAll()
    })

    describe('Read', () => {
        it('Should not retrieve any place type and get status 401 when token is omit', () => {
            chai.request(server)
                .get(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not retrieve place type by specific id and get status 401 when token is invalid', () => {
            chai.request(server)
                .get(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .set('authorization', `Bearer ${config.invalidTestToken}`)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not retrieve any place type and get status 401 when token is invalid', () => {
            chai.request(server)
                .get(`/api/types`)
                .set('authorization', `Bearer ${config.invalidTestToken}`)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not retrieve any type when given type_id which not exists', () => {
            chai.request(server)
                .get(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .end((_, response) => expect(response).to.have.status(404))
        })
    })

    describe('Create', () => {
        it('Should not create type and get status 400 when post without content', () => {
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .end((_, response) => expect(response).to.have.status(400))
        })

        it('Should not create type and get status 400 when content type is not application/json', () => {
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'text')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(JSON.stringify(MULTIPLE_INSERT_TYPE[0]))
                .end((_, response) => expect(response).to.have.status(400))
        })

        it('Should not create type and get status 404 when post type_id in queryString', () => {
            chai.request(server)
                .post(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_INSERT_TYPE[0])
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not create place type and get status 401 when token is omit', () => {
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .send(SINGLE_INSERT_TYPE)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not create place type and get status 401 when token is invalid', () => {
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.invalidTestToken}`)
                .send(SINGLE_INSERT_TYPE)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not create place type when user is not allowed to insert record', () => {
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.memberTestToken}`)
                .send(SINGLE_INSERT_TYPE)
                .end((_, response) => expect(response).to.have.status(403))
        })

        it('Should retrieve all place types in data source', (done) => {
            // Given 4 place types in data source
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_INSERT_TYPE[0])
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_TYPE[0].type_id with result type_id
                    MULTIPLE_INSERT_TYPE[0].type_id = response.body.type_id
                    // Insert next item to data source
                    return chai.request(server)
                        .post('/api/types')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_TYPE[1])
                })
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_TYPE[1].type_id with result type_id
                    MULTIPLE_INSERT_TYPE[1].type_id = response.body.type_id
                    // Insert next item to data source
                    return chai.request(server)
                        .post('/api/types')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_TYPE[2])
                })
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_TYPE[2].type_id with result type_id
                    MULTIPLE_INSERT_TYPE[2].type_id = response.body.type_id
                    // Insert next item to data source
                    return chai.request(server)
                        .post('/api/types')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_TYPE[3])
                })
                // When retrieve all place types
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_TYPE[3].type_id with result type_id
                    MULTIPLE_INSERT_TYPE[3].type_id = response.body.type_id
                    // Insert next item to data source
                    return chai.request(server)
                        .get('/api/types')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // And length should be 4 (equals length of MULTIPLE_INSERT_TYPE)
                    const body = response.body
                    expect(body).to.have.lengthOf(MULTIPLE_INSERT_TYPE.length)
                    // Compare types
                    expect(body[0]).to.deep.equal(MULTIPLE_INSERT_TYPE[0])
                    expect(body[1]).to.deep.equal(MULTIPLE_INSERT_TYPE[1])
                    expect(body[2]).to.deep.equal(MULTIPLE_INSERT_TYPE[2])
                    expect(body[3]).to.deep.equal(MULTIPLE_INSERT_TYPE[3])
                    // Mark as completed
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should create place type successfully when post object in correct form', (done) => {
            var insertTypeId    // To store type_id
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(SINGLE_INSERT_TYPE[0])
                .then(response => {
                    // Then service should return status code 201 (Created)
                    expect(response).to.have.status(201)
                    // And header content type should be `application/json`
                    expect(response).to.be.json
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // And header field `location` should return id
                    expect(response).to.have.header('location', `/types/${insertTypeId}`)
                    // To proof data was stored, try to query it
                    return chai.request(server)
                        .get(`/api/types/${insertTypeId}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // Compare by deep equal to traverse the objects and compare nested properties
                    expect(response.body).to.deep.equal({
                        type_id: insertTypeId,
                        type_name: SINGLE_INSERT_TYPE[0].type_name
                    })
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)
    })

    describe('Update', () => {
        it('Should not update type and get status 404 when query string is not provided', () => {
            chai.request(server)
                .put('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_TYPE)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not update type and get status 400 when query string and object type_id is not same', () => {
            chai.request(server)
                .put(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_TYPE)
                .end((_, response) => expect(response).to.have.status(400))
        })

        it('Should not update type and get status 404 when type_id is not exists in data source', () => {
            chai.request(server)
                .put(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(SAMPLE_NOT_EXISTS_TYPE)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not update type and get status 401 when token is omit', (done) => {
            var insertTypeId    // To store type_id
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_TYPE[0])
                .then(response => {
                    // And it must created successfully
                    expect(response).to.have.status(201)
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // When update place type
                    return chai.request(server)
                        .put(`/api/types/${insertTypeId}`)
                        .set('content-type', 'application/json')
                        .send({
                            type_id: insertTypeId,
                            type_name: AFTER_UPDATE_TYPE[0].type_name
                        })
                })
                .then(response => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should not update type and get status 401 when token is invalid', (done) => {
            var insertTypeId    // To store type_id
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_TYPE[1])
                .then(response => {
                    // And it must created successfully
                    expect(response).to.have.status(201)
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // When update place type
                    return chai.request(server)
                        .put(`/api/types/${insertTypeId}`)
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.invalidTestToken}`)
                        .send({
                            type_id: insertTypeId,
                            type_name: AFTER_UPDATE_TYPE[1].type_name
                        })
                })
                .then(response => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should not update type when user is not allowed to update records', (done) => {
            var insertTypeId    // To store type_id
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_TYPE[2])
                .then(response => {
                    // And it must created successfully
                    expect(response).to.have.status(201)
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // When update place type
                    return chai.request(server)
                        .put(`/api/types/${insertTypeId}`)
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.memberTestToken}`)
                        .send({
                            type_id: insertTypeId,
                            type_name: AFTER_UPDATE_TYPE[2].type_name
                        })
                })
                .then(response => {
                    // Then service should return status code 403 (forbidden)
                    expect(response).to.have.status(403)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should update type successfully when update type in correct form', (done) => {
            var insertTypeId    // To store type_id
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_TYPE[3])
                .then(response => {
                    // And it must created successfully
                    expect(response).to.have.status(201)
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // When update place type
                    return chai.request(server)
                        .put(`/api/types/${insertTypeId}`)
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send({
                            type_id: insertTypeId,
                            type_name: AFTER_UPDATE_TYPE[3].type_name
                        })
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // To proof data was updated, try to query it
                    return chai.request(server)
                        .get(`/api/types/${insertTypeId}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And header should be `application/json`
                    expect(response).to.be.json
                    // Compare by deep equal to traverse the objects and compare nested properties
                    expect(response.body).to.deep.equal({
                        type_id: insertTypeId,
                        type_name: AFTER_UPDATE_TYPE[3].type_name
                    })
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)
    })

    describe('Delete', () => {
        it('Should not delete type and get status 404 when type_id is not provided', () => {
            chai.request(server)
                // When delete place type by not provide type_id
                .del('/api/types')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                // Then service should return status code 404 (not found)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not delete type and get status 404 when given type_id which not exists', () => {
            chai.request(server)
                // When delete place type by type_id which not exists in data source
                .del(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .set('authorization', `Bearer ${config.adminTestToken}`)
                // Then service should return status code 404 (unauthorized)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not delete type and get status 401 when token is omit', (done) => {
            var insertTypeId    // To store insert id
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_DELETE_TYPE[0])
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // When delete place type by type_id without token
                    return chai.request(server)
                        .del(`/api/types/${insertTypeId}`)
                })
                .then(response => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should not delete type and get status 401 when token is invalid', (done) => {
            var insertTypeId    // To store insert id
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_DELETE_TYPE[1])
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // When delete place type by type_id without token
                    return chai.request(server)
                        .del(`/api/types/${insertTypeId}`)
                        .set('authorization', `Bearer ${config.invalidTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should not delete type when user is not allowed to delete records', (done) => {
            var insertTypeId    // To store insert id
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_DELETE_TYPE[2])
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // When delete place type by type_id without token
                    return chai.request(server)
                        .del(`/api/types/${insertTypeId}`)
                        .set('authorization', `Bearer ${config.memberTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 403 (forbidden)
                    expect(response).to.have.status(403)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should delete type successfully from given type_id', (done) => {
            var insertTypeId    // To store insert id
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_DELETE_TYPE[3])
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // Store type_id from response to variable
                    insertTypeId = response.body.type_id
                    // When delete place type by type_id
                    return chai.request(server)
                        .del(`/api/types/${insertTypeId}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 204 (no content)
                    expect(response).to.have.status(204)
                    // To proof data was deleted, try to query it
                    return chai.request(server)
                        .get(`/api/types/${insertTypeId}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)
    })
})

// Sample data
const SINGLE_INSERT_TYPE = [
    { type_name: 'Bakery' },
    { type_name: 'Opera House' }
]
const MULTIPLE_INSERT_TYPE = [
    { type_name: 'Education' },
    { type_name: 'Department store' },
    { type_name: 'Restaurant' },
    { type_name: 'Relaxation' }
]
const BEFORE_UPDATE_TYPE = [
    { type_name: 'Park' },
    { type_name: 'Elder care' },
    { type_name: 'Children care' },
    { type_name: 'Airport' }
]
const AFTER_UPDATE_TYPE = [
    { type_name: 'Laboratory' },
    { type_name: 'Museum' },
    { type_name: 'Bank' },
    { type_name: 'Laundry' }
]
const MULTIPLE_DELETE_TYPE = [
    { type_name: 'Library' },
    { type_name: 'Pharmacy' },
    { type_name: 'Dentist' },
    { type_name: 'Embassy' }
]
const SAMPLE_NOT_EXISTS_TYPE = {
    type_id: 'db5b7f1b-7902-4e88-8552-c80f555d5826', type_name: 'Unknown'
}