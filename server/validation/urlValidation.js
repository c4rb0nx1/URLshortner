const { validate, ValidationError, Joi } = require('express-validation');


const shortenValidation = {
    body: Joi.object({
      userID: Joi.string().regex(/[0-9]/).required(),
      parentUrl: Joi.string().uri().required(),
      customAlias: Joi.string().optional(),
    }),
  }



const removeUrlValidation = {
    query: Joi.object({
      id: Joi.string().required(),
    }),
  }



  const redirectValidation = {
    params: Joi.object({
      short: Joi.string().required(),
    }),
    query: Joi.object({
      id: Joi.string().required(),
    }),
  }
  

  module.exports = {
    shortenValidation,
    removeUrlValidation,
    redirectValidation
  }