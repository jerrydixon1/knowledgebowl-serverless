'use strict';

const knex = require('knex-instance');

let bookshelf = require('bookshelf')(knex);
bookshelf.plugin('pagination');
bookshelf.plugin('visibility');   // Easily lets us hide information during the MODEL.toJSON() conversion. Glorified JSON marshaller, but nice.

module.exports = bookshelf;