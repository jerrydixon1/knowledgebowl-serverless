'use strict';

const DEFAULT_COMPETITION_SETTINGS = require('constants/competition/default-settings');

const _ = require('lodash');
const knex = require('knex-instance');

class CompetitionController {

  /**
   * Generate questions for a competition
   * @param request
   * @param response
   * @return {Promise.<void>}
   */
  static async generateQuestions(request, response) {
    let settings = request.body.settings || DEFAULT_COMPETITION_SETTINGS;
    if(!settings.categories) {
      settings.categories = DEFAULT_COMPETITION_SETTINGS.categories;
    }
    if(!settings.numberOfQuestions) {
      settings.numberOfQuestions = DEFAULT_COMPETITION_SETTINGS.numberOfQuestions;
    }

    try {
      let qry = 'select category_id, count(*) as question_count from question_vw group by category_id';
      var categoryListStr = undefined;
      if(settings.categories !== '*') {
        categoryListStr = settings.categories.join(', ');
        qry = `select category_id, count(*) as question_count from question_vw where category_id in (${categoryListStr}) group by category_id`;
      }
      else {
        let categoryRows = (await knex.raw('select id from category')).rows;
        let categories = [];
        _.each(categoryRows, row => categories.push(row.id));
        categoryListStr = categories.join(', ');
      }

      let questionCounts = (await knex.raw(qry)).rows;
      let questionIds = [];
      for(let i = 0; i < questionCounts.length; i++) {
        const {category_id, question_count} = questionCounts[i];
        const questionIdRows = (await knex.raw(`select id from question where category_id = ${category_id} order by random() limit ${settings.numberOfQuestions}`)).rows;
        _.each(questionIdRows, row => questionIds.push(row.id));
      }
      let questionIdsStr = questionIds.join(', ');
      qry = `
        select
          *
        from
          question_vw
        where
          category_id in (${categoryListStr})
        ${questionIdsStr ? `and id in (${questionIdsStr})`: ''}
        order by random()
      `;
      response.json((await knex.raw(qry)).rows);

    } catch(err) {
      console.log(err);
      response.boom.internal(err);
    }
  }

}

module.exports = CompetitionController;