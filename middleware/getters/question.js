'use strict';

const QuestionService = require('services/question');

class QuestionGetters {

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
    let id = request.params.questionId || request.params.id || request.body.id;
    try {
      request.pre = request.pre || {};
      request.pre.question = await QuestionService.get(id, {require: true});
      return next();
    } catch (err) {
      console.error(`Error finding question with ID ${id}`, err);
      response.boom.notFound('No question found with id ' + id);
    }
  }

}

module.exports = QuestionGetters;