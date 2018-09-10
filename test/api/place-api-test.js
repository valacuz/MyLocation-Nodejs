const chai = require('chai')
const chaiHttp = require('chai-http')
const config = require('./../../config/test')
const server = require('./../../app')
const PlaceSource = require('./../../model/source/place')

const expect = chai.expect
const timeout = 20000    // 20 Seconds

chai.use(chaiHttp)

describe('Places API', () => {
    after(() => {
        // Clean up data source before unit test starts
        new PlaceSource().clearAll()
    })

    describe('Read', () => {
        it('Should not retrieve any place and get status 401 when token is omit', () => {
            chai.request(server)
                .get(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not retrieve any place and get status 401 when token is invalid', () => {
            chai.request(server)
                .get(`/api/places`)
                .set('authorization', `Bearer ${config.invalidTestToken}`)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not retrieve place by specific id and get status 401 when token is invalid', () => {
            chai.request(server)
                .get(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .set('authorization', `Bearer ${config.invalidTestToken}`)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not retrieve any place when given place_id which not exists', () => {
            chai.request(server)
                .get(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .end((_, response) => expect(response).to.have.status(404))
        })
    })

    describe('Create', () => {
        it('Should not create place and get status 400 when post without content', () => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .end((_, response) => expect(response).to.have.status(400))
        })

        it('Should not create place and get status 400 when content type is not application/json', () => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'text')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(JSON.stringify(SINGLE_INSERT_PLACE))
                .end((_, response) => expect(response).to.have.status(400))
        })

        it('Should not create place and get status 404 when post with place_id in queryString', () => {
            chai.request(server)
                .post(`/api/places/${SAMPLE_NOT_EXISTS_PLACE[0]}`)
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(SINGLE_INSERT_PLACE)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not create place and get status 401 when token is omit', () => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .send(SINGLE_INSERT_PLACE)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not create place and get status 401 when token is invalid', () => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.invalidTestToken}`)
                .send(SINGLE_INSERT_PLACE)
                .end((_, response) => expect(response).to.have.status(401))
        })

        it('Should not create place when user is not allowed to insert record', () => {
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.memberTestToken}`)
                .send(SINGLE_INSERT_PLACE)
                .end((_, response) => expect(response).to.have.status(403))
        })

        it('Should retrieve all place in data source', (done) => {
            // Clear all current place source
            new PlaceSource().clearAll()
                .then(_ => {
                    // Given 3 place in data source
                    return chai.request(server)
                        .post('/api/places')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_PLACE[0])
                })
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_PLACE[0].place_id with result place_id
                    MULTIPLE_INSERT_PLACE[0].place_id = response.body.place_id
                    // Insert next item to data source
                    return chai.request(server)
                        .post('/api/places')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_PLACE[1])
                })
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_PLACE[1].place_id with result place_id
                    MULTIPLE_INSERT_PLACE[1].place_id = response.body.place_id
                    // Insert next item to data source
                    return chai.request(server)
                        .post('/api/places')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_PLACE[2])
                })
                // When retrieve all places
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_PLACE[2].place_id with result place_id
                    MULTIPLE_INSERT_PLACE[2].place_id = response.body.place_id
                    // Insert next item to data source
                    return chai.request(server)
                        .get('/api/places')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
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
        }).timeout(timeout)

        it('Should retrieve place by offset and limit', (done) => {
            const offset = 1
            const limit = 2

            // Clear all previous places
            new PlaceSource().clearAll()
                .then(_ => {
                    // Given 3 place in data source
                    return chai.request(server)
                        .post('/api/places')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_PLACE[0])
                })
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_PLACE[0].place_id with result place_id
                    MULTIPLE_INSERT_PLACE[0].place_id = response.body.place_id
                    // Insert next item to data source
                    return chai.request(server)
                        .post('/api/places')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_PLACE[1])
                })
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_PLACE[1].place_id with result place_id
                    MULTIPLE_INSERT_PLACE[1].place_id = response.body.place_id
                    // Insert next item to data source
                    return chai.request(server)
                        .post('/api/places')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(MULTIPLE_INSERT_PLACE[2])
                })
                // When retrieve all places
                .then(response => {
                    // Insert or replace MULTIPLE_INSERT_PLACE[2].place_id with result place_id
                    MULTIPLE_INSERT_PLACE[2].place_id = response.body.place_id
                    // Insert next item to data source
                    return chai.request(server)
                        .get(`/api/places?offset=${offset}&limit=${limit}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // And length should be equals to limit
                    const body = response.body
                    expect(body).to.have.lengthOf(2)
                    // Compare places
                    expect(body[0]).to.deep.equal(MULTIPLE_INSERT_PLACE[0 + offset])
                    expect(body[1]).to.deep.equal(MULTIPLE_INSERT_PLACE[1 + offset])
                    // Mark as complete
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should create place successfully when post object in correct form', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(SINGLE_INSERT_PLACE)
                .then(response => {
                    // Then service should return status code 201 (Created)
                    expect(response).to.have.status(201)
                    // And header content type should be `application/json`
                    expect(response).to.be.json
                    // Store place_id from response
                    insertPlaceId = response.body.place_id
                    // And header field `location` should return id
                    expect(response).to.have.header('location', `/places/${insertPlaceId}`)
                    // To proof data was stored, try to query it
                    return chai.request(server)
                        .get(`/api/places/${insertPlaceId}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // And content type should be `application/json`
                    expect(response).to.be.json
                    // Insert or replace place_id with stored place_id
                    SINGLE_INSERT_PLACE.place_id = insertPlaceId
                    // Compare by deep equal to traverse the objects and compare nested properties
                    expect(response.body).to.deep.equal(SINGLE_INSERT_PLACE)
                    // Mark as completed
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)
    })

    describe('Update', () => {
        it('Should not update place and get status 404 when query string is not provided', () => {
            chai.request(server)
                // When try to update place but not provide place_id in query string
                .put('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_PLACE[0])
                // Then service should return status code 404 (not found)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not update place and get status 400 when query string and object place_id is not same', () => {
            chai.request(server)
                .put(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_PLACE[0])
                // Then service should return status code 400 (bad request)
                .end((_, response) => expect(response).to.have.status(400))
        })

        it('Should not update place and get status 404 when place_id is not exists in data source', () => {
            chai.request(server)
                .put(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(SAMPLE_NOT_EXISTS_PLACE)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should update place and get status 401 when token is omit', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_PLACE[0])
                .then(response => {
                    // And it must create successfully.
                    expect(response).to.have.status(201)
                    // Store place_id from response to variable
                    insertPlaceId = response.body.place_id
                    // Insert or replace place_id with variable
                    AFTER_UPDATE_PLACE[0].place_id = insertPlaceId
                    // When update place
                    return chai.request(server)
                        .put(`/api/places/${insertPlaceId}`)
                        .set('content-type', 'application/json')
                        .send(AFTER_UPDATE_PLACE[0])
                })
                .then(response => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should update place and get status 401 when token is invalid', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_PLACE[1])
                .then(response => {
                    // And it must create successfully.
                    expect(response).to.have.status(201)
                    // Store place_id from response to variable
                    insertPlaceId = response.body.place_id
                    // Insert or replace place_id with variable
                    AFTER_UPDATE_PLACE[1].place_id = insertPlaceId
                    // When update place
                    return chai.request(server)
                        .put(`/api/places/${insertPlaceId}`)
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.invalidTestToken}`)
                        .send(AFTER_UPDATE_PLACE[1])
                })
                .then(response => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should not update place when user is not allowed to update records', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_PLACE[2])
                .then(response => {
                    // And it must create successfully.
                    expect(response).to.have.status(201)
                    // Store place_id from response to variable
                    insertPlaceId = response.body.place_id
                    // Insert or replace place_id with variable
                    AFTER_UPDATE_PLACE[2].place_id = insertPlaceId
                    // When update place
                    return chai.request(server)
                        .put(`/api/places/${insertPlaceId}`)
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.memberTestToken}`)
                        .send(AFTER_UPDATE_PLACE[2])
                })
                .then(response => {
                    // Then service should return status code 403 (forbidden)
                    expect(response).to.have.status(403)
                    // Mark as done
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should update place successfully when update place in correct form', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(BEFORE_UPDATE_PLACE[3])
                .then(response => {
                    // And it must create successfully.
                    expect(response).to.have.status(201)
                    // Store place_id from response to variable
                    insertPlaceId = response.body.place_id
                    // Insert or replace place_id with variable
                    AFTER_UPDATE_PLACE[3].place_id = insertPlaceId
                    // When update place
                    return chai.request(server)
                        .put(`/api/places/${insertPlaceId}`)
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                        .send(AFTER_UPDATE_PLACE[3])
                })
                .then(response => {
                    // Then service should return status code 200 (OK)
                    expect(response).to.have.status(200)
                    // To proof data was updated, try to query it
                    return chai.request(server)
                        .get(`/api/places/${insertPlaceId}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
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
                    expect(body).to.deep.equal(AFTER_UPDATE_PLACE[3])
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)
    })

    describe('Delete', () => {
        it('Should not delete place and get status 404 when place_id is not provided', () => {
            chai.request(server)
                // When delete place by not provide place_id
                .del('/api/places')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                // Then service should return status code 404 (not found)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not delete place and get status 404 when given place_id which not exists', () => {
            chai.request(server)
                // When delete place by place_id which not exists in data source
                .del(`/api/places/${SAMPLE_NOT_EXISTS_PLACE.place_id}`)
                .set('authorization', `Bearer ${config.adminTestToken}`)
                // Then service should return status code 401 (unauthorized)
                .end((_, response) => expect(response).to.have.status(404))
        })

        it('Should not delete place and get status 401 when token is omit', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_DELETE_PLACE[0])
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // Store place_id from response to variable
                    insertPlaceId = response.body.place_id
                    // When delete place type by type_id
                    return chai.request(server)
                        .del(`/api/places/${insertPlaceId}`)
                })
                .then(response => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should not delete place and get status 401 when token is invalid', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_DELETE_PLACE[1])
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // Store place_id from response to variable
                    insertPlaceId = response.body.place_id
                    // When delete place type by type_id
                    return chai.request(server)
                        .del(`/api/places/${insertPlaceId}`)
                        .set('authorization', `Bearer ${config.invalidTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 401 (unauthorized)
                    expect(response).to.have.status(401)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should not delete type when user is not allowed to delete records', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_DELETE_PLACE[2])
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // Store place_id from response to variable
                    insertPlaceId = response.body.place_id
                    // When delete place type by type_id
                    return chai.request(server)
                        .del(`/api/places/${insertPlaceId}`)
                        .set('authorization', `Bearer ${config.memberTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 403 (forbidden)
                    expect(response).to.have.status(403)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)

        it('Should delete place successfully from given place_id', (done) => {
            var insertPlaceId   // To store place_id
            chai.request(server)
                // Given a place and add to data source
                .post('/api/places')
                .set('content-type', 'application/json')
                .set('authorization', `Bearer ${config.adminTestToken}`)
                .send(MULTIPLE_DELETE_PLACE[3])
                .then(response => {
                    // And it must create successfully
                    expect(response).to.have.status(201)
                    // Store place_id from response to variable
                    insertPlaceId = response.body.place_id
                    // When delete place type by type_id
                    return chai.request(server)
                        .del(`/api/places/${insertPlaceId}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 204 (no Content)
                    expect(response).to.have.status(204)
                    // To proof data was deleted, try to query it
                    return chai.request(server)
                        .get(`/api/places/${insertPlaceId}`)
                        .set('authorization', `Bearer ${config.adminTestToken}`)
                })
                .then(response => {
                    // Then service should return status code 404 (not found)
                    expect(response).to.have.status(404)
                    // Mark as completed (success)
                    done()
                })
                .catch(err => done(err))
        }).timeout(timeout)
    })
})

// Sample data
const SINGLE_INSERT_PLACE = {
    place_type: '5b77f249e7179a69ea6109ad',
    place_name: 'Wong Wain Yai',
    latitude: 13.7263991,
    longitude: 100.4843742,
    starred: false,
    picture_url: null
}
const MULTIPLE_INSERT_PLACE = [
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'The Berkeley Hotel Pratunam',
        latitude: 13.7401668,
        longitude: 100.5265844,
        starred: false,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Traimudomsuksa',
        latitude: 13.7401668,
        longitude: 100.5265844,
        starred: true,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Redsun siam square',
        latitude: 13.7446608,
        longitude: 100.5304822,
        starred: false,
        picture_url: null
    }
]
const BEFORE_UPDATE_PLACE = [
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Paragon Cineplex',
        latitude: 13.7429416,
        longitude: 100.4196499,
        starred: true,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Central Embassy',
        latitude: 13.7440097,
        longitude: 100.5444194,
        starred: true,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Japan Embassy',
        latitude: 13.7329511,
        longitude: 100.5453437,
        starred: false,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Siriraj Hospital',
        latitude: 13.7601001,
        longitude: 100.4836525,
        starred: true,
        picture_url: null
    }
]
const AFTER_UPDATE_PLACE = [
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Tokyu',
        latitude: 13.7453518,
        longitude: 100.5286679,
        starred: false,
        picture_url: null
    }, {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Grande Centre Point Ploenchit',
        latitude: 13.7438618,
        longitude: 100.5449077,
        starred: false,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'United State of America Embassy',
        latitude: 13.7329511,
        longitude: 100.5453437,
        starred: false,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Thonburi Hospital',
        latitude: 13.7518595,
        longitude: 100.4784564,
        starred: false,
        picture_url: null
    }
]
const MULTIPLE_DELETE_PLACE = [
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Jim Thompson House',
        latitude: 13.7449958,
        longitude: 100.5281137,
        starred: true,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Lumpini Park',
        latitude: 13.7299217,
        longitude: 100.5373432,
        starred: false,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Unicorn cafe',
        latitude: 13.7213491,
        longitude: 100.531209,
        starred: true,
        picture_url: null
    },
    {
        place_type: '5b77f249e7179a69ea6109ad',
        place_name: 'Thai Navi Headquarters',
        latitude: 13.7515151,
        longitude: 100.4797332,
        starred: true,
        picture_url: null
    }
]
const SAMPLE_NOT_EXISTS_PLACE = {
    place_id: '47d6723e-b424-4265-ba1f-3e898341ffaa',
    place_type: '5b77f249e7179a69ea6109ad',
    place_name: 'Central World',
    latitude: 13.7465389,
    longitude: 100.5371731,
    starred: false,
    picture_url: null
}