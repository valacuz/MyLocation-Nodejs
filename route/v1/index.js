const router = require('express').Router()

router.use('/api/places', require('./place-route'))
router.use('/api/types', require('./place-type-route'))

module.exports = router
