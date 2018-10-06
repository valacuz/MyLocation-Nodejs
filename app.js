const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const mongoose = require('mongoose')
const config = require('./config')

const port = config.listenPort
const app = express()

// Wear helmet saves lives :)
app.use(helmet())
// Parse application/json
app.use(bodyParser.json())
// Connect to mongo db
mongoose.connect(config.mongoDbUrl, {
  user: config.mongoDbUser,
  pass: config.mongoDbPwd,
  useNewUrlParser: true
})
// Register model for mongoose
require('./model/source/place/mongo-place')
require('./model/source/type/mongo-type')
// Router
app.use(require('./route/v1'))
// Listen application with specify port number
app.listen(port, () => console.log(`Server listening on port ${port}`))

module.exports = app
