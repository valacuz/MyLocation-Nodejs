'use strict'

const uuidv4 = require('uuid/v4')
const TypeSource = function () { }

var types = []

TypeSource.prototype.getTypes = async () => {
  return types
}

TypeSource.prototype.getTypeById = async (id) => {
  return types.find(item => item.type_id === id)
}

TypeSource.prototype.addType = async (type) => {
  type.type_id = uuidv4() // Insert or replace type_id with random UUID
  types.push(type)
  return type
}

TypeSource.prototype.updateType = async (type) => {
  const index = types.findIndex(item => item.type_id === type.type_id)
  if (index >= 0) {
    types[index] = type
  } else {
    throw Error('Place type with given type_id was not found')
  }
}

TypeSource.prototype.deleteType = async (id) => {
  const index = types.findIndex(item => item.type_id === id)
  if (index >= 0) {
    types.splice(index, 1)
  } else {
    throw Error('Place type with given type_id was not found')
  }
}

TypeSource.prototype.clearAll = async () => {
  types.length = 0
}

module.exports = TypeSource
