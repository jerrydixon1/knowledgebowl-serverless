'use strict';

const bookshelf = require('../bookshelf-instance');

module.exports = bookshelf.Model.extend({
  tableName: 'question_vw'
});