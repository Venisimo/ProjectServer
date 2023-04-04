const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')
const {check} = require("express-validator")
const userMiddleware = require('../midleware/userMidleware')
router.post('/registration', 
[check('user_login', "Имя пользователя не может быть пустым").notEmpty(),
check('user_email', "Введите корректный email").isEmail(),  
check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min: 4, max: 10})], 
userController.regestration);
router.post('/login',userController.login);
router.get('/users', userMiddleware, userController.getUsers);
router.get('/user/:user_id', userController.getOneUser);
router.put('/user', userController.updateUser);
router.put('/user/password', userController.updateUserPassword);
router.delete('/user/:user_id', userController.deleteUser);
module.exports = router;