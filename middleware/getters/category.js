'use strict';

const CategoryService = require('services/category');

class CategoryGetters {

  /**
   * Get a question by ID and set it on the request.pre object
   * @param  {Object}   request The express request object
   * @param  {String}   request.body.id The ID for the question
   * @param  {String}   request.params.id The ID for the question
   * @param  {String}   request.params.questionId The ID for the question
   * @param  {Object}   response
   * @param  {Function} next
   * @return {*}
   */
  static async getById(request, response, next) {
    let id = request.params.categoryId || request.params.id || request.body.id;
    try {
      request.pre = request.pre || {};
      request.pre.category = await CategoryService.getById(id, {require: true});
      return next();
    } catch (err) {
      console.error(`Error finding category with ID ${id}`, err);
      response.boom.notFound('No category found with ID ' + id);
    }
  }

}

module.exports = CategoryGetters;