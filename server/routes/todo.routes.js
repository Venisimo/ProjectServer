const Router = require('express')
const router = new Router()
const todoController = require('../controller/todo.controller')

router.post('/todo', todoController.createTodo);
// router.get('/courses', todoController.getCourses);
router.get('/todo/:user_id', todoController.getTodo);
router.put('/todo', todoController.updateTodo);
router.delete('/todo/:todo_id', todoController.deleteTodo);

module.exports = router;