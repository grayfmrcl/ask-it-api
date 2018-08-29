const router = require('express').Router()

const auth = require('./auth_router')
const questions = require('./question_router')

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'connected to Ask IT API'
  })
})

router.use('/auth', auth)
router.use('/questions', questions)

module.exports = router;