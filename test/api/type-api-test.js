const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('Place types API', () => {

    describe('Read', () => {
        it('Should get all place types', () => {
            chai.request(server)
                .get('/api/types')
                .end((_, response) => {
                    // Status code should be 200 (OK)
                    expect(response).to.have.status(200)
                    // And header should be `application/json`
                    expect(response).to.be.json
                    // And return as JSON array with length of 5
                    const body = response.body
                    expect(body).to.be.an('array')
                    expect(body).has.lengthOf(4)
                    // First item
                    const firstItem = body[0]
                    expect(firstItem).to.deep.equal(SAMPLE_TYPE[0])
                    // Last item
                    const lastItem = body[body.length - 1]
                    expect(lastItem).to.deep.equal(SAMPLE_TYPE[SAMPLE_TYPE.length - 1])
                })
        })
        it('Should get type from given type_id', () => {
            chai.request(server)
                .get(`/api/types/${SAMPLE_TYPE[0].type_id}`)
                .end((_, response) => {
                    // Then service should return status code 200
                    expect(response).to.have.status(200)
                    // And header should be `application/json`
                    expect(response).to.be.json
                    // And return as JSON object
                    const body = response.body
                    expect(body).to.be.an('object')
                    // Verify values
                    expect(body).to.deep.equal(SAMPLE_TYPE[0])
                })
        })
        it('Should not get any type when given type_id which not exists', () => {
            chai.request(server)
                .get('/api/types/10001')
                .end((_, response) => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                })
        })
    })

    describe('Create', () => {
        it('Should not create type and get status 400 when post with no body', () => {
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .end((_, response) => {
                    // Then service should return status code 400 (bad request)
                    expect(response).to.have.status(400)
                })
        })
        it('Should not create type and get status 400 when content type is not application/json', () => {
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'text')
                .send(JSON.stringify(SAMPLE_INSERT_TYPE))
                .end((_, response) => {
                    // Then service should return status code 400 (bad request)
                    expect(response).to.have.status(400)
                })
        })
        it('Should not create type and get status 404 when post type_id in queryString', () => {
            chai.request(server)
                .post(`/api/types/${SAMPLE_NOT_EXISTS_TYPE[0]}`)
                .set('content-type', 'application/json')
                .send(SAMPLE_INSERT_TYPE)
                .end((_, response) => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                })
        })
        it('Should create type and get status 201 when post object in correct form', (done) => {
            var insertTypeId = 0
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .send(SAMPLE_INSERT_TYPE)
                .then(response => {
                    // Then service should return status code 201 (Created)
                    expect(response).to.have.status(201)
                    // And header content type should be `application/json`
                    expect(response).to.be.json
                    // Get latest type_id from insertion
                    insertTypeId = response.body.type_id
                    // To proof data was stored, try to query it
                    return chai.request(server)
                        .get(`/api/types/${insertTypeId}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // And return as 
                    const body = response.body
                    expect(body).to.be.an('object')
                    // Compare type_name (because type_id is auto increment)
                    expect(body.type_name).to.be.equal(SAMPLE_INSERT_TYPE.type_name)
                    // Mark as completed
                    done()
                })
                .catch(err => done(err))
        })
    })

    describe('Update', () => {
        it('Should not update type and return status 404 when queryString is not provided', () => {
            chai.request(server)
                .put('/api/places')
                .set('content-type', 'application/json')
                .send(SAMPLE_UPDATE_TYPE)
                .end((_, response) => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                })
        })
        it('Should not update type and get status 400 when queryString and object type_id is not same', () => {
            chai.request(server)
                .put(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .set('content-type', 'application/json')
                .send(SAMPLE_UPDATE_TYPE)
                .end((_, response) => {
                    // Then service should return status code 400 (bad request)
                    expect(response).to.have.status(400)
                })
        })
        it('Should not update type and get status 401 when type_id is not exists in data source', () => {
            chai.request(server)
                .put(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .set('content-type', 'application/json')
                .send(SAMPLE_NOT_EXISTS_TYPE)
                .end((_, response) => {
                    // Then service should retrun status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                })
        })
        it('Should update type and get status 200 when update type in correct form', (done) => {
            chai.request(server)
                .put(`/api/types/${SAMPLE_UPDATE_TYPE.type_id}`)
                .set('content-type', 'application/json')
                .send(SAMPLE_UPDATE_TYPE)
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // To proof data was updated, try to query it
                    return chai.request(server)
                        .get(`/api/types/${SAMPLE_UPDATE_TYPE.type_id}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And header should be `application/json`
                    expect(response).to.be.json
                    // And return as JSON object
                    const body = response.body
                    expect(body).to.be.an('object')
                    // Compare by deep equal to traverse the objects and compare nested properties
                    expect(body).to.deep.equal(SAMPLE_UPDATE_TYPE)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        })
    })

    describe('Delete', () => {
        it('Should delete type and get status 204 from given type_id', (done) => {
            chai.request(server)
                .del(`/api/types/${SAMPLE_UPDATE_TYPE.type_id}`)
                .then(response => {
                    // Then service should return status code 204 (no content)
                    expect(response).to.have.status(204)
                    // To proof data was deleted, try to query it
                    return chai.request(server)
                        .get(`/api/types/${SAMPLE_UPDATE_TYPE.type_id}`)
                })
                .then(response => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        })
        it('Should not delete type and get status 404 when type_id is not provided', () => {
            chai.request(server)
                .del('/api/types')
                .end((_, response) => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                })
        })
        it('Should not delete type and get status 401 when given type_id which not exists', () => {
            chai.request(server)
                .del(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                .end((_, response) => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                })
        })
    })
})

// Sample data
const SAMPLE_TYPE = [
    { type_id: 1, type_name: 'Education' },
    { type_id: 2, type_name: 'Department store' },
    { type_id: 3, type_name: 'Restaurant' },
    { type_id: 4, type_name: 'Relaxation' }
]

const SAMPLE_INSERT_TYPE = { type_id: 5, type_name: 'Hospital' }
const SAMPLE_UPDATE_TYPE = { type_id: 4, type_name: 'Elder care' }
const SAMPLE_NOT_EXISTS_TYPE = { type_id: 10002, type_name: 'Unknown' }