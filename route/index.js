const router = require('express').Router()

router.use('/api', (request, res, next) => {
    // Do something when request was handled (like check token, write log).
    next()
})

router.use('/api/places', require('./place-route'))
router.use('/api/types', require('./place-type-route'))

module.exports = router