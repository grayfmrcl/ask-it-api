const router = require('express').Router()

const answer = require('../controllers/answer_controller')

router.get('/:qid', answer.all)
router.post('/:qid', answer.create)
router.put('/:qid/:id', answer.edit)
router.patch('/:qid/upvote/:id', answer.upvote)
router.patch('/:qid/downvote/:id', answer.downvote)

module.exports = router