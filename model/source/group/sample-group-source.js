'use strict'

const uuidv4 = require('uuid/v4')
const GroupSource = function () { }

var groups = [
  {
    group_id: 'G0001',
    group_name: 'Admin',
    can_insert: true,
    can_update: true,
    can_delete: true
  },
  {
    group_id: 'M0001',
    group_name: 'Member',
    can_insert: false,
    can_update: false,
    can_delete: false
  }
]

GroupSource.prototype.getGroups = () => Promise.resolve(groups)

GroupSource.prototype.getGroupById = async (id) => {
  return groups.find(item => item.group_id === id)
}

GroupSource.prototype.addGroup = async (group) => {
  group.group_id = uuidv4() // insert or replace id with UUID
  groups.push(group)
  return group
}

GroupSource.prototype.updateGroup = async (group) => {
  const index = groups.findIndex(item => item.group_id === group.group_id)
  if (index >= 0) {
    groups[index] = group
  } else {
    throw Error('User group with given group_id was not found')
  }
}

GroupSource.prototype.deleteGroup = async (id) => {
  const index = groups.findIndex(item => item.group_id === id)
  if (index >= 0) {
    groups.splice(index, 1)
  } else {
    throw Error('User group with given group_id was not found')
  }
}

GroupSource.prototype.clearAll = async () => {
  groups.length = 0
}

module.exports = GroupSource
