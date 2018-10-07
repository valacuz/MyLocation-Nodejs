'use strict'

const uuidv4 = require('uuid/v4')
const PlaceSource = function () { }

var places = []

PlaceSource.prototype.getPlaces = async (offset, limit) => {
  offset = Math.max(0, offset)
  limit = Math.min(30, limit)
  return places.slice(offset, offset + limit)
}

PlaceSource.prototype.getPlaceById = async (id) => {
  return places.find(item => item.place_id === id)
}

PlaceSource.prototype.addPlace = async (place) => {
  place.place_id = uuidv4() // Insert or replace place_id with UUID
  places.push(place)
  return place
}

PlaceSource.prototype.updatePlace = async (place) => {
  const index = places.findIndex(item => item.place_id === place.place_id)
  if (index >= 0) {
    places[index] = place
  } else {
    throw Error('Place with given place_id was not found')
  }
}

PlaceSource.prototype.deletePlace = async (id) => {
  const index = places.findIndex(item => item.place_id === id)
  if (index >= 0) {
    places.splice(index, 1)
  } else {
    throw Error('Place with given place_id was not found')
  }
}

PlaceSource.prototype.clearAll = async () => {
  places.length = 0
}

module.exports = PlaceSource
