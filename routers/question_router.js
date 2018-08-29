const router = require('express').Router()

const question = require('../controllers/question_controller')
const { bearerAuthentication } = require('../helpers/auth_helper')

router.get('/', question.all)
router.get('/me', bearerAuthentication, question.me)
router.get('/:id', question.single)
router.post('/', bearerAuthentication, question.create)
router.put('/:id', bearerAuthentication, question.edit)
router.delete('/:id', bearerAuthentication, question.remove)
router.patch('/upvote/:id', bearerAuthentication, question.upvote)
router.patch('/downvote/:id', bearerAuthentication, question.downvote)

module.exports = router