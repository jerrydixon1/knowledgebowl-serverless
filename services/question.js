'use strict';

const Question = require('models/question');

class QuestionService {

  /**
   * Get a question by ID
   * @param {int} id The ID to query by
   * @param {Object} options (optional) Any bookshelf options to query with
   * @return {Question} The question
   */
  static get(id, options = {}) {
    return Question.where({id: id}).fetch(options);
  }

}

module.exports = QuestionService;