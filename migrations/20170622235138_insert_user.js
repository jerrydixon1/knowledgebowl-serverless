
exports.up = function(knex, Promise) {
  return Promise.all([
    knex('user').insert([
      {
        username: 'jerrydixon1@gmail.com',
        password: '$2a$10$ZCvaUCNXFnOvcMXliZR/nOmBHSuAQrCduri0/BGYK6oU0xSdD/dgy',
        active: true,
        requires_password_reset: false,
        first_name: 'Jerry',
        last_name: 'Dixon',
        role: 'ADMIN'
      }
    ])
  ]);
};

exports.down = function(knex, Promise) {
  
};
