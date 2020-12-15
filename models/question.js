'use strict';

const bookshelf = require('../bookshelf-instance');
const QuestionView = require('./question-vw');
const _ = require('lodash');

module.exports = bookshelf.Model.extend({
  tableName: 'question',
  list: function (params = {}) {

    const qry = QuestionView.query(qb => {
      if(params.where) {
        qb.where(params.where);
      }
      if(params.search) {
        qb.where('question', 'like', '%' + params.search + '%')
          .orWhere('answer', 'like', '%' + params.search + '%');
      }
      if(params.filters) {
        _.each(JSON.parse(params.filters), (filter, filterName) => {
          if(filterName === 'category_id' && filter) {
            qb.where('category_id', filter);
          } else if(filter) {
            qb.where(filterName, 'ilike', '%' + filter + '%');
          }
        });

      }
    });

    const orders = params.orders || ['category', 'question'];
    _.each(orders, order => {
      qry.orderBy(order);
    });

    if(params.pagination) {
      return qry.fetchPage(params.pagination);
    }
    else {
      return qry.fetchAll();
    }

  }
});