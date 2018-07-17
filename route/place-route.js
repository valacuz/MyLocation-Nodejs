const router = require('express').Router()
const PlaceController = require('./../controller/place-controller')
const controller = new PlaceController()

router.get('/', controller.getPlaces)
router.get('/:id', controller.getPlaceById)
router.post('/', controller.addPlace)
router.put('/:id', controller.updatePlace)
router.delete('/:id', controller.deletePlace)

// Otherwise, send 404 Not found
router.all('/', (_, response) => response.sendStatus(404))
router.all('/:id', (_, response) => response.sendStatus(404))

module.exports = router