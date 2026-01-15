

import Joi from 'joi'

export const userValidator = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    bio: Joi.string().max(300).allow(""),
    age: Joi.string().required(),
    gender: Joi.string().required()
})