/* eslint-disable no-unused-expressions */
'use strict'

const expect = require('chai').expect
const TypeSource = require('./../../model/source/type/sample-type-source')

describe('Sample Place Type Source', () => {
  beforeEach(() => {
    // Clear all data for each test case.
    const typeSource = new TypeSource()
    typeSource.clearAll()
  })

  it('Should not found place type when type_id is not exists in data source', async () => {
    const typeSource = new TypeSource()
    // Given one place type in data source.
    await typeSource.addType(SAMPLE_TYPES[0])
    // When try to find place type with not exists type_id.
    const type = await typeSource.getTypeById('NOT_EXISTS_TYPE_ID')
    // Then place type should not be found (undefined).
    expect(type).to.be.undefined
  })

  it('Should not found place type when type_id is undefined', async () => {
    const typeSource = new TypeSource()
    // Given one place type in data source.
    await typeSource.addType(SAMPLE_TYPES[0])
    // When try to find place type with undefined.
    const type = await typeSource.getTypeById(undefined)
    // Then place type should not be found (undefined).
    expect(type).to.be.undefined
  })

  it('Should retrieve place type which just added to data source', async () => {
    const typeSource = new TypeSource()
    // Given one place type in data source.
    const newType = await typeSource.addType(SAMPLE_TYPES[0])
    // When try to find place type with newly type_id.
    const type = await typeSource.getTypeById(newType.type_id)
    // Then place type should be found and be equal to place type which just added.
    expect(type).to.deep.equals(newType)
  })

  it('Should retrieve array of place types after adding them to data source', async () => {
    const typeSource = new TypeSource()
    // Given an array of place type and add to data source
    await typeSource.addType(SAMPLE_TYPES[0])
    await typeSource.addType(SAMPLE_TYPES[1])
    await typeSource.addType(SAMPLE_TYPES[2])
    await typeSource.addType(SAMPLE_TYPES[3])
    // When try to query all place types from data source
    const types = await typeSource.getTypes()
    // Then all place types which just added should be found
    expect(types).to.have.lengthOf(SAMPLE_TYPES.length)
    expect(types[0]).to.deep.equal(SAMPLE_TYPES[0])
    expect(types[1]).to.deep.equal(SAMPLE_TYPES[1])
    expect(types[2]).to.deep.equal(SAMPLE_TYPES[2])
    expect(types[3]).to.deep.equal(SAMPLE_TYPES[3])
  })

  it('Should update place type successfully', async () => {
    const typeSource = new TypeSource()
    // Given one place type in data source.
    const newType = await typeSource.addType(SAMPLE_TYPES[0])
    // When change name and update in data source.
    newType.type_name = SAMPLE_TYPES[2].type_name
    await typeSource.updateType(newType)
    // And retrieve place type by type_id which just updated from data source.
    const type = await typeSource.getTypeById(newType.type_id)
    // Then place type should be found and attributes should be updated.
    expect(type).to.have.property('type_name', SAMPLE_TYPES[2].type_name)
  })

  it('Should not update place type when type_id is not exists in data source', async () => {
    const typeSource = new TypeSource()
    // Given one place type in data source.
    await typeSource.addType(SAMPLE_TYPES[0])
    try {
      // When try to update place type by type_id which not exists in data source.
      await typeSource.updateType(SAMPLE_TYPES[3])
      expect.fail(null, null, 'the error should be thrown')
    } catch (err) {
      // Then the error should be thrown.
      expect(err).to.be.an('error')
    }
  })

  it('Should delete place type successfully and not being retrieved', async () => {
    const typeSource = new TypeSource()
    // Given one place type in data source.
    const newType = await typeSource.addType(SAMPLE_TYPES[0])
    // When delete type by given type_id.
    await typeSource.deleteType(newType.type_id)
    // Then place type should not be retrieved from data source (be undefined).
    const type = await typeSource.getTypeById(newType.type_id)
    expect(type).to.be.undefined
  })

  it('Should not delete place type when type_id is not exists in data source', async () => {
    const typeSource = new TypeSource()
    // Given one place type in data source.
    await typeSource.addType(SAMPLE_TYPES[0])
    try {
      // When try to delete place type by type_id which not exists in data source.
      await typeSource.deleteType('NOT_EXISTS_TYPE_ID')
      expect.fail(null, null, 'the error should be thrown')
    } catch (err) {
      // Then the error should be thrown.
      expect(err).to.be.an('error')
    }
  })
})

// Sample test data
const SAMPLE_TYPES = [
  { type_id: '93a9a66c-5e9b-4ca5-8bc8-82ce2af60b88', type_name: 'Sports' },
  { type_id: '69a80052-0214-4a3a-90a2-485c84ff7fba', type_name: 'Recreation' },
  { type_id: 'd243368c-569d-49d8-9f91-4ceb8c6022c0', type_name: 'Hospital' },
  { type_id: 'b08c05bc-96fb-464d-bfb2-7fd866cdf1ff', type_name: 'Others' }
]
