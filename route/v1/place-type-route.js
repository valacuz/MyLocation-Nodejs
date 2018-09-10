const router = require('express').Router()
const TypeController = require('./../../controller/v1/type-controller')
const auth = require('./../auth')
const controller = new TypeController()

router.get('/', auth.rules.required, controller.getTypes)
router.get('/:id', auth.rules.required, controller.getTypeById)
router.post('/', auth.rules.required, controller.addType)
router.put('/:id', auth.rules.required, controller.updateType)
router.delete('/:id', auth.rules.required, controller.deleteType)

// Handling error
router.use(auth.jwtErrorHandling)

// Otherwise, send 404 Not found
router.all('/', (_, response) => response.sendStatus(404))
router.all('/:id', (_, response) => response.sendStatus(404))

module.exports = router