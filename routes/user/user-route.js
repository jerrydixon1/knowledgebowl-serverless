'use strict';

const express = require('express');

const { celebrate, Joi } = require('celebrate');
const router = express.Router();
const Middleware = require('middleware');
const controller = require('./controller');

// List users endpoint
router.get(
  '/list',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  controller.list
);

// Toggle "active" status of a user endpoint
router.post(
  '/toggle-active',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    body: Joi.object().keys({
      data: Joi.object().keys({
        id: Joi.number().required(),
        active: Joi.boolean().required(),
      })
    })
  }, {
    escapeHtml: true,
    allowUnknown: true
  }),
  Middleware.getters.user.getById,
  controller.toggleActive
);

// Edit user endpoint
router.post(
  '/edit',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    body: Joi.object().keys({
      id: Joi.number().required(),
      username: Joi.string().optional(),
      password: Joi.string().optional(),
      active: Joi.boolean().optional(),
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      role: Joi.string().optional().valid(['USER', 'ADMIN']),
      requires_password_reset: Joi.boolean().optional(),
      password_reset_token: Joi.string().optional(),
      password_reset_expiration: Joi.number().optional()
    })
  }),
  Middleware.getters.user.getById,
  controller.edit
);

// Get all users by name endpoint
router.post(
  '/getAllByName',
  celebrate({
    body: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required()
    })
  }),
  controller.getAllByName
);

// Delete user endpoint
router.delete(
  '/:userId',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    params: Joi.object().keys({
      userId: Joi.number().required()
    })
  }),
  Middleware.getters.user.getById,
  controller.deleteUser
);

module.exports = router;