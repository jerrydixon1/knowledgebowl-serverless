'use strict';

const bookshelf = require('../bookshelf-instance');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcryptjs'));

module.exports = bookshelf.Model.extend({
  tableName: 'user',
  hidden: [
    'password',
    'password_reset_token'
  ],
  validPassword(password) {
    return bcrypt.compareAsync(password, this.attributes.password);
  },
  initialize() {
    this.on('saving', model => {
      if (!model.hasChanged('password')) {
        return;
      }

      return Promise.coroutine(function* () {
        const saltRounds = process.env.SALT_ROUNDS;
        const salt = yield bcrypt.genSaltAsync(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = yield bcrypt.hashAsync(model.attributes.password, salt);
        model.set('password', hashedPassword);
      })();
    });
  }
});