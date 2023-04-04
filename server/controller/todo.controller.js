const db = require('../db')

class TodoController {
    async createTodo(req, res) {
        const {user_id, body} = req.body;
        const newPerson = await db.query(`INSERT INTO todo (user_id, body) values ($1, $2) RETURNING *`, 
        [user_id, body]);
        res.json(newPerson.rows[0]);
    }
    async getTodo(req, res) {
        const user_id = req.params.user_id;
        const todo = await db.query(`SELECT * FROM todo where user_id = $1`, [user_id]);
        res.json(todo.rows);
    }
    async updateTodo(req, res) {
        const {todo_id, todo_status, body} = req.body;
        const todo = await db.query(`UPDATE todo set todo_status = $2, body = $3 where todo_id = $1 RETURNING *`,
        [todo_id, todo_status, body]);
        res.json(todo.rows[0]);
    }
    async deleteTodo(req, res) {
        const todo_id = req.params.todo_id;
        const todo = await db.query(`DELETE FROM todo where todo_id = $1`, [todo_id]);
        res.json(todo.rows[0]);       
    }
} 


module.exports = new TodoController();