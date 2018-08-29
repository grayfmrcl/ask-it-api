const router = require('express').Router()

const auth = require('../controllers/auth_controller')

const { bearerAuthentication } = require('../helpers/auth_helper')

router.post('/signup', auth.register)
router.post('/signin', auth.login)
router.get('/me', bearerAuthentication, auth.me)
router.post('/facebook', auth.facebook)

module.exports = router