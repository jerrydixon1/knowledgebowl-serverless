'use strict';

const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const passport = require('passport');
const Middleware = require('middleware');
const controller = require('./controller');

// List categories
router.get(
  '/list',
  Middleware.authenticate(),
  controller.list
);

// Create a new category
router.put(
  '/',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    body: Joi.object().keys({
      category: Joi.string().required()
    })
  }),
  Middleware.validation.disallowExistingCategory,
  controller.create
);

// Edit category
router.post(
  '/',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    body: Joi.object().keys({
      id: Joi.number().required(),
      category: Joi.string().required()
    })
  }),
  Middleware.getters.category.getById,
  controller.edit
);

// Delete Category
router.delete(
  '/:categoryId',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    params: Joi.object().keys({
      categoryId: Joi.number().required()
    })
  }),
  Middleware.getters.category.getById,
  controller.deleteCategory
);

module.exports = router;