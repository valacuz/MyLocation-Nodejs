const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('Places API', () => {

    describe('Read', () => {
        it('Should get all places from data source', () => {
            chai.request(server)
                .get('/api/places')
                .end((_, response) => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And header should be `application/json`
                    expect(response).to.be.json
                    // And return as JSON array with length of 4
                    const body = response.body
                    expect(body).to.be.an('array')
                    expect(body).has.lengthOf(4)
                    // First item
                    const firstItem = body[0]
                    expect(firstItem.place_id).to.be.equals('A0000001')
                    expect(firstItem.place_name).to.be.equals('Chulalongkorn university')
                    expect(firstItem.place_type).to.be.equals(1)
                    expect(firstItem.latitude).to.be.equals(13.7419273)
                    expect(firstItem.longitude).to.be.equals(100.5256927)
                    expect(firstItem.starred).to.be.equals(true)
                    expect(firstItem.picture_url).to.have.lengthOf.greaterThan(5)
                    // Last item
                    const lastItem = body[body.length - 1]
                    expect(lastItem.place_id).to.be.equals('A0000004')
                    expect(lastItem.place_name).to.be.equals('Grand china hotel')
                    expect(lastItem.place_type).to.be.equals(4)
                    expect(lastItem.latitude).to.be.equals(13.7423837)
                    expect(lastItem.longitude).to.be.equals(100.5075352)
                    expect(lastItem.starred).to.be.equals(true)
                    expect(lastItem.picture_url).to.have.lengthOf.greaterThan(5)
                })
        })
        it('Should get place from given place_id', () => {
            chai.request(server)
                .get('/api/places/A0000001')
                .end((_, response) => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And header should be `application/json`
                    expect(response).to.be.json
                    // And return as JSON object
                    const body = response.body
                    expect(body).to.be.an('object')
                    // Verify values
                    expect(body.place_id).to.be.equals('A0000001')
                    expect(body.place_name).to.be.equals('Chulalongkorn university')
                    expect(body.place_type).to.be.equals(1)
                    expect(body.latitude).to.be.equals(13.7419273)
                    expect(body.longitude).to.be.equals(100.5256927)
                    expect(body.starred).to.be.equals(true)
                    expect(body.picture_url).to.have.lengthOf.greaterThan(5)
                })
        })
        it('Should not get any place when given place_id which not exists', () => {
            chai.request(server)
                .get('/api/places/ABCDEF')
                .end((_, response) => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                })
        })
    })

    describe('Create', () => {
        it('Should not insert place and get status 400 when post with no body', () => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .end((_, response) => {
                    // Then service should return status code 400 (bad request)
                    expect(response).to.have.status(400)
                })
        })
        it('Should not insert place and get status 400 when content type is not application/json', () => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'text')
                .send(JSON.stringify(SAMPLE_ADD_PLACE))
                .end((_, response) => {
                    // Then service should return status code 400 (bad request)
                    expect(response).to.have.status(400)
                })
        })
        it('Should insert place and get status 201 when post object in correct form', (done) => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .send(SAMPLE_ADD_PLACE)
                .then(response => {
                    // Then service should return status code 201 (Created)
                    expect(response).to.have.status(201)
                    // And header content type should be `application/json`
                    expect(response).to.be.json
                    // And header field `location` should return id
                    expect(response).to.have.header('location', `/places/${SAMPLE_ADD_PLACE.place_id}`)
                    // To proof data was stored, try to query it
                    return chai.request(server)
                        .get(`/api/places/${SAMPLE_ADD_PLACE.place_id}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // And return as JSON object
                    const body = response.body
                    expect(body).to.be.an('object')
                    // Compare by deep equal to traverse the objects and compare nested properties
                    expect(body).to.deep.equal(SAMPLE_ADD_PLACE)
                    // Mark as completed
                    done()
                })
                .catch(err => done(err))
        })
    })

    describe('Update', () => {
        it('Should not update place and get status 404 when queryString is not provided', () => {
            chai.request(server)
                .put('/api/places')
                .set('content-type', 'application/json')
                .send(SAMPLE_UPDATE_PLACE)
                .end((_, response) => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                })
        })
        it('Should not update place and get status 400 when queryString and object place_id is not same', () => {
            chai.request(server)
                .put('/api/places/ABCDEFG')
                .set('content-type', 'application/json')
                .send(SAMPLE_UPDATE_PLACE)
                .end((_, response) => {
                    // Then service should return status code 400 (Bad request)
                    expect(response).to.have.status(400)
                })
        })
        it('Should not update place and get status 401 when place_id is not exists in data source', () => {
            chai.request(server)
                .put(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .set('content-type', 'application/json')
                .send(SAMPLE_NOT_EXISTS_PLACE)
                .end((_, response) => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                })
        })
        it('Should update place and get status 200 when update object in correct form', (done) => {
            chai.request(server)
                .put(`/api/places/${SAMPLE_UPDATE_PLACE.place_id}`)
                .set('content-type', 'application/json')
                .send(SAMPLE_UPDATE_PLACE)
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // To proof data was updated, try to query it
                    return chai.request(server)
                        .get(`/api/places/${SAMPLE_UPDATE_PLACE.place_id}`)
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
                    expect(body).to.deep.equal(SAMPLE_UPDATE_PLACE)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        })
    })

    describe('Delete', () => {
        it('Should delete place and get status 204 from given place_id', (done) => {
            chai.request(server)
                .del('/api/places/A0000001')
                .then(response => {
                    // Then service should return status code 204 (no Content)
                    expect(response).to.have.status(204)
                    // To proof data was deleted, try to query it
                    return chai.request(server)
                        .get('/api/places/A0000001')
                })
                .then(response => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        })
        it('Should not delete place and get status 401 when given place_id which not exists', () => {
            chai.request(server)
                .del('/api/places/ABCDEFG')
                .end((_, response) => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                })
        })
    })
})

// Sample data
const SAMPLE_ADD_PLACE = {
    place_id: '5ba16b74-c959-4243-a790-ed562f55db5d',
    place_type: 4,
    place_name: 'Wong Wain Yai',
    place_latitude: 13.7263991,
    place_longitude: 100.4843742,
    starred: false,
    picture_url: null
}

const SAMPLE_UPDATE_PLACE = {
    place_id: 'A0000001',
    place_type: 2,
    place_name: 'Paragon Cineplex',
    place_latitude: 13.7429416,
    place_longitude: 100.4196499,
    starred: true,
    picture_url: null
}

const SAMPLE_NOT_EXISTS_PLACE = {
    place_id: 'STUVWXYZ',
    place_type: 2,
    place_name: 'Central World',
    place_latitude: 13.7465389,
    place_longitude: 100.5371731,
    starred: false,
    picture_url: null
}