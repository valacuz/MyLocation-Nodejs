const router = require('express').Router()
const PlaceController = require('./../controller/place-controller')

router.get('/', PlaceController.prototype.getPlaces)
router.get('/:id', PlaceController.prototype.getPlaceById)
router.post('/', PlaceController.prototype.addPlace)
router.put('/:id', PlaceController.prototype.updatePlace)
router.delete('/:id', PlaceController.prototype.deletePlace)

// Otherwise, send 404 Not found
router.all('/', (_, response) => response.sendStatus(404))
router.all('/:id', (_, response) => response.sendStatus(404))

module.exports = router