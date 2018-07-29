const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('Places API', () => {

    describe('Read', () => {
        it('Should not get any place when given place_id which not exists', () => {
            chai.request(server)
                // When get place with not exists place_id
                .get(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                // Then service should return status code 404 (not found)
                .end((_, response) => expect(response).to.have.status(404))
        })
    })

    describe('Create', () => {
        it('Should not create place and get status 400 when post with no body', () => {
            chai.request(server)
                // When try to create place with no body
                .post('/api/places')
                .set('content-type', 'application/json')
                // Then service should return status code 400 (bad request)
                .end((_, response) => expect(response).to.have.status(400))
        })
        it('Should not create place and get status 400 when content type is not application/json', () => {
            chai.request(server)
                // When try to create place with json string
                .post('/api/places')
                .set('content-type', 'text')
                .send(JSON.stringify(SINGLE_INSERT_PLACE))
                // Then service should return status code 400 (bad request)
                .end((_, response) => expect(response).to.have.status(400))
        })
        it('Should not create place and get status 404 when post with place_id in queryString', () => {
            chai.request(server)
                // When try to create place at wrong url
                .post(`/api/places/${SAMPLE_NOT_EXISTS_PLACE[0]}`)
                .set('content-type', 'application/json')
                .send(SINGLE_INSERT_PLACE)
                // Then service should return status code 404 (not found)
                .end((_, response) => expect(response).to.have.status(404))
        })
        it('Should retrieve all place in data source', (done) => {
            // Given 3 place in data source
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .send(MULTIPLE_INSERT_PLACE[0])
                .then(_ => {
                    return chai.request(server)
                        .post('/api/places')
                        .set('content-type', 'application/json')
                        .send(MULTIPLE_INSERT_PLACE[1])
                })
                .then(_ => {
                    return chai.request(server)
                        .post('/api/places')
                        .set('content-type', 'application/json')
                        .send(MULTIPLE_INSERT_PLACE[2])
                })
                // When retrieve all places
                .then(_ => { return chai.request(server).get('/api/places') })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // And length should be 3 (equals legnth of MULTIPLE_INSERT_PLACE)
                    const body = response.body
                    expect(body).to.have.lengthOf(MULTIPLE_INSERT_PLACE.length)
                    // Compare places
                    expect(body[0]).to.deep.equal(MULTIPLE_INSERT_PLACE[0])
                    expect(body[1]).to.deep.equal(MULTIPLE_INSERT_PLACE[1])
                    expect(body[2]).to.deep.equal(MULTIPLE_INSERT_PLACE[2])
                    // Mark as complete
                    done()
                })
                .catch(err => done(err))
        })
        it('Should create place and get status 201 when post object in correct form', (done) => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .send(SINGLE_INSERT_PLACE)
                .then(response => {
                    // Then service should return status code 201 (Created)
                    expect(response).to.have.status(201)
                    // And header content type should be `application/json`
                    expect(response).to.be.json
                    // And header field `location` should return id
                    expect(response).to.have.header('location', `/places/${SINGLE_INSERT_PLACE.place_id}`)
                    // To proof data was stored, try to query it
                    return chai.request(server)
                        .get(`/api/places/${SINGLE_INSERT_PLACE.place_id}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // Compare by deep equal to traverse the objects and compare nested properties
                    expect(response.body).to.deep.equal(SINGLE_INSERT_PLACE)
                    // Mark as completed
                    done()
                })
                .catch(err => done(err))
        })
    })

    describe('Update', () => {
        it('Should not update place and get status 404 when query string is not provided', () => {
            chai.request(server)
                // When try to update place but not provide place_id in query string
                .put('/api/places')
                .set('content-type', 'application/json')
                .send(BEFORE_UPDATE_PLACE)
                // Then service should return status code 404 (not found)
                .end((_, response) => expect(response).to.have.status(404))
        })
        it('Should not update place and get status 400 when query string and object place_id is not same', () => {
            chai.request(server)
                .put(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .set('content-type', 'application/json')
                .send(BEFORE_UPDATE_PLACE)
                // Then service should return status code 400 (bad request)
                .end((_, response) => expect(response).to.have.status(400))
        })
        it('Should not update place and get status 401 when place_id is not exists in data source', () => {
            chai.request(server)
                .put(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .set('content-type', 'application/json')
                .send(SAMPLE_NOT_EXISTS_PLACE)
                // Then service should return status code 401 (unauthorized)
                .end((_, response) => expect(response).to.have.status(401))
        })
        it('Should update place and get status 200 when update object in correct form', (done) => {
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .send(BEFORE_UPDATE_PLACE)
                .then(response => {
                    // And it must create successfully.
                    expect(response).to.have.status(201)
                    // When update place
                    return chai.request(server)
                        .put(`/api/places/${AFTER_UPDATE_PLACE.place_id}`)
                        .set('content-type', 'application/json')
                        .send(AFTER_UPDATE_PLACE)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // To proof data was updated, try to query it
                    return chai.request(server)
                        .get(`/api/places/${AFTER_UPDATE_PLACE.place_id}`)
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
                    expect(body).to.deep.equal(AFTER_UPDATE_PLACE)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        })
    })

    describe('Delete', () => {
        it('Should delete place and get status 204 from given place_id', (done) => {
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .send(SINGLE_DELETE_PLACE)
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // When delete place type by type_id
                    return chai.request(server)
                        .del(`/api/places/${SINGLE_DELETE_PLACE.place_id}`)
                })
                .then(response => {
                    // Then service should return status code 204 (no Content)
                    expect(response).to.have.status(204)
                    // To proof data was deleted, try to query it
                    return chai.request(server)
                        .get(`/api/places/${SINGLE_DELETE_PLACE.place_id}`)
                })
                .then(response => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        })
        it('Should not delete place and get status 404 when place_id is not provided', () => {
            chai.request(server)
                // When delete place by not provide place_id
                .del('/api/places')
                // Then service should return status code 404 (not found)
                .end((_, response) => expect(response).to.have.status(404))
        })
        it('Should not delete place and get status 401 when given place_id which not exists', () => {
            chai.request(server)
                // When delete place by place_id which not exists in data source
                .del(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                // Then service should return status code 401 (unauthorized)
                .end((_, response) => expect(response).to.have.status(401))
        })
    })
})

// Sample data
const SINGLE_INSERT_PLACE = {
    place_id: 'db5b7f1b-7902-4e88-8552-c80f555d5826',
    place_type: '771bf245-830a-41a4-b0db-76d72c240f46',
    place_name: 'Wong Wain Yai',
    place_latitude: 13.7263991,
    place_longitude: 100.4843742,
    starred: false,
    picture_url: null
}
const MULTIPLE_INSERT_PLACE = [
    {
        place_id: 'aea9e4a1-efa5-478c-9fe2-4f3a6608225f',
        place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
        place_name: 'The Berkeley Hotel Pratunam',
        place_latitude: 13.7401668,
        place_longitude: 100.5265844,
        starred: false,
        picture_url: null
    },
    {
        place_id: '31e0bfd8-0aa5-4287-821b-4fc3de7fc999',
        place_type: '77527cb3-4b4c-4557-8dba-fc9fefcf6909',
        place_name: 'Traimudomsuksa',
        place_latitude: 13.7401668,
        place_longitude: 100.5265844,
        starred: true,
        picture_url: null
    },
    {
        place_id: '6debce55-fd7a-40e8-9d18-a450a1e9f79d',
        place_type: '771bf245-830a-41a4-b0db-76d72c240f46',
        place_name: 'Redsun siam square',
        place_latitude: 13.7446608,
        place_longitude: 100.5304822,
        starred: false,
        picture_url: null
    }
]

const BEFORE_UPDATE_PLACE = {
    place_id: '60136c9c-c000-4506-bc5c-f35d6d0d6de6',
    place_type: '7de84da2-fb05-4191-ac2c-b30951e7d0a5',
    place_name: 'Paragon Cineplex',
    place_latitude: 13.7429416,
    place_longitude: 100.4196499,
    starred: true,
    picture_url: null
}
const AFTER_UPDATE_PLACE = {
    place_id: '60136c9c-c000-4506-bc5c-f35d6d0d6de6',
    place_type: '7de84da2-fb05-4191-ac2c-b30951e7d0a5',
    place_name: 'Tokyu',
    place_latitude: 13.7453518,
    place_longitude: 100.5286679,
    starred: false,
    picture_url: null
}

const SINGLE_DELETE_PLACE = {
    place_id: '9e97c582-b96b-4f05-810e-d13dfdaf64bd',
    place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
    place_name: 'Jim Thompson House',
    place_latitude: 13.7449958,
    place_longitude: 100.5281137,
    starred: true,
    picture_url: null
}
const SAMPLE_NOT_EXISTS_PLACE = {
    place_id: '47d6723e-b424-4265-ba1f-3e898341ffaa',
    place_type: '7de84da2-fb05-4191-ac2c-b30951e7d0a5',
    place_name: 'Central World',
    place_latitude: 13.7465389,
    place_longitude: 100.5371731,
    starred: false,
    picture_url: null
}