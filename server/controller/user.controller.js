const db = require('../db')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require("./config")
const generateAccessToken = (id, role_id) => {
    const payload = {
        id,
        role_id
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class UserController {
    async regestration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new Error("Ошибка при регистрации");
            } 
            const {user_email, user_login, password} = await req.body;
            const chekName = await db.query(`SELECT user_login, password FROM passwords where user_login = '${user_login}'`);
            if (chekName.rows.length !== 0) {
                throw new Error("Пользователь с таким именем уже сущестует");
            }
            const checkEmail = await db.query(`SELECT user_email, password FROM passwords where user_email = '${user_email}'`);
            if (checkEmail.rows.length !== 0) {
                throw new Error("Пользователь с такой почтой уже сущестует");
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = await db.query(`INSERT INTO passwords (user_email, user_login, password) values ($1, $2, $3) RETURNING *`, 
            [user_email, user_login, hashPassword]);
            res.json(user.rows[0]);
            return res.json({message: "Пользоватаель успешно зарегестрирован"})
        } catch(e) {
            return res.status(400).json( {message: `${e}`} )
        }
    }
    async login(req, res) {
        try {
            const {user_login: userLoginToken, password: passwordToken} = await req.body;
            const fromdb = await db.query(`SELECT user_login, password FROM passwords where user_login = '${userLoginToken}'`);
            if (fromdb.rows.length === 0) {
                throw new Error();
            }
            const {user_login: userLogin, password} = fromdb.rows[0];

            const validPassword = bcrypt.compareSync(passwordToken, password);
            if (!validPassword) {
                throw new Error();
            } 
            const token = generateAccessToken(fromdb.id, fromdb.role_id);
            return res.json({token});
        } catch(e) {
            return res.json("Пользователь/пароль не подходит");
        }    
    }
    async getUsers(req, res) {
        const users = await db.query(`SELECT * FROM passwords`);
        res.json(users.rows);
    }
    async getOneUser(req, res) {
        const user_id = req.params.user_id;
        const user = await db.query(`SELECT * FROM passwords where user_id = $1`, [user_id]);
        res.json(user.rows[0]);
    }
    async updateUserPassword(req, res) {
        const {user_login, password} = req.body;
        const user = await db.query(`UPDATE passwords set password = $2 where user_login = $1 RETURNING *`,
        [user_login, password]);
        res.json(user.rows[0]);
    }
    async updateUser(req, res) {
        const {user_login, user_id} = req.body;
        const user = await db.query(`UPDATE passwords set user_login = $2 where user_id = $1 RETURNING *`,
        [user_id, user_login]);
        res.json(user.rows[0]);
    }
    async deleteUser(req, res) {
        const user_id = req.params.user_id;
        const todo = await db.query(`DELETE FROM todo where user_id = $1`, [user_id]);
        const profile = await db.query(`DELETE FROM users where user_id = $1`, [user_id]);
        const user = await db.query(`DELETE FROM passwords where user_id = $1`, [user_id]);
        res.json(todo.rows[0]);
        res.json(profile.rows[0]);
        res.json(user.rows[0]);
        
    }
}

module.exports = new UserController();