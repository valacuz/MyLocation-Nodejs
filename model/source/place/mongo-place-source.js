'use strict'

const mongoose = require('mongoose')
const objectId = require('mongodb').ObjectID
const Place = mongoose.model('Place')
const PlaceSource = function () { }

PlaceSource.prototype.getPlaces = (offset, limit) => {
  return Place.find().skip(offset).limit(limit).exec()
    .then(places => places.map(place => place.toResponseJson()))
}

PlaceSource.prototype.getPlaceById = (id) => {
  if (objectId.isValid(id)) {
    return Place.findById(id).exec()
      .then(place => {
        if (place) {
          return place.toResponseJson()
        } else {
          return place
        }
      })
  } else {
    return Promise.resolve(undefined)
  }
}

PlaceSource.prototype.addPlace = (place) => {
  const newPlace = new Place(place)
  return newPlace.save()
    .then(_ => newPlace.toResponseJson())
}

PlaceSource.prototype.updatePlace = (place) => {
  return Place.findByIdAndUpdate(place.place_id, place).exec()
}

PlaceSource.prototype.deletePlace = (id) => {
  return Place.findByIdAndRemove(id).exec()
}

PlaceSource.prototype.clearAll = () => {
  return Place.remove().exec()
}

module.exports = PlaceSource
