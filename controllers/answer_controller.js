const Answer = require('../models/answer')
const Question = require('../models/question')

const vote = (voteType, req, res, next) => {
  Answer.findById(req.params.id)
    .then(answer => {
      if (!answer) {
        next()
      } else if (answer.user.equals(req.user.id)) {
        res.status(403).json({ message: 'You are not allowed to vote your own answer' })
      } else {
        answer.vote(voteType, req.user.id)
          .then(answer => res.status(200).json({
            success: true,
            votes: answer.votes
          }))
      }
    })
}

module.exports = {
  all: (req, res, next) => {
    Answer.find({ question: req.params.qid })
      .populate('user')
      .then(answers => {
        res.status(200).json(answers)
      })
      .catch(err => next(err))
  },
  create: (req, res, next) => {
    Question.findById(req.params.qid)
      .then(question => {
        if (question) {
          Answer.create({
            user: req.user.id,
            question: req.params.qid,
            content: req.body.content
          })
            .then(newanswer => {
              res.status(201).json({
                success: true,
                content: newanswer.content
              })
            })
            .catch(err => next(err))
        } else { next() }
      })
  },
  edit: (req, res, next) => {
    Answer.findOne({
      _id: req.params.id,
      user: req.user.id,
      question: req.params.qid
    })
      .then(answer => {
        if (answer) {
          answer.content = req.body.content || answer.content
          answer.save()
            .then(updatedanswer => {
              res.status(200).json({
                success: true,
                title: updatedanswer.title,
                content: updatedanswer.content
              })
            })
        } else { next() }
      })
  },
  upvote: (req, res, next) => {
    vote('up', req, res, next)
  },
  downvote: (req, res, next) => {
    vote('down', req, res, next)
  }
}