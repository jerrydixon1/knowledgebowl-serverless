
exports.up = function(knex, Promise) {
  return knex.raw(`
    create or replace view question_vw as (
      select 
          q.id,
          q.question,
          q.answer,
          q.point_value,
          c.category,
          c.id as category_id
      from
          question q 
      join
          category c
      on
          c.id = q.category_id
    )
  `);
};

exports.down = function(knex, Promise) {
  
};
