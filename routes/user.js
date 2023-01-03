
const userController = require('../controller/userController.js')
const productController = require('../controller/productController.js')
const checkAuth = require('../middleware/check-auth.js');
const  adduservali  = require('../validation/auth-validation.js');


// router
const router = require('express').Router()


// register-login routers
router.post('/api/register',adduservali.adduservali  ,userController.addUser)

router.post('/api/login', userController.addUserLogin)

router.get('/api/getUsers', userController.getAllUsers)

router.get('/api/getUser/:id', userController.getOneUser)

router.delete('/api/deleteUser/:id', userController.deleteUser)

router.put('/api/updateUser/:id', userController.updateUser)







// product router.....
router.post('/addProduct',checkAuth.checkAuth, productController.addProduct)

router.get('/allProducts',checkAuth.checkAuth, productController.getAllProducts)

router.get('/:id',checkAuth.checkAuth, productController.getOneProduct)

router.put('/:id',checkAuth.checkAuth, productController.updateProduct)

router.delete('/:id',checkAuth.checkAuth, productController.deleteProduct)


module.exports = router