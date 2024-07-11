const { validate, ValidationError, Joi } = require('express-validation');

const newUserValidation = {
    body: Joi.object({
      name: Joi.string().regex(/[a-zA-Z]{4,30}/).required(),
      email: Joi.string().email().required(),
      password: Joi.string().regex(/[a-zA-Z0-9@#%&]{8,30}/).required(),
    }),
  }


const authValidation = {
body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9@#%&]{8,30}/).required(),
}),
}


const removeUserValidation = {
    query: Joi.object({
      id: Joi.string().regex(/[0-9]/).required(),
    }),
  }


module.exports = {
    newUserValidation,
    authValidation,
    removeUserValidation
}