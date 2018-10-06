'use strict'

const uuidv4 = require('uuid/v4')
const GroupSource = require('./../group')
const UserSource = function () { }

var users = [
  {
    id: 'ABC00001',
    username: 'admin01',
    password: 'adminpwd01',
    email: 'admin@mylocation.com',
    group: {
      group_id: 'G0001'
    }
  },
  {
    id: 'XYZ00003',
    username: 'member03',
    password: 'mempwd03',
    email: 'member@mylocation.com',
    group: {
      group_id: 'M0001'
    }
  }
]

UserSource.prototype.checkUser = async (username, password) => {
  const user = users.find(item => item.username === username && item.password === password)
  if (user) {
    // If user was found, try to retrieve user group (for access permission)
    var group = await new GroupSource().getGroupById(user.group.group_id)
    user.group = group
    return user
  } else {
    return undefined
  }
}

UserSource.prototype.getUserById = async (id) => {
  const user = users.find(item => item.id === id)
  if (user) {
    // If user was found, try to retrieve user group (for access permission)
    var group = await new GroupSource().getGroupById(user.group.group_id)
    user.group = group
    return user
  } else {
    return undefined
  }
}

UserSource.prototype.addUser = async (user) => {
  user.id = uuidv4() // Insert or replace id with UUID
  users.push(user)
  return user
}

UserSource.prototype.clearAll = async () => {
  users.length = 0
}

module.exports = UserSource
