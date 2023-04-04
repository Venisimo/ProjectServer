const Router = require('express')
const router = new Router()
const profileController = require('../controller/profile.controller')

router.post('/profile', profileController.createProfile);
router.get('/profile', profileController.getProfiles);
router.get('/profile/:user_id', profileController.getOneProfile);
router.put('/profile', profileController.updateProfile);

module.exports = router;