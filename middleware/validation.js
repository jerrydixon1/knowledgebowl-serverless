'use strict';

const UserService = require('services/user');
const Category = require('models/category');
const CategoryService = require('services/category');

class Validation {

  /**
   * Middleware function that disallows an existing user by the same username
   * @param {Object} request The request object
   * @param {String} request.body.username The username to check for
   * @param {Object} response The response object
   * @param {Function} next Middleware next() function
   * @return {void}
   */
  static async disallowExistingUsername(request, response, next) {
    let user = await UserService.findByUsername(request.body.username);
    if (user) {
      response.boom.badRequest('User already exists');
    } else {
      next();
    }
  }

  /**
   * Validate that a given category exists if a category_id is passed in
   * @param request The express request object. One of the following values must be present in the object:
   * @param request.body.category_id  (optional) The category ID passed in the JSON body
   * @param request.params.category_id (optional) The category ID passed as a param
   * @param response
   * @param next
   * @return {Promise.<void>}
   */
  static async validateCategoryExists(request, response, next) {
    let category_id = request.params.category_id || request.body.category_id;
    const category = await CategoryService.getById(category_id);
    if(!category) {
      response.boom.notFound(`No category found with ID ${category_id}`);
    } else {
      next();
    }
  }

  /**
   * Validate that a category does not exist
   * @param request The express request object. One of the following values must be present in the object:
   * @param request.body.category The category name
   * @param response
   * @param next
   * @return {Promise.<void>}
   */
  static async disallowExistingCategory(request, response, next) {
    let category = await CategoryService.findByCategory(request.body.category);
    if(category) {
      response.boom.badRequest(`Category "${request.body.category} already exists`);
    } else {
      next();
    }
  }

}

module.exports = Validation;