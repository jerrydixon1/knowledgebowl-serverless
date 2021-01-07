// Setup SES
const AWS = require('aws-sdk')
const SES = new AWS.SES({apiVersion: '2010-12-01', region: 'us-east-1'})

module.exports = {
  sendEmail: ({
    subject,
    to,
    from = `Knowledge Bowl Administrators <admin@${process.env.MAILGUN_DOMAIN}>`,
    text,
    html
  }) => {
    const params = {
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Subject: {
          Data: subject
        }
      },
      Source: from
    }

    if (text) {
      params.Message.Body = {
        Text: {
          Data: text
        }
      }
    } else if (html) {
      params.Message.Body = {
        Html: {
          Data: html
        }
      }
    }

    return SES.sendEmail(params).promise()
  }
}