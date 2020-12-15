'use strict';

const _ = require('lodash');
const User = require('models/user');

class UserController {

  /**
   * List users, excluding logged in account
   * @param request
   * @param response
   * @return {Promise.<void>}
   */
  static async list (request, response) {
    try {
      const users = await User.where('id', '<>', request.user.id).orderBy('username').fetchAll();
      response.json(users);
    } catch(err) {
      console.log('Error listing users: ', err);
      response.boom.internal(err);
    }
  }

  /**
   * Toggle a user's active status on/off
   * @param {Object}  request The express request object
   * @param {User}    request.pre.user The user object
   * @param {Object}  request.body.data The data object
   * @param {int}     request.body.data.id The user's ID
   * @param {Boolean} request.body.data.active Flag denoting whether or not the user should be active now
   * @param {Object}  response The express response object
   * @return {*}      The http response
   */
  static async toggleActive(request, response) {
    try {
      let user = request.pre.user;
      user.set('active', request.body.data.active);
      await user.save();
      response.json({done: true});
    } catch (e) {
      console.error(`Error changing status of user ${_.get(request, 'body.data.id')}`, e);
      response.boom.internal(e);
    }
  }

  /**
   * Edit a user's settings
   * @param {Object} request The express request object
   * @param {Object} request.body The user settings to save
   * @param {User}   request.pre.user The user, queried via middleware
   * @param {Object} response The express response object
   * @return {*} The http response
   */
  static async edit(request, response) {
    try {
      let user = request.pre.user;
      user = await user.save(request.body, {
        method: 'update',
        patch: true
      });
      response.json(user);
    } catch(e) {
      console.error(`Error occurred while updating settings for user ${request.body.id}: `, e);
      response.boom.internal('Error occurred while updating user settings');
    }
  }

  /**
   * Get all users associated with a first and last name -- This is helpful for when the user has forgotten their email address
   * @param {Object} request The express request object
   * @param {String} request.body.firstName The first name to search by
   * @param {String} request.body.lastName  The last name to search by
   * @param {Object} response The express response object
   * @return {*} The http response
   */
  static async getAllByName(request, response) {
    const {firstName, lastName} = request.body;
    try {
      let users = await User.where({first_name: firstName, last_name: lastName}).fetchAll()
      let emails = [];
      _.each(users.models, user => {
        emails.push(user.get('username'));
      });
      response.json(emails);
    } catch (e) {
      console.error(`Error occurred while searching for users with name "${firstName + ' ' + lastName}": `, e);
      response.boom.internal(e);
    }
  }

  /**
   * Delete a user
   * @param {Object} request The express request object
   * @param {int}    request.params.userId The ID of the user being deleted
   * @param {User}   request.pre.user The user to delete, queried via middleware
   * @param {Object} response The express response object
   * @return {*} The http response
   */
  static async deleteUser(request, response) {
    try {
      let user = request.pre.user;
      await user.destroy();
      response.status(204).json({message: 'User ' + request.params.userId + ' deleted'});
    } catch (e) {
      console.log(`Error occurred while deleting user ${request.params.userId}: `, e);
      response.boom.internal(e);
    }
  }

}

module.exports = UserController;