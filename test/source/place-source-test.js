const expect = require('chai').expect
const PlaceSource = require('./../../model/source/sample-place-source')

describe('PlaceSource', () => {

    beforeEach(() => {
        // Clear all data for each test case.
        var placeSource = new PlaceSource()
        placeSource.clear()
    })

    it('retrieve place by place_id which not exists should be error', () => {
        var placeSource = new PlaceSource()
        // Given place_id which not match any rows in data source
        placeSource.getPlaceById('ABCDEF')
            // Then result must be rejected, and error should be returned
            .catch(err => expect(err).to.be.an('error'))
    })

    it('add place then it should be retrieved', (done) => {
        var placeSource = new PlaceSource()
        // Given new place and add to data source
        placeSource.addPlace(samplePlaces[0])
            // When find place by fresh place_id
            .then(place => placeSource.getPlaceById(place.place_id))
            // Then the place should be retrieved from data source
            .then(retrievePlace => {
                expect(retrievePlace).to.have.property('place_id', samplePlaces[0].place_id)
                expect(retrievePlace).to.have.property('place_name', samplePlaces[0].place_name)
                expect(retrievePlace).to.have.property('place_type', samplePlaces[0].place_type)
                expect(retrievePlace).to.have.property('latitude', samplePlaces[0].latitude)
                expect(retrievePlace).to.have.property('longitude', samplePlaces[0].longitude)
                expect(retrievePlace).to.have.property('starred', samplePlaces[0].starred)
                expect(retrievePlace).to.have.property('picture_url', samplePlaces[0].picture_url)
                done()
            })
            .catch(err => done(err))
    })

    it('add 2 place then all places should be retrieved', (done) => {
        var placeSource = new PlaceSource()
        // Given 2 new place to data source
        placeSource.addPlace(samplePlaces[0])
            .then(_ => placeSource.addPlace(samplePlaces[1]))
            // When retrieve all places from data source
            .then(_ => placeSource.getPlaces())
            // Then the number of places should be 2
            .then(places => {
                expect(places).to.have.lengthOf(2)
                done()
            })
            .catch(err => done(err))
    })

    it('update place then data should be retrieved', (done) => {
        var placeSource = new PlaceSource()
        // Given new place into data source
        placeSource.addPlace(samplePlaces[0])
            // When change some attributes and update
            .then(newPlace => {
                newPlace.place_name = samplePlaces[2].place_name
                newPlace.latitude = samplePlaces[2].latitude
                newPlace.longitude = samplePlaces[2].longitude
                placeSource.updatePlace(newPlace)
            })
            // And retrieve updated place by place_id from data source
            .then(() => placeSource.getPlaceById(samplePlaces[0].place_id))
            // Then place attributes should be updated
            .then(place => {
                expect(place).to.have.property('place_name', samplePlaces[2].place_name)
                expect(place).to.have.property('latitude', samplePlaces[2].latitude)
                expect(place).to.have.property('longitude', samplePlaces[2].longitude)
                done()
            })
            .catch(err => done(err))
    })

    it('update place by place_id which not exists should be error', () => {
        var placeSource = new PlaceSource()
        placeSource.updatePlace(samplePlaces[2])
            .catch(err => expect(err).to.be.an('error'))
    })

    it('delete place then data should not be retrieved', () => {
        var placeSource = new PlaceSource()
        // Given new place into data source
        placeSource.addPlace(samplePlaces[0])
            // When delete place by given id
            .then(place => placeSource.deletePlace(place.place_id))
            // Then place should not be retrieved from data source
            .then(() => placeSource.getPlaceById(samplePlaces[0].place_id))
            .catch(err => expect(err).to.be.an('error'))
    })

    it('delete place by place_id which not exists should be error', () => {
        var placeSource = new PlaceSource()
        placeSource.deletePlace(samplePlaces[1].place_id)
            .catch(err => expect(err).to.be.an('error'))
    })
})

// Sample test data
var samplePlaces = [
    {
        place_id: "A00010001",
        place_name: "Sample Place 1",
        place_type: 2,
        latitude: 13.001,
        longitude: 100.001,
        starred: false,
        picture_url: null
    },
    {
        place_id: "A00010002",
        place_name: "Sample Place 2",
        place_type: 1,
        latitude: 12.100,
        longitude: 99.100,
        starred: true,
        picture_url: "http://www.shangri-la.com/uploadedImages/Corporate/about-us/our-brands/SL-Our-Brand-Shangri-La-Hotels.jpg"
    },
    {
        place_id: "A00010003",
        place_name: "Sample Place 3",
        place_type: 3,
        latitude: 0.0,
        longitude: 0.0,
        starred: false,
        picture_url: null
    }
]