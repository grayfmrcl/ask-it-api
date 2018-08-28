const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const routers = require('./routers')

const app = express()
const port = process.env.PORT || 3000
const db_url = process.env.DB_URL

mongoose.connect(db_url, { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`connected to ${db_url}`));

app.use(cors())
app.use(morgan('dev'))

app.use('/', routers)

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Resources not found.'
  })
})

app.use((err, req, res) => {
  res.status(500).json({
    message: 'Oops.. Something went wrong.'
  })
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(port, console.log(`Listening on port ${port}`))
