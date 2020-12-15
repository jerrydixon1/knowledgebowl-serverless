const _        = require('lodash');
const Question = require('./models/question');
const Category = require('./models/category');
const Promise  = require('bluebird');

Promise.coroutine(function* () {
  for(let i = 1; i <= 20; i++) {
    const category = yield new Category({category: 'Category' + i}).save();
    for(let j = 1; j <= 100; j++) {
      yield new Question({question: i + '_What is the meaning of life?_' + j, answer: i + '_42_' + j, point_value: i, category_id: category.get('id')}).save();
    }
  }
})().catch(err => console.log(err));