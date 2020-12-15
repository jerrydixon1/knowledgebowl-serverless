'use strict';

require('app-module-path').addPath(__dirname + '/..');

const co = require('co');
const Category = require('models/category');
const parse = require('csv-parse');
const fs = require('fs');
const _ = require('lodash');

let categoryCsvData = fs.readFileSync('legacy-data/Category.csv', "utf8");
parse(categoryCsvData, {delimiter: '|'}, function (err, categoryRows) {
  _.each(categoryRows, row => {
    new Category({category: row[1].split('_').join(' ')}).save();
  });
});