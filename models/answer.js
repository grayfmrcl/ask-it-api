const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  content: {
    type: String,
  },
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId },
    voteType: { type: String }
  }],
  createdAt: {
    type: Date, default: new Date
  },
  updatedDate: {
    type: Date
  }
})

answerSchema.pre('save', function (next) {
  this.updatedAt = new Date
  next()
})

answerSchema.methods.vote = function (voteType, userId) {
  let vote = this.votes.find(vote => vote.user.equals(userId))
  if (!vote) {
    console.log(`hasn't vote yet`, voteType, userId)
    this.votes.push({ user: userId, voteType })
    return this.save()
  } else if (vote.voteType !== voteType) {
    console.log(`vote different type`, voteType, userId)
    vote.voteType = voteType
    return this.save()
  } else {
    console.log(`vote same type`)
    let index = this.votes.findIndex(vote => vote.user.equals(userId))
    this.votes.splice(index, 1)
    return this.save()
  }
}

module.exports = mongoose.model('Answer', answerSchema)