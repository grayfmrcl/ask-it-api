const router = require('express').Router()

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'connected to Ask IT API'
  })
})

module.exports = router;