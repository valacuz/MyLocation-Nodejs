const router = require('express').Router()
const TypeController = require('./../controller/type-controller')
const controller = new TypeController()

router.get('/', controller.getTypes)
router.get('/:id', controller.getTypeById)
router.post('/', controller.addType)
router.put('/:id', controller.updateType)
router.delete('/:id', controller.deleteType)

// Otherwise, send 404 Not found
router.all('/', (_, response) => response.sendStatus(404))
router.all('/:id', (_, response) => response.sendStatus(404))

module.exports = router