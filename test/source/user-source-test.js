/* eslint-disable no-unused-expressions */
'use strict'

const expect = require('chai').expect
const UserSource = require('./../../model/source/user/sample-user-source')

describe('Sample User Source', () => {
  beforeEach(() => {
    // Clear all data for each test case.
    const userSource = new UserSource()
    userSource.clearAll()
  })

  it('Should not found user when id is not exists in data source', async () => {
    const userSource = new UserSource()
    // Given one user in data source.
    await userSource.addUser(Object.assign({}, SAMPLE_USERS[0]))
    // When try to find user with non existing user id.
    const user = await userSource.getUserById('NON_EXISTS_ID')
    // Then user should not be found (undefined).
    expect(user).to.be.undefined
  })

  it('Should not found user when id is undefined', async () => {
    const userSource = new UserSource()
    // Given one user in data source.
    await userSource.addUser(Object.assign({}, SAMPLE_USERS[0]))
    // When try to find user with undefined.
    const user = await userSource.getUserById(undefined)
    // Then user should not be found (undefined).
    expect(user).to.be.undefined
  })

  it('Should retrieved user which just added to data source', async () => {
    const userSource = new UserSource()
    // Given one user in data source.
    const newUser = await userSource.addUser(Object.assign({}, SAMPLE_USERS[0]))
    // When try to find user with newly user id.
    const user = await userSource.getUserById(newUser.id)
    // Then user should be found and be equal to user which just added.
    expect(user).not.to.be.undefined
  })

  it('Should not found user by given wrong username', async () => {
    const userSource = new UserSource()
    // Given one user in data source.
    await userSource.addUser(Object.assign({}, SAMPLE_USERS[0]))
    // When try to check user information with wrong username.
    const user = await userSource.checkUser('SOME_WRONG_USERNAME', SAMPLE_USERS[0].password)
    // Then user should not be found (undefined).
    expect(user).to.be.undefined
  })

  it('Should not found user by given wrong password', async () => {
    const userSource = new UserSource()
    // Given one user in data source.
    await userSource.addUser(Object.assign({}, SAMPLE_USERS[0]))
    // When try to check user information with wrong password.
    const user = await userSource.checkUser(SAMPLE_USERS[0].username, 'SOME_WRONG_PASSWORD')
    // Then user should not be found (undefined).
    expect(user).to.be.undefined
  })

  it('Should found user by given correct username & password', async () => {
    const userSource = new UserSource()
    // Given one user in data source.
    await userSource.addUser(Object.assign({}, SAMPLE_USERS[0]))
    // When try to check user information with correct username & password.
    const user = await userSource.checkUser(SAMPLE_USERS[0].username, SAMPLE_USERS[0].password)
    // Then user should be found.
    expect(user).not.be.undefined
  })
})

const SAMPLE_USERS = [
  {
    id: 'AAA0001',
    username: 'member01',
    password: 'member01',
    email: 'test123@somedomain.com',
    group: {
      group_id: 'G0001'
    }
  }
]
