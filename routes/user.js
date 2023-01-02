
const userController = require('../controller/userController.js')



// router
const router = require('express').Router()


// use routers
router.post('/api/register', userController.addUser)

router.post('/api/login', userController.addUserLogin)


module.exports = router