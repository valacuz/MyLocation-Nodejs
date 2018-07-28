const expect = require('chai').expect
const TypeSource = require('./../../../model/source/type/sample-type-source')

describe('PlaceTypeSource', () => {

    beforeEach(() => {
        // Clear all data for each test case.
        const typeSource = new TypeSource()
        typeSource.clear()
    })

    it('Should not success to retrieve place type by not exists type_id', () => {
        const typeSource = new TypeSource()
        // Given a place type and add to data source
        typeSource.addType(SAMPLE_TYPES[0])
            // When find place type by giving not exists type_id
            .then(_ => typeSource.getTypeById('NOT_EXISTS_TYPE_ID'))
            // Then place type must not found (be undefined)
            .then(type => expect(type).to.be.undefined)
    })
    it('Should not success to retrieve place type by undefined type_id', () => {
        const typeSource = new TypeSource()
        // Given a place type and add to data source
        typeSource.addType(SAMPLE_TYPES[0])
            // When find place type by giving undefined type_id
            .then(_ => typeSource.getTypeById(undefined))
            // Then place type must not found (be undefined)
            .then(type => expect(type).to.be.undefined)
    })
    it('Should success to retrieve place type which just added to data source', () => {
        const typeSource = new TypeSource()
        // Given a place type and add to data source
        typeSource.addType(SAMPLE_TYPES[0])
            // When find place type by fresh type_id
            .then(type => typeSource.getTypeById(type.type_id))
            // Then the type should be retrieved from data source and equals to source object
            .then(type => expect(type).to.deep.equal(SAMPLE_TYPES[0]))
    })
    it('Should success to retrieve all 3 place types which added to data source', () => {
        const typeSource = new TypeSource()
        // Given an array of place type and add to data source
        typeSource.addTypes(SAMPLE_TYPES)
            // When retrieve all types from data source
            .then(_ => typeSource.getTypes())
            // Then the number of types should be equals to size of array `SAMPLE_PLACE`
            .then(types => expect(types).to.have.lengthOf(SAMPLE_TYPES.length))
    })
    it('update place type then data should be updated', () => {
        const typeSource = new TypeSource()
        var newTypeId
        // Given new type to data source
        typeSource.addType(SAMPLE_TYPES[0])
            // When change some attribute and update
            .then(newType => {
                newTypeId = newType.type_id
                newType.type_name = SAMPLE_TYPES[2].type_name
                typeSource.updateType(newType)
            })
            // And retrieve updated type by type_id from data source
            .then(() => typeSource.getTypeById(newTypeId))
            // Then type attributes should be updated
            .then(type =>
                expect(type).to.have.property('type_name', SAMPLE_TYPES[2].type_name))
    })
    it('update place type by type_id which not exists should be error', () => {
        const typeSource = new TypeSource()
        typeSource.updateType(SAMPLE_TYPES[3])
            .catch(err => expect(err).to.be.an('error'))
    })
    it('delete place type then data should not be retrieved', () => {
        const typeSource = new TypeSource()
        var newTypeId
        // Given new place into data source
        typeSource.addType(SAMPLE_TYPES[0])
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
        typeSource.deleteType(SAMPLE_TYPES[3].type_id)
            .catch(err => expect(err).to.be.an('error'))
    })
})

// Sample test data
const SAMPLE_TYPES = [
    { type_id: '93a9a66c-5e9b-4ca5-8bc8-82ce2af60b88', type_name: 'Sports' },
    { type_id: '69a80052-0214-4a3a-90a2-485c84ff7fba', type_name: 'Recreation' },
    { type_id: 'd243368c-569d-49d8-9f91-4ceb8c6022c0', type_name: 'Hospital' },
    { type_id: 'b08c05bc-96fb-464d-bfb2-7fd866cdf1ff', type_name: 'Others' }
]