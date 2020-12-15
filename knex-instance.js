console.log('process.env.DB_CLIENT: ', process.env.DB_CLIENT)

module.exports = require('knex')({
  client: process.env.DB_CLIENT,
  connection: process.env.DB_CONNECTION
});