const expect = require('chai').expect
const TypeSource = require('./../../model/source/sample-type-source')

describe('PlaceTypeSource', () => {

    beforeEach(() => {
        // Clear all data for each test case.
        var typeSource = new TypeSource()
        typeSource.clear()
    })

    it('retrieve place type by type_id which not exists should be error', () => {
        var typeSource = new TypeSource()
        // Given type_id which not match any rows in data source
        typeSource.getTypeById(10001)
            .catch(err => expect(err).to.be.an('error'))
    })

    it('add place type then it should be retrieved', (done) => {
        var typeSource = new TypeSource()
        // Given new place type named `others` and when add to data source
        typeSource.addType(sampleType[0].type_name)
            // When find type by fresh type_id
            .then(type => typeSource.getTypeById(type.type_id))
            // Then the type should be retrieved from data source
            .then(retrieveType => {
                expect(retrieveType).to.have.property('type_name', sampleType[0].type_name)
                done()
            })
            .catch(err => done(err))
    })

    it('add 3 places type then all place types should be retrieved', () => {
        var newTypes = ['park', 'bank', 'hospital']
        var typeSource = new TypeSource()

        // Given 3 new places to data source
        typeSource.addTypes(newTypes)
            // When retrieve all types from data source
            .then(_ => typeSource.getTypes())
            // Then the number of types should be 3
            .then(types => expect(types).to.have.lengthOf(newTypes.length))
    })

    it('update place type then data should be updated', (done) => {
        var typeSource = new TypeSource()
        var newTypeId = -1
        // Given new type to data source
        typeSource.addType(sampleType[0])
            // When change some attribute and update
            .then(newType => {
                newTypeId = newType.type_id
                newType.type_name = sampleType[2].type_name
                typeSource.updateType(newType)
            })
            // And retrieve updated type by type_id from data source
            .then(() => typeSource.getTypeById(newTypeId))
            // Then type attributes should be updated
            .then(type => {
                expect(type).to.have.property('type_name', sampleType[2].type_name)
                done()
            })
            .catch(err => done(err))
    })

    it('update place type by type_id which not exists should be error', () => {
        var typeSource = new TypeSource()
        typeSource.updateType(sampleType[3])
            .catch(err => expect(err).to.be.an('error'))
    })

    it('delete place type then data should not be retrieved', () => {
        var typeSource = new TypeSource()
        var newTypeId = 0;
        // Given new place into data source
        typeSource.addType(sampleType[0])
            // When delete type by given id
            .then(type => {
                newTypeId = type.type_id
                typeSource.deleteType(type.type_id)
            })
            // Then type should not be retrieved from data source
            .then(() => typeSource.getTypeById(newTypeId))
            .catch(err => expect(err).to.be.an('error'))
    })

    it('delete place type by type_id which not exists should be error', () => {
        var typeSource = new TypeSource()
        typeSource.deleteType(sampleType[3].type_id)
            .catch(err => expect(err).to.be.an('error'))
    })
})

// Sample test data
var sampleType = [
    { type_id: 10001, type_name: 'sports' },
    { type_id: 10002, type_name: 'recreation' },
    { type_id: 10003, type_name: 'hospital' },
    { type_id: 10004, type_name: 'others' }
]