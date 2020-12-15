'use strict';

// Configs
const jwtSecret = process.env.JWT_SECRET;
const baseUrl = process.env.BASE_URL;

// NPM modules
const mailgun = require('services/mailgun');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Models
const User = require('models/user');

class AuthController {

  /**
   * User login endpoint
   * @param {Object} request The express request object
   * @param {String} request.body.username The username to login with
   * @param {String} request.body.password The user's password
   * @param response
   * @return {*}
   */
  static async login(request, response) {
    try {
      const user = request.pre.user;
      const isValidPassword = await user.validPassword(request.body.password);
        console.log('logging in...')
      if (isValidPassword) {
        console.log('valid password...')
        const token = jwt.encode(user, jwtSecret);
        response.json({
          success: true,
          token: `JWT ${token}`,
          user: user
        });
      } else {
        console.log('bad password...')
        response.boom.unauthorized();
      }
    } catch (err) {
      console.log(err);
      response.boom.internal(err);
    }
  }

  /**
   * Resend a creation email to a user
   * @param {Object} request The express request object
   * @param {String} request.pre.user The user to resend the email to
   * @param {Object} response The express response object
   * @return {Promise.<void>}
   */
  static async resendUserCreationLink(request, response) {
    try {
      let user = request.pre.user;
      const passwordHash = crypto.randomBytes(64).toString('hex');
      const passwordResetExpiration = 1000 * 60 * 24 * 40000;
      user = user.save({
        password_reset_token: passwordHash,
        password_reset_expiration: passwordResetExpiration
      }, {
        method: 'update',
        patch: true
      });
      mailgun.sendEmail({
        subject: 'Knowledge Bowl account created',
        to: user.get('username'),
        from: 'support@knowledgebowlcbiohio.com',
        text: `Welcome to the Knowledge bowl app! Please click here to reset your password and login: ${baseUrl}/reset-password/${passwordHash}`
      });
      response.json(user);
    } catch (err) {
      console.log(err);
      response.boom.internal(err);
    }
  }

  /**
   * User register endpoint for admins to use
   * @param {Object} request The express request object
   * @param {String} request.body.username The new user's username
   * @param {String} request.body.first_name The new user's first name
   * @param {String} request.body.last_name The new user's last name
   * @param {String} request.body.role The new user's role (ADMIN|USER)
   * @param {Object} response The express response object
   * @return {*}
   */
  static async registerUser(request, response) {
    try {
      const {username, first_name, last_name, role} = request.body;
      const passwordHash = crypto.randomBytes(64).toString('hex');
      const passwordResetExpiration = 1000 * 60 * 24 * 40000;

      new User({
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: passwordHash,
        role: role,
        requires_password_reset: true,
        active: true,
        password_reset_token: passwordHash,
        password_reset_expiration: passwordResetExpiration
      }).save().then(user => {
        mailgun.sendEmail({
          subject: 'Knowledge Bowl account created',
          to: username,
          from: 'support@knowledgebowlcbiohio.com',
          text: `Welcome to the Knowledge bowl app! Please click here to reset your password and login: ${baseUrl}/reset-password/${passwordHash}`
        });
        response.json(user);
      }).catch(err => {
        console.log(err);
        response.boom.internal(err);
      });

    } catch (err) {
      console.log(err);
      response.boom.internal(err);
    }
  }

  /**
   * Controller method for sending a forgot password email to a user
   * @param request
   * @param response
   * @return {Promise.<void>}
   */
  static async forgotPassword(request, response) {
    const passwordHash = crypto.randomBytes(64).toString('hex');
    const passwordResetExpiration = 1000 * 60 * 24 * 2;
    try {
      let user = request.pre.user;
      user = await user.save({
        password_reset_token: passwordHash,
        password_reset_expiration: passwordResetExpiration,
        requires_password_reset: false
      }, {
        method: 'update',
        patch: true
      });
      await mailgun.sendEmail({
        subject: 'Knowledge Bowl password reset instructions',
        to: user.get('username'),
        from: 'support@knowledgebowlcbiohio.com',
        text: `You have sent a request to reset your password. Please navigate to this URL and fill out the form in order to reset it: ${baseUrl}/reset-password/${passwordHash}`
      });
      response.json(user);
    }  catch (err) {
      console.error('Error occurred for forgot password: ', err);
      response.boom.internal();
    }
  }

  /**
   * Look up a user by password reset token
   * @param request
   * @param request.pre.user The user, looked up in middleware by password reset token
   * @param response
   * @return {Promise.<void>}
   */
  static async lookupPasswordResetToken(request, response) {
    try {
      response.json({token: request.pre.user.get('password_reset_token')});
    } catch (err) {
      console.log('Error occurred while looking up a user by password reset token: ', err);
      response.boom.internal();
    }
  }

  /**
   * Perform a password reset
   * @param request
   * @param request.body.newPassword The user's new password
   * @param request.body.passwordResetToken the user's password reset token
   * @param request.pre.user The user, looked up by password reset token
   * @param response
   * @return {Promise.<void>}
   */
  static async resetPassword(request, response) {
    try {
      let user = request.pre.user;
      user = await user.save({
        password: request.body.newPassword,
        password_reset_token: null,
        password_reset_expiration: null,
        requires_password_reset: false
      });
      response.json(user);
    } catch (err) {
      console.log(err);
      response.boom.internal('An unknown error occurred during the password reset. Please contact support.');
    }
  }

  /**
   * Get the current user
   * @param request
   * @param request.user
   * @param response
   */
  static getCurrentUser(request, response) {
    response.json(request.user)
  }

}

module.exports = AuthController;