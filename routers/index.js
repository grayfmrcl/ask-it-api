const router = require('express').Router()

const User = require('../models/user')

const auth = require('./auth_router')
const questions = require('./question_router')
const answers = require('./answer_router')

const { bearerAuthentication } = require('../helpers/auth_helper')

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'connected to Ask IT API'
  })
})

router.use('/auth', auth)
router.use('/questions', questions)
router.use('/answers', bearerAuthentication, answers)

module.exports = router;