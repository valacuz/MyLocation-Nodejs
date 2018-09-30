/* eslint-disable no-unused-expressions */
'use strict'

const expect = require('chai').expect
const Validator = require('./../../model/validator')

describe('Place Validator Test', () => {
  const validator = new Validator()

  it('Should error when object is null', () => {
    const result = validator.validatePlace(null)
    expect(result.error).to.be.an('error')
  })

  it('Should error when place_id is null', () => {
    const result = validator.validatePlace({
      place_id: null,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('place_id')
  })

  it('Should error when place_name is null', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: null,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('place_name')
  })

  it('Should error when place_name is numeric', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: 123456,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('place_name')
  })

  it('Should error when place_name is less than 4 characters', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: 'ABC',
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('place_name')
  })

  it('Should error when place_type is undefined', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: undefined,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('place_type')
  })

  it('Should error when place_type is numeric', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: 123456,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('place_type')
  })

  it('Should error when place_type is less than 4 characters', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: 'ABC',
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('place_type')
  })

  it('Should error when latitude is string', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: '13.1234 ABC',
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('latitude')
  })

  it('Should error when latitude is less than -90', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: -90.05,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('latitude')
  })

  it('Should error when latitude is more than 90', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: 90.05,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('latitude')
  })

  it('Should error when longitude is string', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: '100.4321 ABC',
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('longitude')
  })

  it('Should error when longitude is less than -180', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: -180.05,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('longitude')
  })

  it('Should error when longitude is more than 180', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: 180.05,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('longitude')
  })

  it('Should error when starred is null', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: null,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('starred')
  })

  it('Should error when starred is string', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: 'ABCDE',
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('starred')
  })

  it('Should not error when object is in correct form', () => {
    const result = validator.validatePlace(SAMPLE_CORRECT_PLACE)
    expect(result.error).to.be.null
  })

  it('Should not error when place_id is undefined or absent', () => {
    const result = validator.validatePlace({
      place_id: undefined,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: SAMPLE_CORRECT_PLACE.starred,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.null
  })

  it('Should not error when starred is undefined or absent', () => {
    const result = validator.validatePlace({
      place_id: SAMPLE_CORRECT_PLACE.place_id,
      place_name: SAMPLE_CORRECT_PLACE.place_name,
      place_type: SAMPLE_CORRECT_PLACE.place_type,
      latitude: SAMPLE_CORRECT_PLACE.latitude,
      longitude: SAMPLE_CORRECT_PLACE.longitude,
      starred: undefined,
      picture_url: SAMPLE_CORRECT_PLACE.picture_url
    })
    expect(result.error).to.be.null
  })
})

const SAMPLE_CORRECT_PLACE = {
  place_id: '543c8760-8572-443d-93dd-6498b2256aca',
  place_name: 'Sample place',
  place_type: '7129d2b1-a38c-4e9c-a13c-7890a9a37cb4',
  latitude: 13.549,
  longitude: 100.182,
  starred: false,
  picture_url: null
}
