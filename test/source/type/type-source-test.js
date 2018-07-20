const expect = require('chai').expect
const TypeSource = require('./../../../model/source/type/sample-type-source')

describe('PlaceTypeSource', () => {

    beforeEach(() => {
        // Clear all data for each test case.
        const typeSource = new TypeSource()
        typeSource.clear()
    })
    it('Retrieve place type by type_id which not exists should not exists', () => {
        const typeSource = new TypeSource()
        // Given type_id which not match any rows in data source
        typeSource.getTypeById(10001)
            // Then place must be undefined (not found)
            .then(type => expect(type).to.be.undefined)
    })
    it('Retrieve place type by type_id is undefined should not exists', () => {
        const typeSource = new TypeSource()
        // Given type_id which not match any rows in data source
        typeSource.getTypeById(undefined)
            // Then place must be undefined (not found)
            .then(type => expect(type).to.be.undefined)
    })
    it('Should retrieve place type which just added to data source', () => {
        const typeSource = new TypeSource()
        // Given new place type named `others` and when add to data source
        typeSource.addType(sampleType[0].type_name)
            // When find type by fresh type_id
            .then(type => typeSource.getTypeById(type.type_id))
            // Then the type should be retrieved from data source
            .then(retrieveType =>
                expect(retrieveType).to.have.property('type_name', sampleType[0].type_name))
    })
    it('Should retrieve all 3 place types which added to data source', () => {
        const newTypes = ['park', 'bank', 'hospital']
        const typeSource = new TypeSource()
        // Given 3 new places to data source
        typeSource.addTypes(newTypes)
            // When retrieve all types from data source
            .then(_ => typeSource.getTypes())
            // Then the number of types should be 3
            .then(types => expect(types).to.have.lengthOf(newTypes.length))
    })
    it('update place type then data should be updated', () => {
        const typeSource = new TypeSource()
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
            .then(type =>
                expect(type).to.have.property('type_name', sampleType[2].type_name))
    })
    it('update place type by type_id which not exists should be error', () => {
        const typeSource = new TypeSource()
        typeSource.updateType(sampleType[3])
            .catch(err => expect(err).to.be.an('error'))
    })
    it('delete place type then data should not be retrieved', () => {
        const typeSource = new TypeSource()
        var newTypeId = -1
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
        const typeSource = new TypeSource()
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