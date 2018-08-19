const uuidv4 = require('uuid/v4')
const PlaceSource = function () { }

var places = []

PlaceSource.prototype.getPlaces = () => {
    return new Promise((resolve, reject) => {
        resolve(places)
    })
}

PlaceSource.prototype.getPlacesWithOffset = (limit, offset) => {
    return new Promise((resolve, reject) => {
        resolve(places.slice(offset, offset + limit))
    })
}

PlaceSource.prototype.getPlaceById = (id) => {
    return new Promise((resolve, reject) => {
        const place = places.find(item => item.place_id === id)
        resolve(place)
    })
}

PlaceSource.prototype.addPlace = (place) => {
    return new Promise((resolve, reject) => {
        place.place_id = uuidv4()   // Insert or replace place_id with UUID
        places.push(place)
        resolve(place)
    })
}

PlaceSource.prototype.updatePlace = (place) => {
    return new Promise((resolve, reject) => {
        var index = places.findIndex((item) => item.place_id == place.place_id)
        if (index >= 0) {
            places[index] = place
            resolve()
        } else {
            reject(Error('Place wtih given id was not found.'))
        }
    })
}

PlaceSource.prototype.deletePlace = (id) => {
    return new Promise((resolve, reject) => {
        // We cannot delete item from array directly,
        // so we used to filter items which is `place_id` is not matched to given id
        // (the matched will not included to new array)
        var index = places.findIndex(item => item.place_id == id)
        if (index >= 0) {
            places = places.filter(item => item.place_id !== id)
            resolve()
        } else {
            // Cannot delete item because we cannot find item with `place_id` is matched to given id
            reject(Error('Place with given id was not found.'))
        }
    })
}

PlaceSource.prototype.clearAll = () => {
    return new Promise((resolve, reject) => {
        places = []
        resolve()
    })
}

module.exports = PlaceSource