/* eslint-disable no-unused-expressions */
'use strict'

const expect = require('chai').expect
const Validator = require('./../../model/validator')

describe('User Group Validator Test', () => {
  const validator = new Validator()

  it('Should error when object is null', () => {
    const result = validator.validateGroup(null)
    expect(result.error).to.be.an('error')
  })

  it('Should error when object is undefined', () => {
    const result = validator.validateGroup(undefined)
    expect(result.error).to.be.an('error')
  })

  it('Should error when group_id is null', () => {
    const result = validator.validateGroup({
      group_id: null,
      group_name: SAMPLE_CORRECT_GROUP.group_name,
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group_id')
  })

  it('Should error when group_id is number', () => {
    const result = validator.validateGroup({
      group_id: 1234,
      group_name: SAMPLE_CORRECT_GROUP.group_name,
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group_id')
  })

  it('Should error when group_name is null', () => {
    const result = validator.validateGroup({
      group_id: SAMPLE_CORRECT_GROUP.group_id,
      group_name: null,
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group_name')
  })

  it('Should error when group_name is undefined', () => {
    const result = validator.validateGroup({
      group_id: SAMPLE_CORRECT_GROUP.group_id,
      group_name: undefined,
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group_name')
  })

  it('Should error when group_name is number', () => {
    const result = validator.validateGroup({
      group_id: SAMPLE_CORRECT_GROUP.group_id,
      group_name: 123456,
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group_name')
  })

  it('Should error when group_name is less than 4 characters', () => {
    const result = validator.validateGroup({
      group_id: SAMPLE_CORRECT_GROUP.group_id,
      group_name: 'ABC',
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group_name')
  })

  it('Should error when can_insert is null', () => {
    const result = validator.validateGroup({
      group_id: SAMPLE_CORRECT_GROUP.group_id,
      group_name: SAMPLE_CORRECT_GROUP.group_name,
      can_insert: null,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('can_insert')
  })

  it('Should error when can_update is null', () => {
    const result = validator.validateGroup({
      group_id: SAMPLE_CORRECT_GROUP.group_id,
      group_name: SAMPLE_CORRECT_GROUP.group_name,
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: null,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('can_update')
  })

  it('Should error when can_delete is null', () => {
    const result = validator.validateGroup({
      group_id: SAMPLE_CORRECT_GROUP.group_id,
      group_name: SAMPLE_CORRECT_GROUP.group_name,
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: null
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('can_delete')
  })

  it('Should not error when object is in correct form', () => {
    const result = validator.validateGroup(SAMPLE_CORRECT_GROUP)
    expect(result.error).to.be.null
  })

  it('Should not error when group_id is undefined or absent', () => {
    const result = validator.validateGroup({
      group_id: undefined,
      group_name: SAMPLE_CORRECT_GROUP.group_name,
      can_insert: SAMPLE_CORRECT_GROUP.can_insert,
      can_update: SAMPLE_CORRECT_GROUP.can_update,
      can_delete: SAMPLE_CORRECT_GROUP.can_delete
    })
    expect(result.error).to.be.null
  })
})

const SAMPLE_CORRECT_GROUP = {
  group_id: 'G0001',
  group_name: 'Admin',
  can_insert: true,
  can_update: true,
  can_delete: true
}
