const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('Place types API', () => {

    describe('Read', () => {
        it('Should not get any type when given type_id which not exists', () => {
            chai.request(server)
                .get(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
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
                .send(JSON.stringify(SAMPLE_INSERT_TYPE[0]))
                .end((_, response) => {
                    // Then service should return status code 400 (bad request)
                    expect(response).to.have.status(400)
                })
        })
        it('Should not create type and get status 404 when post type_id in queryString', () => {
            chai.request(server)
                .post(`/api/types/${SAMPLE_NOT_EXISTS_TYPE[0]}`)
                .set('content-type', 'application/json')
                .send(SAMPLE_INSERT_TYPE[0])
                .end((_, response) => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                })
        })
        it('Should create place type when post object in correct form', () => {
            var insertTypeId = 0
            chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')
                .send(SAMPLE_INSERT_TYPE[0])
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
                    // Compare type_name (because type_id is auto increment)
                    expect(response.body.type_name).to.be.equal(SAMPLE_INSERT_TYPE[0].type_name)
                })
        })
        it('Should retrieve all place types in data source', () => {
            const agent = chai.request(server)
                .post('/api/types')
                .set('content-type', 'application/json')

            // Given 4 place types in data source
            agent.send(SAMPLE_INSERT_TYPE[0])
                .then(_ => { return agent.send(SAMPLE_INSERT_TYPE[1]) })
                .then(_ => { return agent.send(SAMPLE_INSERT_TYPE[2]) })
                .then(_ => { return agent.send(SAMPLE_INSERT_TYPE[3]) })
                // When retrieve all place types
                .then(_ => { return chai.request(server).get('/api/types') })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // And length should be 4
                    expect(response).to.have.lengthOf(SAMPLE_INSERT_TYPE.length)
                    // Compare types
                    expect(response[0]).to.deep.equal(SAMPLE_INSERT_TYPE[0])
                    expect(response[1]).to.deep.equal(SAMPLE_INSERT_TYPE[1])
                    expect(response[2]).to.deep.equal(SAMPLE_INSERT_TYPE[2])
                    expect(response[3]).to.deep.equal(SAMPLE_INSERT_TYPE[3])
                })
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
        it('Should update type and get status 200 when update type in correct form', () => {
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .send(SAMPLE_INSERT_TYPE[3])
                .then(response => {
                    // And it must created successfully
                    expect(response).to.have.status(201)
                    // When update place type
                    return chai.request(server)
                        .put(`/api/types/${SAMPLE_UPDATE_TYPE.type_id}`)
                        .set('content-type', 'application/json')
                        .send(SAMPLE_UPDATE_TYPE)
                })
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
                })
        })
    })

    describe('Delete', () => {
        it('Should delete type and get status 204 from given type_id', () => {
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .send(SAMPLE_INSERT_TYPE[3])
                .then(response => {
                    // And it must crated successfully
                    expect(response).to.have.status(201)
                    // When delete place type by type_id
                    return chai.request(server)
                        .del(`/api/types/${SAMPLE_INSERT_TYPE[3].type_id}`)
                })
                .then(response => {
                    // Then service should return status code 204 (no content)
                    expect(response).to.have.status(204)
                    // To proof data was deleted, try to query it
                    return chai.request(server)
                        .get(`/api/types/${SAMPLE_INSERT_TYPE[3].type_id}`)
                })
                .then(response => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                })
        })
        it('Should not delete type and get status 404 when type_id is not provided', () => {
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .send(SAMPLE_INSERT_TYPE[3])
                .then(response => {
                    // And it must crated successfully
                    expect(response).to.have.status(201)
                    // When delete place type by not provide type_id
                    return chai.request(server)
                        .del(`/api/types`)
                })
                // Then service should return status code 404 (not found)
                .then(response => expect(response).to.have.status(404))
        })
        it('Should not delete type and get status 401 when given type_id which not exists', () => {
            chai.request(server)
                // Given a place type and add to data source
                .post('/api/types')
                .set('content-type', 'application/json')
                .send(SAMPLE_INSERT_TYPE[3])
                .then(response => {
                    // And it must crated successfully
                    expect(response).to.have.status(201)
                    // When delete place type by type_id which not exists in data source
                    return chai.request(server)
                        .del(`/api/types/${SAMPLE_NOT_EXISTS_TYPE.type_id}`)
                })
                // Then service should return status code 401 (unauthorized)
                .then(response => expect(response).to.have.status(401))
        })
    })
})

// Sample data
const SAMPLE_INSERT_TYPE = [
    { type_id: '77527cb3-4b4c-4557-8dba-fc9fefcf6909', type_name: 'Education' },
    { type_id: '7de84da2-fb05-4191-ac2c-b30951e7d0a5', type_name: 'Department store' },
    { type_id: '771bf245-830a-41a4-b0db-76d72c240f46', type_name: 'Restaurant' },
    { type_id: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4', type_name: 'Relaxation' }
]

const SAMPLE_UPDATE_TYPE = { type_id: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4', type_name: 'Elder care' }
const SAMPLE_NOT_EXISTS_TYPE = { type_id: 'db5b7f1b-7902-4e88-8552-c80f555d5826', type_name: 'Unknown' }