const router = require('express').Router()

const auth = require('../controllers/auth_controller')

router.post('/signup', auth.register)
router.post('/signin', auth.login)

module.exports = router