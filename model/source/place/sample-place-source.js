const PlaceSource = function () { }

PlaceSource.prototype.getPlaces = () => {
    return new Promise((resolve, reject) => {
        resolve(places)
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

PlaceSource.prototype.clear = () => {
    return new Promise((resolve, reject) => {
        places = []
        resolve()
    })
}

module.exports = PlaceSource

var places = [
    {
        place_id: "A0000001",
        place_name: "Chulalongkorn university",
        place_type: 1,
        latitude: 13.7419273,
        longitude: 100.5256927,
        starred: true,
        picture_url: "https://img.wongnai.com/p/1920x0/2016/07/04/f0a2624263f34d3bb469c5553b48e014.jpg"
    },
    {
        place_id: "A0000002",
        place_name: "The old siam",
        place_type: 2,
        latitude: 13.7492849,
        longitude: 100.4989994,
        starred: false,
        picture_url: "http://www.theoldsiam.co.th/images/banner_07.jpg"
    },
    {
        place_id: "A0000003",
        place_name: "Bobae Tower",
        place_type: 2,
        latitude: 13.7492849,
        longitude: 100.4989994,
        starred: false,
        picture_url: null
    },
    {
        place_id: "A0000004",
        place_name: "Grand china hotel",
        place_type: 4,
        latitude: 13.7423837,
        longitude: 100.5075352,
        starred: true,
        picture_url: "https://q-ak.bstatic.com/images/hotel/max1280x900/563/56326449.jpg"
    }
]