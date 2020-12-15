'use strict';

require('app-module-path').addPath(__dirname);

const serverless = require('serverless-http')
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const configurePassport = require('./passport-jwt');
const apiRouter = require('./api');
const boom = require('express-boom');

const app = express();

try {
  app.use(passport.initialize());
  configurePassport();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Boom
  app.use(boom());

  // API routes
  console.log('apiRouter: ', apiRouter)
  app.use('/api', apiRouter);

  console.log('HERE...')

  module.exports.handler = serverless(app)
} catch (err) {
  console.error('ERROR:' , err)
}
