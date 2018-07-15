const router = require('express').Router()
const TypeController = require('./../controller/type-controller')

router.get('/', TypeController.prototype.getTypes)
router.get('/:id', TypeController.prototype.getTypeById)
router.post('/', TypeController.prototype.addType)
router.put('/:id', TypeController.prototype.updateType)
router.delete('/:id', TypeController.prototype.deleteType)

// Otherwise, send 404 Not found
router.all('/', (_, response) => response.sendStatus(404))
router.all('/:id', (_, response) => response.sendStatus(404))

module.exports = router