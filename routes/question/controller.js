'use strict';

// NPM modules
const _ = require('lodash');
const Promise = require('bluebird');

// DB/Models
const Bookshelf = require('bookshelf-instance');
const Question = require('models/question');
const QuestionView = require('models/question-vw');
const Category = require('models/category');

class QuestionController {

  /**
   * List questions from the question table
   * @param {Object}  request                  The express request object
   * @param {int}     request.query.page       (optional) Pagination page for querying
   * @param {String}  request.query.search     (optional) Search parameter for querying
   * @param {Boolean} request.query.categorize (optional) Flag denoting whether or not to return a categorized list of questions
   * @param {Object}  request.query.filters    (optional) Additional filters to query by
   * @param response
   * @return {*}
   */
  static async list(request, response) {
    try {
      console.log('here1')
      let params = {};
      if (request.query.page) {
        params = {pagination: {page: request.query.page, pageSize: 25}};
      }
      if (request.query.search) {
        params.search = request.query.search;
      }
      if (request.query.categorize) {
        params.categorize = request.query.categorize;
      }
      if (request.query.filters) {
        params.filters = request.query.filters;
      }
      let questions = await new Question().list(params);
      if (params.categorize) {
        let questionMap = {};
        _.each(questions.models, question => {
          const category = question.get('category');
          if (!questionMap[category]) {
            questionMap[category] = [];
          }
          questionMap[category].push(question);
        });
        response.json({
          questions: questionMap,
          pagination: questions.pagination
        });
      } else {
        response.json({
          questions: questions.models,
          pagination: questions.pagination
        });
      }
    } catch (err) {
      console.log(err);
      response.boom.internal(err);
    }
  }

  /**
   * List questions by Ids
   * @param {Object} request
   * @param {String} request.params.idList The comma-separated list of IDs to query for
   * @param {Object} response
   */
  static listByIds(request, response) {
    // Format the id list into a list of integers
    let idList = request.params.idList;
    idList = idList.split(',');
    for (let i = 0; i < idList.length; i++) {
      idList[i] = parseInt(idList[i]);
    }

    // Query for each item in the id array and add them to the list
    let promises = [];
    _.each(idList, id => {
      promises.push(QuestionView.where({id: id}).fetch());
    });

    Promise.all(promises).then(questions => {
      return response.json({
        questions: questions
      });
    }).catch(err => {
      console.error(err);
      response.boom.internal(err);
    });
  }

  /**
   * Create a new question
   * @param {Object} request The express request object
   * @param {String} request.body.question    The question string
   * @param {String} request.body.answer      The question's answer
   * @param {int}    request.body.point_value The point value of the question
   * @param {int}    request.body.category_id The ID of the category assigned to this question
   * @param {Object} response The express response object
   * @return {*}     http response
   */
  static async create(request, response) {
    const {question, answer, point_value, category_id} = request.body;
    try {
      const newQuestion = await new Question({
        question: question,
        answer: answer,
        point_value: point_value,
        category_id: category_id
      }).save();
      response.json(newQuestion);
    } catch (err) {
      console.log(err);
      response.boom.internal(err);
    }
  }

  /**
   * Edit an existing question
   * @param request
   * @param request.body.id The id of the question to edit
   * @param request.body.question The question value
   * @param request.body.answer The answer to the question
   * @param request.body.point_value The point value of the question
   * @param request.body.category (optional) The category object
   * @param request.body.category_id The id of the category of the question
   * @param response
   * @return {Promise.<void>}
   */
  static async edit(request, response) {
    const {id, question, answer, point_value, category_id} = request.body;
    try {
      let existingQuestion = request.pre.question;
      existingQuestion.set('question', question);
      existingQuestion.set('answer', answer);
      existingQuestion.set('category_id', category_id);
      existingQuestion.set('point_value', point_value);
      response.json(await existingQuestion.save());
    } catch(err) {
      console.log(err);
      response.boom.internal(err);
    }
  }


  /**
   * Delete a question
   * @param {Object}   request
   * @param {int}      request.params.questionId The ID of the question to delete
   * @param {Question} request.pre.question      The question to delete, retrieved via middleware
   * @param {Object} response
   * @return {*} Http response
   */
  static async deleteQuestion(request, response) {
    try {
      response.json(await request.pre.question.destroy());
    } catch(err) {
      console.log(err);
      response.boom.internal(err);
    }
  }

}

module.exports = QuestionController;