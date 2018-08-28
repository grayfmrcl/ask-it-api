const jwt = require('jsonwebtoken')

const User = require('../models/user')

module.exports = {
  register: (req, res, next) => {
    const { name, email, password } = req.body

    User.findByEmail(email)
      .then(user => {
        if (user) {
          res.status(400).json([{ message: `email is already registered` }])
        } else {
          User.create({ name, email, password })
            .then(new_user => {
              res.status(201).json({ success: true })
            })
            .catch(err => next(err))
        }
      })
      .catch(err => next(err))
  },

  login: (req, res, next) => {
    const { email, password } = req.body

    User.findByEmail(email)
      .then(user => {
        if (user && user.validPassword(password)) {
          jwt.sign({ id: user.id }, process.env.JWT_KEY, (err, token) => {
            console.log(token)
            res.status(200).json({
              success: true,
              id: user.id,
              name: user.name,
              email: user.email,
              auth_token: token
            })
          })
        } else {
          res.status(400).json({ message: `invalid email/password` })
        }
      })
      .catch(err => next(err))
  }
}