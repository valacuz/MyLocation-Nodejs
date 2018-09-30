/* eslint-disable no-unused-expressions */
'use strict'

const expect = require('chai').expect
const Validator = require('./../../model/validator')

describe('Place Type Validator Test', () => {
  const validator = new Validator()

  it('Should error when object is null', () => {
    const result = validator.validatePlaceType(null)
    expect(result.error).to.be.an('error')
  })

  it('Should error when type_id is null', () => {
    const result = validator.validatePlaceType({
      type_id: null,
      type_name: SAMPLE_CORRECT_TYPE.type_name
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('type_id')
  })

  it('Should error when type_id is numeric', () => {
    const result = validator.validatePlaceType({
      type_id: 10001,
      type_name: SAMPLE_CORRECT_TYPE.type_name
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('type_id')
  })

  it('Should error when type_name is null', () => {
    const result = validator.validatePlaceType({
      type_id: SAMPLE_CORRECT_TYPE.type_id,
      type_name: null
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('type_name')
  })

  it('Should error when type_name is numeric', () => {
    const result = validator.validatePlaceType({
      type_id: SAMPLE_CORRECT_TYPE.type_id,
      type_name: 123456
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('type_name')
  })

  it('Should error when type_name is less than 4 characters', () => {
    const result = validator.validatePlaceType({
      type_id: SAMPLE_CORRECT_TYPE.type_id,
      type_name: 'Etc'
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('type_name')
  })

  it('Should not error when object is in correct form', () => {
    const result = validator.validatePlaceType(SAMPLE_CORRECT_TYPE)
    expect(result.error).to.be.null
  })

  it('Should not error when type_id is undefined or absent', () => {
    const result = validator.validatePlaceType({
      type_id: undefined,
      type_name: SAMPLE_CORRECT_TYPE.type_name
    })
    expect(result.error).to.be.null
  })
})

const SAMPLE_CORRECT_TYPE = {
  type_id: '54ac5555-fdd2-4d3d-9213-46b051da7704',
  type_name: 'University'
}
