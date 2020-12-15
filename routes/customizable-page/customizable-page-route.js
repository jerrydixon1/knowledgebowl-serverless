'use strict';

const express = require('express');

const fs = require('fs');
const router = express.Router();
const Middleware = require('middleware');
const controller = require('./controller');
const { celebrate, Joi } = require('celebrate');

// Read in a customizable page
router.get(
  '/:fileName',
  celebrate({
    params: Joi.object().keys({
      fileName: Joi.string().required()
    })
  }),
  controller.read
);

// Edit a customizable page
router.post(
  '/:fileName',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    params: Joi.object().keys({
      fileName: Joi.string().required()
    }),
    body: Joi.object().keys({
      html: Joi.string().required()
    })
  }),
  controller.write
);

module.exports = router;