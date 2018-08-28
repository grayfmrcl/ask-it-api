const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const routers = require('./routers')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

const db_url = process.env.DB_URL
mongoose.connect(db_url, { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`connected to ${db_url}`));

app.use('/', routers)

app.use('*', (req, res, next) => {
  res.status(404).json({
    error: 'Resource not found.'
  })
})

app.use(function (err, req, res, next) {
  console.log('ERROR', err)
  if (err.name == 'ValidationError') {
    let errors = Object.values(err.errors).map(e => {
      return { message: e.message };
    })
    res.status(400).json(errors)
  } else if (err.name == 'CastError' && err.kind == 'ObjectId') {
    res.status(404).json({ error: 'Resource not found.' })
  } else {
    console.log(err)
    res.status(500).json({
      error: 'Something went wrong in the server.'
    })
  }
})

app.listen(port, console.log(`Listening on port ${port}`))
