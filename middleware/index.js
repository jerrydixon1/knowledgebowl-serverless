'use strict';

module.exports = {
  getters: require('middleware/getters'),
  validation: require('middleware/validation'),
  authorized: require('middleware/roles-authorize'),
  authenticate: require('middleware/authenticate')
};