
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('question', function (table) {
      table.comment('Question table for Knowledge Bowl');
      table.increments('id').primary().unsigned();
      table.integer('category_id').references('category.id');
      table.string('question').notNull().unique();
      table.string('answer').notNull();
      table.integer('point_value').notNull();
      table.unique(['question', 'answer']);
      table.index('id');
    })
  ]);
};

exports.down = function(knex, Promise) {

};
