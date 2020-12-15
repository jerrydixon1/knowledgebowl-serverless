const overrideEmail = process.env.MAILGUN_OVERRIDE_EMAIL && process.env.MAILGUN_OVERRIDE_EMAIL !== 'false' ? process.env.MAILGUN_OVERRIDE_EMAIL : false

let mailgunService = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  overrideEmail
});

mailgunService.sendEmail = function (params, callback) {
  const overrideEmail = process.env.MAILGUN_OVERRIDE_EMAIL;
  if(overrideEmail && overrideEmail !== 'false') {
    params.to = overrideEmail;
  }
  params.from = `Knowledge Bowl Administrators <admin@${process.env.MAILGUN_DOMAIN}>`;

  mailgunService.messages().send(params, callback);
};

module.exports = mailgunService;