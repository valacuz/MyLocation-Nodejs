const router = require('express').Router()
const PlaceController = require('./../../controller/v1/place-controller')
const auth = require('./../auth')
const controller = new PlaceController()

router.get('/', auth.rules.required, controller.getPlaces)
router.get('/:id', auth.rules.required, controller.getPlaceById)
router.post('/', auth.rules.required, controller.addPlace)
router.put('/:id', auth.rules.required, controller.updatePlace)
router.delete('/:id', auth.rules.required, controller.deletePlace)

// Handling error
router.use(auth.jwtErrorHandling)

// Otherwise, send 404 Not found
router.all('/', (_, response) => response.sendStatus(404))
router.all('/:id', (_, response) => response.sendStatus(404))

module.exports = router