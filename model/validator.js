const Joi = require('joi')

const Validator = function () { }

const PLACE_SCHEMA = Joi.object().keys({
    place_id: Joi.string().min(6).max(50),
    place_name: Joi.string().min(4).max(255).required(),
    place_type: Joi.string().min(4).max(50).required(),
    place_latitude: Joi.number().min(-90).max(90).required(),
    place_longitude: Joi.number().min(-180).max(180).required(),
    starred: Joi.boolean().default(false),
    picture_url: Joi.string().allow(null)
}).required()

const TYPE_SCHEMA = Joi.object().keys({
    type_id: Joi.string().min(4).max(50),
    type_name: Joi.string().min(4).max(255).required()
}).required()

Validator.prototype.validatePlace = (place) => Joi.validate(place, PLACE_SCHEMA)
Validator.prototype.validatePlaceType = (type) => Joi.validate(type, TYPE_SCHEMA)

module.exports = Validator