
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('user', function (table) {
      table.comment('User table for Knowledge Bowl');
      table.increments('id').primary().unsigned();
      table.string('username').unique().notNull();
      table.string('password').notNull();
      table.boolean('active').notNull();
      table.string('first_name');
      table.string('last_name');
      table.string('role').default('USER');
      table.boolean('requires_password_reset').notNull();
      table.string('password_reset_token');
      table.string('password_reset_expiration');
      table.index('id');
    })
  ]);
};

exports.down = function(knex, Promise) {

};
