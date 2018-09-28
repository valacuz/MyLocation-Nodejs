'use strict'

const mongoose = require('mongoose')
const objectId = require('mongodb').ObjectID
const PlaceType = mongoose.model('PlaceType')
const TypeSource = function () { }

TypeSource.prototype.getTypes = () => {
  return PlaceType.find().exec()
    .then(types => types.map(type => type.toResponseJson()))
}

TypeSource.prototype.getTypeById = (id) => {
  if (objectId.isValid(id)) {
    return PlaceType.findById(id).exec()
      .then(type => {
        if (type) {
          return type.toResponseJson()
        } else {
          return type
        }
      })
  } else {
    return Promise.resolve(undefined)
  }
}

TypeSource.prototype.addType = (type) => {
  const newType = new PlaceType(type)
  return newType.save()
    .then(() => newType.toResponseJson())
}

TypeSource.prototype.updateType = (type) => {
  return PlaceType.findByIdAndUpdate(type.type_id, type).exec()
}

TypeSource.prototype.deleteType = (id) => {
  return PlaceType.findByIdAndRemove(id).exec()
}

TypeSource.prototype.clearAll = () => {
  return PlaceType.remove().exec()
}

module.exports = TypeSource
