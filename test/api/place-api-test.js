/* eslint-disable no-unused-expressions */
'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const config = require('./../../config/test')
const server = require('./../../app')
const PlaceSource = require('./../../model/source/place')

const expect = chai.expect
const timeout = 15000 // 15 Seconds

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

    it('Should retrieve all place in data source', async () => {
      var response
      // Clear all places in data source
      await new PlaceSource().clearAll()
      // Given 3 places in data source
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_INSERT_PLACE[0])
      // Insert or replace MULTIPLE_INSERT_PLACE[0].place_id with result place_id
      MULTIPLE_INSERT_PLACE[0].place_id = response.body.place_id

      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_INSERT_PLACE[1])
      // Insert or replace MULTIPLE_INSERT_PLACE[1].place_id with result place_id
      MULTIPLE_INSERT_PLACE[1].place_id = response.body.place_id

      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_INSERT_PLACE[2])
      // Insert or replace MULTIPLE_INSERT_PLACE[2].place_id with result place_id
      MULTIPLE_INSERT_PLACE[2].place_id = response.body.place_id

      // When try to retrieve all 3 places from data source
      response = await chai.request(server)
        .get('/api/places')
        .set('authorization', `Bearer ${config.adminTestToken}`)
      // Then service should return status code 200 (OK)
      expect(response).to.have.status(200)
      // And content type should be `application/json`
      expect(response).to.be.json
      // And length should be 3 (equals legnth of MULTIPLE_INSERT_PLACE)
      const body = response.body
      expect(body).to.have.lengthOf(MULTIPLE_INSERT_PLACE.length)
      // Compare all places which retrieved from data source
      // with item which insert into data source
      expect(body[0]).to.deep.equal(MULTIPLE_INSERT_PLACE[0])
      expect(body[1]).to.deep.equal(MULTIPLE_INSERT_PLACE[1])
      expect(body[2]).to.deep.equal(MULTIPLE_INSERT_PLACE[2])
    }).timeout(timeout)

    it('Should retrieve place by offset and limit', async () => {
      const offset = 1
      const limit = 2
      var response
      // Clear all places in data source
      await new PlaceSource().clearAll()
      // Given 3 places in data source
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_INSERT_PLACE[0])
      // Insert or replace MULTIPLE_INSERT_PLACE[0].place_id with result place_id
      MULTIPLE_INSERT_PLACE[0].place_id = response.body.place_id

      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_INSERT_PLACE[1])
      // Insert or replace MULTIPLE_INSERT_PLACE[1].place_id with result place_id
      MULTIPLE_INSERT_PLACE[1].place_id = response.body.place_id

      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_INSERT_PLACE[2])
      // Insert or replace MULTIPLE_INSERT_PLACE[2].place_id with result place_id
      MULTIPLE_INSERT_PLACE[2].place_id = response.body.place_id

      // When try to retrieve all 3 places from data source
      response = await chai.request(server)
        .get(`/api/places?offset=${offset}&limit=${limit}`)
        .set('authorization', `Bearer ${config.adminTestToken}`)
      // Then service should return status code 200 (OK)
      expect(response).to.have.status(200)
      // And content type should be `application/json`
      expect(response).to.be.json
      // And length should be 2 (equals to limit)
      const body = response.body
      expect(body).to.have.lengthOf(2)
      // Compare places which retrieved from data source
      // with item which insert into data source
      expect(body[0]).to.deep.equal(MULTIPLE_INSERT_PLACE[0 + offset])
      expect(body[1]).to.deep.equal(MULTIPLE_INSERT_PLACE[1 + offset])
    }).timeout(timeout)

    it('Should create place successfully when post object in correct form', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(SINGLE_INSERT_PLACE)
      // and it must create successfully.
      expect(response).to.have.status(201)
      var insertPlaceId = response.body.place_id
      SINGLE_INSERT_PLACE.place_id = insertPlaceId
      // and header field `location` should return id
      expect(response).to.have.header('location', `/places/${insertPlaceId}`)
      // When query place with newly place id
      response = await chai.request(server)
        .get(`/api/places/${insertPlaceId}`)
        .set('authorization', `Bearer ${config.adminTestToken}`)
      // Then service should return status code 200 (ok)
      expect(response).to.have.status(200)
      // and content type should be application/json.
      expect(response).to.be.json
      // and retrieve object should deep equals to insertion object.
      expect(response.body).to.deep.equal(SINGLE_INSERT_PLACE)
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

    it('Should update place and get status 401 when token is omit', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(BEFORE_UPDATE_PLACE[0])
      // and it must create successfully.
      expect(response).to.have.status(201)
      AFTER_UPDATE_PLACE[0].place_id = response.body.place_id
      // when delete place by place_id.
      response = await chai.request(server)
        .put(`/api/places/${AFTER_UPDATE_PLACE[0].place_id}`)
        .set('content-type', 'application/json')
        .send(AFTER_UPDATE_PLACE[0])
      // then service should return status code 401 (unauthorized).
      expect(response).to.have.status(401)
    }).timeout(timeout)

    it('Should update place and get status 401 when token is invalid', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(BEFORE_UPDATE_PLACE[1])
      // and it must create successfully.
      expect(response).to.have.status(201)
      AFTER_UPDATE_PLACE[1].place_id = response.body.place_id
      // when delete place by place_id.
      response = await chai.request(server)
        .put(`/api/places/${AFTER_UPDATE_PLACE[1].place_id}`)
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.invalidTestToken}`)
        .send(AFTER_UPDATE_PLACE[1])
      // then service should return status code 401 (unauthorized).
      expect(response).to.have.status(401)
    }).timeout(timeout)

    it('Should not update place when user is not allowed to update records', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(BEFORE_UPDATE_PLACE[2])
      // and it must create successfully.
      expect(response).to.have.status(201)
      AFTER_UPDATE_PLACE[2].place_id = response.body.place_id
      // when delete place by place_id.
      response = await chai.request(server)
        .put(`/api/places/${AFTER_UPDATE_PLACE[2].place_id}`)
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.memberTestToken}`)
        .send(AFTER_UPDATE_PLACE[2])
      // then service should return status code 403 (forbidden).
      expect(response).to.have.status(403)
    }).timeout(timeout)

    it('Should update place successfully when update place in correct form', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(BEFORE_UPDATE_PLACE[3])
      // and it must create successfully.
      expect(response).to.have.status(201)
      AFTER_UPDATE_PLACE[3].place_id = response.body.place_id
      // when delete place by place_id.
      response = await chai.request(server)
        .put(`/api/places/${AFTER_UPDATE_PLACE[3].place_id}`)
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(AFTER_UPDATE_PLACE[3])
      // then service should return status code 200 (ok).
      expect(response).to.have.status(200)
      // to proof data was updated, query it.
      response = await chai.request(server)
        .get(`/api/places/${AFTER_UPDATE_PLACE[3].place_id}`)
        .set('authorization', `Bearer ${config.adminTestToken}`)
      // service should return status code 200 (OK)
      expect(response).to.have.status(200)
      // and header should be `application/json`
      expect(response).to.be.json
      // and retrieve object should deep equals to insertion object.
      expect(response.body).to.deep.equal(AFTER_UPDATE_PLACE[3])
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

    it('Should not delete place and get status 401 when token is omit', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_DELETE_PLACE[0])
      // and it must create successfully.
      expect(response).to.have.status(201)
      var insertPlaceId = response.body.place_id
      // when delete place by place_id.
      response = await chai.request(server)
        .del(`/api/places/${insertPlaceId}`)
      // then service should return status code 401 (unauthorized)
      expect(response).to.have.status(401)
    }).timeout(timeout)

    it('Should not delete place and get status 401 when token is invalid', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_DELETE_PLACE[1])
      // and it must create successfully.
      expect(response).to.have.status(201)
      var insertPlaceId = response.body.place_id
      // when delete place by place_id.
      response = await chai.request(server)
        .del(`/api/places/${insertPlaceId}`)
        .set('authorization', `Bearer ${config.invalidTestToken}`)
      // then service should return status code 401 (unauthorized)
      expect(response).to.have.status(401)
    }).timeout(timeout)

    it('Should not delete type when user is not allowed to delete records', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_DELETE_PLACE[2])
      // and it must create successfully.
      expect(response).to.have.status(201)
      var insertPlaceId = response.body.place_id
      // when delete place by place_id.
      response = await chai.request(server)
        .del(`/api/places/${insertPlaceId}`)
        .set('authorization', `Bearer ${config.memberTestToken}`)
      // then service should return status code 403 (forbidden)
      expect(response).to.have.status(403)
    }).timeout(timeout)

    it('Should delete place successfully from given place_id', async () => {
      var response
      // Given a place and add to data source.
      response = await chai.request(server)
        .post('/api/places')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${config.adminTestToken}`)
        .send(MULTIPLE_DELETE_PLACE[3])
      // and it must create successfully.
      expect(response).to.have.status(201)
      var insertPlaceId = response.body.place_id
      // when delete place by place_id.
      response = await chai.request(server)
        .del(`/api/places/${insertPlaceId}`)
        .set('authorization', `Bearer ${config.adminTestToken}`)
      // then service should return status code 204 (no content)
      expect(response).to.have.status(204)
      // to proof data was deleted, query it
      response = await chai.request(server)
        .get(`/api/places/${insertPlaceId}`)
        .set('authorization', `Bearer ${config.adminTestToken}`)
      // the service should return status code 404 (not found)
      expect(response).to.have.status(404)
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
