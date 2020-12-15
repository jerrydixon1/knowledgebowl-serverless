'use strict';

require('app-module-path').addPath(__dirname + '/..');

const co = require('co');
const Question = require('models/question');
const Category = require('models/category');
const parse = require('csv-parse');
const fs = require('fs');
const _ = require('lodash');

let questionCsvData = fs.readFileSync('legacy-data/Questions.csv', "utf8");
console.log(questionCsvData);
parse(questionCsvData, {delimiter: '|', quote: false}, function (err, questionRows) {
  if(err) {
    console.log(err);
  }
  _.each(questionRows, row => {
    co(function* () {
      const category = yield Category.where({category: row[5].split('_').join(' ')}).fetch();
      yield new Question({
        question: row[2],
        answer: row[3],
        point_value: parseInt(row[4]),
        category_id: category.get('id')
      }).save();
    }).catch(err => {
      console.log(err);
    })
  });
});