const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const typeSchema = new mongoose.Schema({
    type_name: { type: String, unique: true, required: [true, 'Must not empty'] }
})

typeSchema.plugin(uniqueValidator, { message: 'is already taken' });

// Cannot use arrow function (ref: https://github.com/Automattic/mongoose/issues/5057)
typeSchema.methods.toResponseJson = function () {
    return {
        type_id: this._id,
        type_name: this.type_name
    }
}

mongoose.model('PlaceType', typeSchema)