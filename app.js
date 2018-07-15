const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const port = process.env.port || 8124
const app = express()

// Wear helmet saves lives :)
app.use(helmet())

// Parse application/json
app.use(bodyParser.json())

// Router
app.use(require('./route'))

// Listen application with specify port number
app.listen(port, () => console.log(`Server listening on port ${port}`))

module.exports = app