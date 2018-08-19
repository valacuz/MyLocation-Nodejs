const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    place_name: { type: String, required: [true, 'Must not empty'] },
    place_type: { type: mongoose.Schema.Types.ObjectId, ref: 'PlaceType' },
    latitude: Number,
    longitude: Number,
    starred: Boolean,
    picture_url: String
})

// Cannot use arrow function (ref: https://github.com/Automattic/mongoose/issues/5057)
placeSchema.methods.toResponseJson = function () {
    return {
        place_id: this._id,
        place_name: this.place_name,
        place_type: this.place_type._id,
        latitude: this.latitude,
        longitude: this.longitude,
        starred: this.starred,
        picture_url: this.picture_url
    }
}

mongoose.model('Place', placeSchema)