const expect = require('chai').expect
const Validator = require('./../model/validator')

describe('Test Validator class', () => {

    describe('Place', () => {
        it('Should error when object is null', () => {
            const result = new Validator().validatePlace(null)
            expect(result.error).to.be.an('error')
        })
        it('Should error when place_id is null', () => {
            const result = new Validator().validatePlace({
                place_id: null
            })
            // Then validate should be failed on field `place_id`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('place_id')
        })
        it('Should error when place_name is null', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: null
            })
            // Then validation should be failed on field `place_name`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('place_name')
        })
        it('Should error when place_name is less than 4 characters', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'one'
            })
            // Then validation should be failed on field `place_name`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('place_name')
        })
        it('Should error when place_type is undefined', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place'
            })
            // Then validation should be failed on field `place_type`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('place_type')
        })
        it('Should error when place_type is a number', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place',
                place_type: 1
            })
            // Then validation should be failed on field `place_type`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('place_type')
        })
        it('Should error when place_type is less than 4 characters', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place',
                place_type: 'ABC'
            })
            // Then validation should be failed on field `place_type`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('place_type')
        })
        it('Should error when latitude is less than -90', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place',
                place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
                latitude: -90.005
            })
            // Then validation should be failed on field `latitude`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('latitude')
        })
        it('Should error when latitude is more than 90', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place',
                place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
                latitude: 90.005
            })
            // Then validation should be failed on field `latitude`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('latitude')
        })
        it('Should error when longitude is less than -180', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place',
                place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
                latitude: 13.549,
                longitude: -180.005,
            })
            // Then validation should be failed on field `longitude`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('longitude')
        })
        it('Should error when longitude is more than 180', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place',
                place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
                latitude: 13.549,
                longitude: 180.005,
            })
            // Then validation should be failed on field `longitude`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('longitude')
        })
        it('Should error when starred is null', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place',
                place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
                latitude: 13.549,
                longitude: 100.182,
                starred: null
            })
            // Then validation should be failed on field `starred`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('starred')
        })
        it('Should pass when input correct parameters', () => {
            const result = new Validator().validatePlace({
                place_id: '543c8760-8572-443d-93dd-6498b2256aca',
                place_name: 'Sample place',
                place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
                latitude: 13.549,
                longitude: 100.182,
                starred: false,
                picture_url: null
            })
            // Then error should be null
            expect(result.error).to.be.null
        })
    })

    describe('Type', () => {
        it('Should error when place_id is a number', () => {
            const result = new Validator().validatePlaceType({
                type_id: 10001,
                type_name: 'Hospital'
            })
            // Then validation should be failed on field `type_id`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('type_id')
        })
        it('Should error when type_name is null', () => {
            const result = new Validator().validatePlaceType({
                type_id: '54ac5555-fdd2-4d3d-9213-46b051da7704',
                type_name: null
            })
            // Then validation should be failed on field `type_name`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('type_name')
        })
        it('Should error when type_name is less than 4 characters', () => {
            const result = new Validator().validatePlaceType({
                type_id: '54ac5555-fdd2-4d3d-9213-46b051da7704',
                type_name: 'Etc'
            })
            // Then validation should be failed on field `type_name`
            expect(result.error).to.be.an('error')
            expect(result.error.details[0].path[0]).to.be.equals('type_name')
        })
        it('Should pass when type_id is number and type_name is more than 4 characters', () => {
            const result = new Validator().validatePlaceType({
                type_id: '54ac5555-fdd2-4d3d-9213-46b051da7704',
                type_name: 'Hotel'
            })
            // Then error should be null
            expect(result.error).to.be.null
        })
        it('Should pass when type_id is not provided', () => {
            const result = new Validator().validatePlaceType({
                type_name: 'Hotel'
            })
            // Then error should be null
            expect(result.error).to.be.null
        })
    })
})