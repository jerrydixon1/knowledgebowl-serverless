'use strict';

const User = require('models/user');

class UserService {

  /**
   * Get a user by ID
   * @param {int} id The ID to query by
   * @param {Object} options (optional) Any bookshelf options to query with
   * @return {User} The user
   */
  static get(id, options = {}) {
    return User.where({id: id}).fetch(options);
  }

  /**
   * Simple lookup to get a user by username
   * @param {String} username The username to query by
   * @param {Object} options (optional) Any bookshelf options to query with
   * @return {User} The user
   */
  static findByUsername(username, options = {}) {
    return User.query(qb => {
      qb.where('username', 'ilike', username);
    }).fetch(options);
  }

  /**
   * Look up a user by password reset token
   * @param passwordResetToken The token to search by
   * @param {Object} options (optional) Any bookshelf options to query with
   * @return {User} The user
   */
  static findByPasswordResetToken(passwordResetToken, options = {}) {
    return User.where({password_reset_token: passwordResetToken}).fetch(options);
  }

}

module.exports = UserService;