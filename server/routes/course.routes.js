const Router = require('express')
const router = new Router()
const courseController = require('../controller/course.controller')

router.post('/course', courseController.createCourse);
router.get('/courses', courseController.getCourses);
router.get('/course/:course_id', courseController.getCourseById);
router.put('/course', courseController.updateCourse);
router.delete('/course/:courseId', courseController.deleteCourse);
router.get('/courses/:count', courseController.countCourse);

module.exports = router;