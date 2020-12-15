'use strict';

const express = require('express');

const _ = require('lodash');
const router = express.Router();
const controller = require('./controller');
const Middleware = require('middleware');

// Questions endpoint for competitions
router.post(
  '/questions',
  Middleware.authenticate(),
  controller.generateQuestions
);


module.exports = router;