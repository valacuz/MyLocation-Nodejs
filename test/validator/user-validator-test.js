/* eslint-disable no-unused-expressions */
'use strict'

const expect = require('chai').expect
const Validator = require('./../../model/validator')

describe('User Validator Test', () => {
  const validator = new Validator()

  it('Should error when object is null', () => {
    const result = validator.validateUser(null)
    expect(result.error).to.be.an('error')
  })

  it('Should error when object is undefined', () => {
    const result = validator.validateUser(undefined)
    expect(result.error).to.be.an('error')
  })

  it('Should error when id is numeric', () => {
    const result = validator.validateUser({
      id: 123456,
      username: SAMPLE_CORRECT_USER.username,
      password: SAMPLE_CORRECT_USER.password,
      email: SAMPLE_CORRECT_USER.email,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('id')
  })

  it('Should error when username is null', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: null,
      password: SAMPLE_CORRECT_USER.password,
      email: SAMPLE_CORRECT_USER.email,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('username')
  })

  it('Should error when username in undefined', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: undefined,
      password: SAMPLE_CORRECT_USER.password,
      email: SAMPLE_CORRECT_USER.email,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('username')
  })

  it('Should error when username is numeric', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: 12345678,
      password: SAMPLE_CORRECT_USER.password,
      email: SAMPLE_CORRECT_USER.email,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('username')
  })

  it('Should error when password is null', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: null,
      email: SAMPLE_CORRECT_USER.email,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('password')
  })

  it('Should error when password is undefined', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: undefined,
      email: SAMPLE_CORRECT_USER.email,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('password')
  })

  it('Should error when password is numeric', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: 12345678,
      email: SAMPLE_CORRECT_USER.email,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('password')
  })

  it('Should error when email is null', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: SAMPLE_CORRECT_USER.password,
      email: null,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('email')
  })

  it('Should error when email is numeric', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: SAMPLE_CORRECT_USER.password,
      email: 1234567890,
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('email')
  })

  it('Should error when email is not correct format (no domain)', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: SAMPLE_CORRECT_USER.password,
      email: 'someone',
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('email')
  })

  it('Should error when email is not correct format (no top level domain', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: SAMPLE_CORRECT_USER.password,
      email: 'someone@company',
      group: SAMPLE_CORRECT_USER.group
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('email')
  })

  it('Should error when group object is null', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: SAMPLE_CORRECT_USER.password,
      email: SAMPLE_CORRECT_USER.email,
      group: null
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group')
  })

  it('Should error when group_id is null inside group object', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: SAMPLE_CORRECT_USER.password,
      email: SAMPLE_CORRECT_USER.email,
      group: {
        group_id: null
      }
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group_id')
  })

  it('Should error when group_id is numeric', () => {
    const result = validator.validateUser({
      id: SAMPLE_CORRECT_USER.id,
      username: SAMPLE_CORRECT_USER.username,
      password: SAMPLE_CORRECT_USER.password,
      email: SAMPLE_CORRECT_USER.email,
      group: {
        group_id: 12345678
      }
    })
    expect(result.error).to.be.an('error')
    const path = result.error.details[0].path
    expect(path[path.length - 1]).to.be.equal('group_id')
  })
})

const SAMPLE_CORRECT_USER = {
  id: 'ABC00001',
  username: 'admin01',
  password: 'adminpwd01',
  email: 'admin@mylocation.com',
  group: {
    group_id: 'G0001'
  }
}
