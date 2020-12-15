
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('category', function (table) {
      table.comment('Category table for Knowledge Bowl');
      table.increments('id').primary().unsigned();
      table.string('category').notNull().unique();
      table.index('id');
    })
  ]);
};

exports.down = function(knex, Promise) {

};
