/* eslint-disable no-unused-expressions */
'use strict'

const expect = require('chai').expect
const GroupSource = require('./../../model/source/group/sample-group-source')

describe('Sample Group Source', () => {
  beforeEach(() => {
    // Clear all data for each test case.
    const groupSource = new GroupSource()
    groupSource.clearAll()
  })

  it('Should not found group when group_id is not exists in data source', async () => {
    const groupSource = new GroupSource()
    // Given one group in data source.
    await groupSource.addGroup(Object.assign({}, SAMPLE_GROUPS[0]))
    // When try to find group with non exists group_id.
    const group = await groupSource.getGroupById('NON_EXISTS_GROUP_ID')
    // Then group should not be found (undefined).
    expect(group).to.be.undefined
  })

  it('Should not found group when group_id is undefined', async () => {
    const groupSource = new GroupSource()
    // Given one group in data source.
    await groupSource.addGroup(Object.assign({}, SAMPLE_GROUPS[0]))
    // When try to find group with non exists group_id.
    const group = await groupSource.getGroupById(undefined)
    // Then group should not be found (undefined).
    expect(group).to.be.undefined
  })

  it('Should retrieve group which just added to data source', async () => {
    const groupSource = new GroupSource()
    // Given one group in data source.
    const newGroup = await groupSource.addGroup(Object.assign({}, SAMPLE_GROUPS[0]))
    // When try to find group with newly group_id.
    const group = await groupSource.getGroupById(newGroup.group_id)
    // Then group should be found and be equal to group which just added.
    expect(group).to.deep.equal(newGroup)
  })

  it('Should retrieve array of groups after adding them to data source', async () => {
    const groupSource = new GroupSource()
    // Given three of user groups and add to data source.
    const insertGroups = SAMPLE_GROUPS.slice(0)
    for (var i = 0; i < insertGroups.length; i++) {
      await groupSource.addGroup(insertGroups[i])
    }
    // When try to query all groups from data source.
    const groups = await groupSource.getGroups()
    // Then all groups which just added should be found.
    expect(groups).to.have.lengthOf(insertGroups.length)
    for (i = 0; i < insertGroups.length; i++) {
      expect(groups[i]).to.deep.equal(insertGroups[i])
    }
  })

  it('Should update group successfully', async () => {
    const groupSource = new GroupSource()
    // Given one group in data source.
    const newGroup = await groupSource.addGroup(Object.assign({}, SAMPLE_GROUPS[0]))
    // When change group name and update in data source.
    const editGroup = newGroup
    editGroup.group_name = 'NEW_NAME'
    await groupSource.updateGroup(editGroup)
    // And retrieve group by group_id which just updated from data source.
    const group = await groupSource.getGroupById(newGroup.group_id)
    expect(group).to.deep.equal(editGroup)
  })

  it('Should not update group when group_id is not exists in data source', async () => {
    const groupSource = new GroupSource()
    // Given one group in data source.
    await groupSource.addGroup(Object.assign({}, SAMPLE_GROUPS[0]))
    try {
      // When try to update group by group_id which not exists in data source
      await groupSource.updateGroup(Object.assign({}, SAMPLE_GROUPS[2]))
      /* istanbul ignore next */
      expect.fail(null, null, 'the error should be thrown')
    } catch (err) {
      // Then the error should be thrown.
      expect(err).to.be.an('error')
    }
  })

  it('Should delete group successfully and not being retrieved', async () => {
    const groupSource = new GroupSource()
    // Given one group in data source.
    const newGroup = await groupSource.addGroup(Object.assign({}, SAMPLE_GROUPS[0]))
    // When delete group by given group_id.
    await groupSource.deleteGroup(newGroup.group_id)
    // Then group should not be retrieved from data source (be undefined)
    const group = await groupSource.getGroupById(newGroup.group_id)
    expect(group).to.be.undefined
  })

  it('Should not delete group when group_id is not exists in data source', async () => {
    const groupSource = new GroupSource()
    // Given one group in data source.
    await groupSource.addGroup(Object.assign({}, SAMPLE_GROUPS[0]))
    try {
      // When delete group by given group_id.
      await groupSource.deleteGroup('NOT_EXISTS_GROUP_ID')
      /* istanbul ignore next */
      expect.fail(null, null, 'the error should be thrown')
    } catch (err) {
      // Then the error should be thrown.
      expect(err).to.be.an('error')
    }
  })
})

// Sample test data
const SAMPLE_GROUPS = [
  {
    group_id: 'G1234',
    group_name: 'Moderator',
    can_insert: true,
    can_update: true,
    can_delete: true
  },
  {
    group_id: 'W0001',
    group_name: 'Writer',
    can_insert: true,
    can_update: true,
    can_delete: false
  },
  {
    group_id: 'M0002',
    group_name: 'Member',
    can_insert: false,
    can_update: false,
    can_delete: false
  }
]
