const expect = require('chai').expect
const PlaceSource = require('./../../../model/source/place/sample-place-source')

describe('PlaceSource', () => {

    beforeEach(() => {
        // Clear all data for each test case.
        const placeSource = new PlaceSource()
        placeSource.clearAll()
    })

    it('retrieve place by place_id which not exists should be error', () => {
        const placeSource = new PlaceSource()
        // Given place_id which not match any rows in data source
        placeSource.getPlaceById('ABCDEF')
            // Then place must be undefined (not found)
            .then(place => expect(place).to.be.undefined)
    })

    it('Should be error when get place by undefined place_id', () => {
        const placeSource = new PlaceSource()
        // Given undefined as place_id
        placeSource.getPlaceById(undefined)
            // Then place must be undefined (not found)
            .then(place => expect(place).to.be.undefined)
    })

    it('Should retrieve place which just added to data source', () => {
        const placeSource = new PlaceSource()
        // Given new place and add to data source
        placeSource.addPlace(SAMPLE_PLACE[0])
            // When find place by fresh place_id
            .then(place => placeSource.getPlaceById(place.place_id))
            // Then the place should be retrieved from data source
            .then(retrievePlace => expect(retrievePlace).to.deep.equal(SAMPLE_PLACE[0]))
    })

    it('Should retrieve both two places after added them to data source', () => {
        const placeSource = new PlaceSource()
        // Given 2 new place to data source
        placeSource.addPlace(SAMPLE_PLACE[0])
            .then(_ => placeSource.addPlace(SAMPLE_PLACE[1]))
            // When retrieve all places from data source
            .then(_ => placeSource.getPlaces())
            // Then the number of places should be 2
            .then(places => {
                expect(places).to.have.lengthOf(2)
                // All retrieved places must be equals to items add to data source
                expect(places[0]).to.deep.equal(SAMPLE_PLACE[0])
                expect(places[1]).to.deep.equal(SAMPLE_PLACE[1])
            })
    })

    it('Should retrieve place by offset and limit', () => {
        const placeSource = new PlaceSource()
        // Given 2 new place to data source
        placeSource.addPlace(SAMPLE_PLACE[0])
            .then(_ => placeSource.addPlace(SAMPLE_PLACE[1]))
            .then(_ => placeSource.addPlace(SAMPLE_PLACE[2]))
            .then(_ => placeSource.addPlace(SAMPLE_PLACE[3]))
            // When retrieve place from data source by offset is 1 and limit is 2
            .then(_ => placeSource.getPlacesWithOffset(1, 2))
            // Then the number of places should be 2
            .then(places => {
                expect(places).to.have.lengthOf(2)
                expect(places[0]).to.deep.equal(SAMPLE_PLACE[1])
                expect(places[1]).to.deep.equal(SAMPLE_PLACE[2])
            })
    })

    it('update place then data should be retrieved', () => {
        const placeSource = new PlaceSource()
        // Given new place into data source
        placeSource.addPlace(SAMPLE_PLACE[0])
            // When change some attributes and update
            .then(newPlace => {
                newPlace.place_name = SAMPLE_PLACE[2].place_name
                newPlace.latitude = SAMPLE_PLACE[2].latitude
                newPlace.longitude = SAMPLE_PLACE[2].longitude
                placeSource.updatePlace(newPlace)
            })
            // And retrieve updated place by place_id from data source
            .then(() => placeSource.getPlaceById(SAMPLE_PLACE[0].place_id))
            // Then place attributes should be updated
            .then(place => {
                expect(place).to.have.property('place_name', SAMPLE_PLACE[2].place_name)
                expect(place).to.have.property('latitude', SAMPLE_PLACE[2].latitude)
                expect(place).to.have.property('longitude', SAMPLE_PLACE[2].longitude)
            })
    })

    it('update place by place_id which not exists should be error', () => {
        const placeSource = new PlaceSource()
        placeSource.updatePlace(SAMPLE_PLACE[2])
            .catch(err => expect(err).to.be.an('error'))
    })

    it('delete place then data should not be retrieved', () => {
        const placeSource = new PlaceSource()
        // Given new place into data source
        placeSource.addPlace(SAMPLE_PLACE[0])
            // When delete place by given id
            .then(place => placeSource.deletePlace(place.place_id))
            // Then place should not be retrieved from data source
            .then(() => placeSource.getPlaceById(SAMPLE_PLACE[0].place_id))
            .catch(err => expect(err).to.be.an('error'))
    })

    it('delete place by place_id which not exists should be error', () => {
        const placeSource = new PlaceSource()
        placeSource.deletePlace(SAMPLE_PLACE[1].place_id)
            .catch(err => expect(err).to.be.an('error'))
    })
})

// Sample test data
const SAMPLE_PLACE = [
    {
        place_id: "A00010001",
        place_name: "Sample Place 1",
        place_type: "T0002",
        latitude: 13.001,
        longitude: 100.001,
        starred: false,
        picture_url: null
    },
    {
        place_id: "A00010002",
        place_name: "Sample Place 2",
        place_type: "T0001",
        latitude: 12.100,
        longitude: 99.100,
        starred: true,
        picture_url: "http://www.shangri-la.com/uploadedImages/Corporate/about-us/our-brands/SL-Our-Brand-Shangri-La-Hotels.jpg"
    },
    {
        place_id: "A00010003",
        place_name: "Sample Place 3",
        place_type: "T0005",
        latitude: 14.1230,
        longitude: 99.24456,
        starred: false,
        picture_url: null
    },
    {
        place_id: "A00010004",
        place_name: "Sample Place 4",
        place_type: "T0001",
        latitude: 12.53945,
        longitude: 101.34644,
        starred: true,
        picture_url: null
    }
]