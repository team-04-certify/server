const router = require('express').Router()
const Controller = require('../controller/controller')

router.get('/', Controller.home)

module.exports = router