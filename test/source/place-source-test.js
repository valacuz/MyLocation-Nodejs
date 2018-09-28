/* eslint-disable no-unused-expressions */
'use strict'

const expect = require('chai').expect
const PlaceSource = require('./../../model/source/place/sample-place-source')

describe('Sample Place Source', () => {
  beforeEach(() => {
    // Clear all data for each test case.
    const placeSource = new PlaceSource()
    placeSource.clearAll()
  })

  it('Should not found place when place_id is not exists in data source', async () => {
    const placeSource = new PlaceSource()
    // Given one place in data source.
    await placeSource.addPlace(SAMPLE_PLACES[0])
    // When try to find place with non exists place_id.
    const place = await placeSource.getPlaceById('NOT_EXISTS_PLACE_ID')
    // Then place should not be found (undefined).
    expect(place).to.be.undefined
  })

  it('Should not found place when place_id is undefined', async () => {
    const placeSource = new PlaceSource()
    // Given one place in data source.
    await placeSource.addPlace(SAMPLE_PLACES[0])
    // When try to find place with non exists place_id.
    const place = await placeSource.getPlaceById(undefined)
    // Then place should not be found (undefined).
    expect(place).to.be.undefined
  })

  it('Should retrieve place which just added to data source', async () => {
    const placeSource = new PlaceSource()
    // Given one place in data source.
    const newPlace = await placeSource.addPlace(SAMPLE_PLACES[0])
    // When try to find place with newly place_id.
    const place = await placeSource.getPlaceById(newPlace.place_id)
    // Then place should be found and be equal to place which just added.
    expect(place).to.deep.equal(newPlace)
  })

  it('Should retrieve array of places after adding them to data source', async () => {
    const placeSource = new PlaceSource()
    // Given four of places and add to data source.
    await placeSource.addPlace(SAMPLE_PLACES[0])
    await placeSource.addPlace(SAMPLE_PLACES[1])
    await placeSource.addPlace(SAMPLE_PLACES[2])
    await placeSource.addPlace(SAMPLE_PLACES[3])
    // When try to query all places from data source.
    const places = await placeSource.getPlaces(0, 20)
    // Then all places which just added should be found.
    expect(places).to.have.lengthOf(SAMPLE_PLACES.length)
    expect(places[0]).to.deep.equal(SAMPLE_PLACES[0])
    expect(places[1]).to.deep.equal(SAMPLE_PLACES[1])
    expect(places[2]).to.deep.equal(SAMPLE_PLACES[2])
    expect(places[3]).to.deep.equal(SAMPLE_PLACES[3])
  })

  it('Should retrieve array of places by offset and limit', async () => {
    const offset = 1
    const limit = 2
    const placeSource = new PlaceSource()
    // Given four of places and add to data source.
    await placeSource.addPlace(SAMPLE_PLACES[0])
    await placeSource.addPlace(SAMPLE_PLACES[1])
    await placeSource.addPlace(SAMPLE_PLACES[2])
    await placeSource.addPlace(SAMPLE_PLACES[3])
    // When try to query places from data source with offset and limit.
    const places = await placeSource.getPlaces(offset, limit)
    // Then the number of places should be equal to limit.
    expect(places).to.have.lengthOf(limit)
    // And places should be equal to items in data source.
    expect(places[0]).to.deep.equal(SAMPLE_PLACES[0 + offset])
    expect(places[1]).to.deep.equal(SAMPLE_PLACES[1 + offset])
  })

  it('Should update place successfully', async () => {
    const placeSource = new PlaceSource()
    // Given one place in data source.
    const newPlace = await placeSource.addPlace(SAMPLE_PLACES[0])
    // When change some attributes and update in data source
    newPlace.place_name = SAMPLE_PLACES[2].place_name
    newPlace.latitude = SAMPLE_PLACES[2].latitude
    newPlace.longitude = SAMPLE_PLACES[2].longitude
    await placeSource.updatePlace(newPlace)
    // And retrieve place by place_id which just updated from data source.
    const place = await placeSource.getPlaceById(newPlace.place_id)
    // Then place should be found and attributes should be updated.
    expect(place).to.have.property('place_name', SAMPLE_PLACES[2].place_name)
    expect(place).to.have.property('latitude', SAMPLE_PLACES[2].latitude)
    expect(place).to.have.property('longitude', SAMPLE_PLACES[2].longitude)
  })

  it('Should not update place when place_id is not exist in data source', async () => {
    const placeSource = new PlaceSource()
    // Given one place in data source.
    await placeSource.addPlace(SAMPLE_PLACES[0])
    try {
      // When try to update place by place_id which not exists in data source.
      await placeSource.updatePlace(SAMPLE_PLACES[3])
      expect.fail(null, null, 'the error should be thrown.')
    } catch (err) {
      // Then the error should be thrown.
      expect(err).to.be.an('error')
    }
  })

  it('Should delete place successfully and not being retrieved', async () => {
    const placeSource = new PlaceSource()
    // Given one place into data source.
    const newPlace = await placeSource.addPlace(SAMPLE_PLACES[0])
    // When delete place by given place_id.
    await placeSource.deletePlace(newPlace.place_id)
    // Then place should not be retrieved from data source
    const place = await placeSource.getPlaceById(newPlace.place_id)
    expect(place).to.be.undefined
  })

  it('Should not delete place when place_id is not exists in data source', async () => {
    const placeSource = new PlaceSource()
    // Given one place in data source
    await placeSource.addPlace(SAMPLE_PLACES[0])
    try {
      // When try to delete place by place_id which not exists in data source.
      await placeSource.deletePlace('NOT_EXISTS_PLACE_ID')
      expect.fail(null, null, 'the error should be thrown.')
    } catch (err) {
      // Then the error should be thrown.
      expect(err).to.be.an('error')
    }
  })
})

// Sample test data
const SAMPLE_PLACES = [
  {
    place_id: 'A00010001',
    place_name: 'Sample Place 1',
    place_type: 'T0002',
    latitude: 13.001,
    longitude: 100.001,
    starred: false,
    picture_url: null
  },
  {
    place_id: 'A00010002',
    place_name: 'Sample Place 2',
    place_type: 'T0001',
    latitude: 12.100,
    longitude: 99.100,
    starred: true,
    picture_url: 'http://www.shangri-la.com/uploadedImages/Corporate/about-us/our-brands/SL-Our-Brand-Shangri-La-Hotels.jpg'
  },
  {
    place_id: 'A00010003',
    place_name: 'Sample Place 3',
    place_type: 'T0005',
    latitude: 14.1230,
    longitude: 99.24456,
    starred: false,
    picture_url: null
  },
  {
    place_id: 'A00010004',
    place_name: 'Sample Place 4',
    place_type: 'T0001',
    latitude: 12.53945,
    longitude: 101.34644,
    starred: true,
    picture_url: null
  }
]
