'use strict';

const _ = require('lodash');
const UserService = require('services/user');

class UserGetters {

  /**
   * Get a user by ID
   * @param {Object}   request The express request object
   * @param {int}      request.body.id      The ID to query
   * @param {int}      request.body.data.id The ID to query
   * @param {int}      request.params.id    The ID to query
   * @param {Object}   response The express reponse object
   * @param {Function} next
   * @return {*}
   */
  static async getById(request, response, next) {
    let id = _.get(request, 'params.userId') || _.get(request, 'body.id') || _.get(request, 'body.data.id') || _.get(request, 'params.id');
    if(!id) {
      return response.boom.badRequest('A user ID is required');
    }
    try {
      request.pre = request.pre || {};
      request.pre.user = await UserService.get(id, {require: true});
      return next();
    } catch (err) {
      console.error(`Error finding user by ID: ${id}`, err);
      response.boom.notFound('No user found with ID ' + id);
    }
  }

  /**
   * Get a user by username and set it on the request.pre object
   * @param  {Object}   request The express request object
   * @param  {String}   request.body.username The username for the user
   * @param  {Object}   response
   * @param  {Function} next
   * @return {*}
   */
  static async findByUsername(request, response, next) {
    try {
      request.pre = request.pre || {};
      request.pre.user = await UserService.findByUsername(request.body.username, {require: true});
      return next();
    } catch (err) {
      console.error(`Error finding user by username: ${request.body.username}`, err);
      response.boom.notFound('No user found with username ' + request.body.username);
    }
  }

  /**
   * Get a user by password reset token and set it on the request.pre object
   * @param  {Object}   request The express request object
   * @param  {String}   request.params.passwordResetToken The password reset token for the user
   * @param  {String}   request.body.passwordResetToken The password reset token for the user
   * @param  {Object}   response
   * @param  {Function} next
   * @return {*}
   */
  static async findByPasswordResetToken(request, response, next) {
    try {
      request.pre = request.pre || {};
      request.pre.user = await UserService.findByPasswordResetToken(request.params.passwordResetToken || request.body.passwordResetToken, {require: true});
      return next();
    } catch (err) {
      console.error(`Error finding user by password reset token ${request.body.passwordResetToken}:`, err);
      response.boom.notFound(`No user found password reset token ${request.body.passwordResetToken}`);
    }
  }
}

module.exports = UserGetters;