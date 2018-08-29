const Question = require('../models/question')

const vote = (voteType, req, res, next) => {
  Question.findById(req.params.id)
    .then(question => {
      if (!question) {
        next()
      } else if (question.user.equals(req.user.id)) {
        console.log('user sama')
        res.status(403).json({ message: 'You are not allowed to vote your own question' })
      } else {
        console.log('user gak sama')
        question.vote(voteType, req.user.id)
          .then(() => res.status(200).json())
      }
    })
}

module.exports = {
  all: (req, res, next) => {
    Question.find()
      .populate('user')
      .then(questions => {
        res.status(200).json(questions)
      })
      .catch(err => next(err))
  },
  me: (req, res, next) => {
    Question.find({ user: req.user.id })
      .then(questions => {
        res.status(200).json(questions)
      })
      .catch(err => next(err))
  },
  single: (req, res, next) => {
    Question.findById(req.params.id)
      .populate('user')
      .then(question => {
        if (question) {
          res.status(200).json(question)
        } else { next() }
      })
      .catch(err => next(err))
  },
  create: (req, res, next) => {
    Question.create({
      user: req.user.id,
      title: req.body.title,
      content: req.body.content
    })
      .then(newQuestion => {
        res.status(201).json({
          success: true,
          title: newQuestion.title,
          content: newQuestion.content
        })
      })
      .catch(err => next(err))
  },
  edit: (req, res, next) => {
    Question.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .then(question => {
        if (question) {
          question.content = req.body.content || question.content
          question.save()
            .then(updatedQuestion => {
              res.status(200).json({
                success: true,
                title: updatedQuestion.title,
                content: updatedQuestion.content
              })
            })
        } else { next() }
      })
  },
  remove: (req, res, next) => {
    Question.deleteOne({
      _id: req.params.id,
      user: req.user.id
    })
      .then(({ n }) => {
        if (n) {
          res.status(200).json({
            success: true
          })
        } else { next() }
      })
  },
  upvote: (req, res, next) => {
    vote('up', req, res, next)
  },
  downvote: (req, res, next) => {
    vote('downvote', req, res, next)
  }
}