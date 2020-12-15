'use strict';

//
// MODULES/SERVICES
//

const controller = require('./controller');
const { celebrate, Joi } = require('celebrate');
const Middleware = require('middleware');
const express = require('express');

const router = express.Router();

//
// ENDPOINTS
//

// Login endpoint
router.post(
  '/login',
  celebrate({
    body: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    })
  }),
  Middleware.getters.user.findByUsername,
  controller.login
);

// User register endpoint
router.post(
  '/register',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    body: Joi.object().keys({
      username: Joi.string().email().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      role: Joi.string().required().valid(['ADMIN', 'USER'])
    })
  }),
  Middleware.validation.disallowExistingUsername,
  controller.registerUser
);

// User resend creation link endpoint
router.post(
  '/resend-creation-email',
  Middleware.authenticate(),
  Middleware.authorized('ADMIN'),
  celebrate({
    body: Joi.object().keys({
      id: Joi.number().required()
    })
  }),
  Middleware.getters.user.getById,
  controller.resendUserCreationLink
);

// Forgot password email endpoint
router.post(
  '/forgot-password',
  celebrate({
    body: Joi.object().keys({
      username: Joi.string().email().required()
    })
  }),
  Middleware.getters.user.findByUsername,
  controller.forgotPassword
);

// Password reset lookup endpoint
router.get(
  '/password-reset-token/authorize/:passwordResetToken',
  celebrate({
    params: Joi.object().keys({
      passwordResetToken: Joi.string().required()
    })
  }),
  Middleware.getters.user.findByPasswordResetToken,
  controller.lookupPasswordResetToken
);

// Password reset creation endpoint
router.post(
  '/reset-password',
  celebrate({
    body: Joi.object().keys({
      passwordResetToken: Joi.string().required(),
      newPassword: Joi.string().required()
    })
  }),
  Middleware.getters.user.findByPasswordResetToken,
  controller.resetPassword
);

// Current user get endpoint
router.get(
  '/current-user',
  Middleware.authenticate(),
  controller.getCurrentUser
);

module.exports = router;