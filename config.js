'use strict';

module.exports = {
  db: {
    client: process.env.DATABASE_CLIENT,
    connection: process.env.DATABASE_URL
  },
  mailgun: {
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    overrideEmail: process.env.MAILGUN_OVERRIDE
  },
  security: {
    jwtSecret: process.env.SECURITY_JWT_SECRET,
    saltRounds: process.env.SECURITY_SALT_ROUNDS
  }
};