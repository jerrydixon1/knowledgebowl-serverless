const serverless = require('serverless-http')
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/personalized', (req, res) => {
  res.send('Hello Jerry!')
})

module.exports.handler = serverless(app)