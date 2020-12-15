'use strict';

const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const passport = require('passport');
const Middleware = require('middleware');
const controller = require('./controller');

// List questions endpoint
router.get(
  '/list',
  Middleware.authenticate(),
  controller.list
);

// Endpoint to list by comma-separated id list
router.get(
  '/list-by-ids/:idList',
  Middleware.authenticate(),
  celebrate({
    body: Joi.object().keys({
      idList: Joi.string().required()
    })
  }),
  controller.listByIds
);

// Create question endpoint
router.put(
  '/',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    body: Joi.object().keys({
      question:    Joi.string().required(),
      answer:      Joi.string().required(),
      point_value: Joi.number().required(),
      category_id: Joi.number().required()
    })
  }),
  Middleware.validation.validateCategoryExists,
  controller.create
);

// Edit existing question
router.post(
  '/',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    body: Joi.object().keys({
      id:          Joi.number().required(),
      question:    Joi.string().required(),
      answer:      Joi.string().required(),
      point_value: Joi.number().required(),
      category_id: Joi.number().required(),
      category:    Joi.string().optional()
    })
  }),
  Middleware.validation.validateCategoryExists,
  Middleware.getters.question.getById,
  controller.edit
);

// Delete a question
router.delete(
  '/:questionId',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    params: Joi.object().keys({
      questionId: Joi.number().required()
    })
  }),
  Middleware.getters.question.getById,
  controller.deleteQuestion
);

module.exports = router;