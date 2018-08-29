const jwt = require('jsonwebtoken')
const axios = require('axios')

const User = require('../models/user')

module.exports = {
  register: (req, res, next) => {
    const { name, email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ message: 'email and password is required' })
    } else {
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
    }
  },

  login: (req, res, next) => {
    const { email, password } = req.body

    User.findByEmail(email)
      .then(user => {
        if (user && user.validPassword(password)) {

          jwt.sign({ id: user._id }, process.env.JWT_KEY, (err, token) => {
            if (err) { console.log(err) }
            else {
              console.log(process.env.JWT_KEY, token)
              res.status(200).json({
                success: true,
                id: user.id,
                name: user.name,
                email: user.email,
                auth_token: token
              })
            }
          })

        } else {
          res.status(400).json({ message: `invalid email/password` })
        }
      })
      .catch(err => next(err))
  },

  me: (req, res, next) => {
    User.findById(req.user.id)
      .then(user => {
        res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
        })
      })
      .catch(err => next(err))
  },

  facebook: (req, res, next) => {
    axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${req.body.accessToken}`)
      .then(({ data }) => {
        User.findOne({ email: data.email })
          .then(user => {
            if (user) {

              jwt.sign({ id: user._id }, process.env.JWT_KEY, (err, token) => {
                if (err) { console.log(err) }
                else {
                  res.status(200).json({
                    success: true,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    auth_token: token
                  })
                }
              })

            }
            else {
              let new_user = new User({
                email: data.email,
                name: data.name
              })
              new_user.save()
                .then(new_user => {

                  jwt.sign({ id: unew_userser._id }, process.env.JWT_KEY, (err, token) => {
                    if (err) { console.log(err) }
                    else {
                      res.status(200).json({
                        success: true,
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        auth_token: token
                      })
                    }
                  })

                })
                .catch(err => next(err))
            }
          })
          .catch(err => next(err))
      })
      .catch(err => {
        if (err.response.status == 400) {
          res.status(400).json({ message: err.message })
        }
        else { next(err) }
      })
  }

}