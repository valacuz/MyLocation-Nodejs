'use strict'

const Joi = require('joi')

const Validator = function () { }

const PLACE_SCHEMA = Joi.object().keys({
  place_id: Joi.string().min(6).max(50),
  place_name: Joi.string().min(4).max(255).required(),
  place_type: Joi.string().min(4).max(50).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  starred: Joi.boolean().default(false),
  picture_url: Joi.string().allow(null)
}).required()

const TYPE_SCHEMA = Joi.object().keys({
  type_id: Joi.string().min(4).max(50),
  type_name: Joi.string().min(4).max(255).required()
}).required()

const USER_SCHEMA = Joi.object().keys({
  user_id: Joi.string().min(10).max(50),
  user_login: Joi.string().alphanum().min(8).max(50),
  user_password: Joi.string().regex(/^[a-zA-Z0-9/@/-/_]{8,50}$/),
  user_email: Joi.string().email({ minDomainAtoms: 2 }),
  group_id: Joi.string().min(10).max(50)
}).required()

const USER_GROUP_SCHEMA = Joi.object().keys({
  group_id: Joi.string().min(10).max(50),
  group_name: Joi.string().alphanum().min(4).max(100),
  can_insert: Joi.boolean().default(false),
  can_update: Joi.boolean().default(false),
  can_delete: Joi.boolean().default(false)
}).required()

Validator.prototype.validatePlace = (place) => Joi.validate(place, PLACE_SCHEMA)
Validator.prototype.validatePlaceType = (type) => Joi.validate(type, TYPE_SCHEMA)
Validator.prototype.validateUser = (user) => Joi.validate(user, USER_SCHEMA)
Validator.prototype.validateGroup = (group) => Joi.validate(group, USER_GROUP_SCHEMA)

module.exports = Validator
