const jwt = require('jsonwebtoken')
const {secret} = require('../controller/config')
const db = require('../db')

module.exports = function(roles) {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const fromdb = await db.query(`SELECT role_id FROM roles`);
            const {roles: userRoles = fromdb.rows} = jwt.verify(token, secret);
            console.log(roles);
            console.log(userRoles);
            let arrRole = [];
            let hasRole = false;
            for (let role in userRoles) {
                console.log(userRoles[role])
                for (let role_id in role) {
                    arrRole.push(Number(role[role_id]) + 1);
                }
            }
            arrRole.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                    console.log(role);
                } 
            })
            console.log(arrRole);
            if (!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"})
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
}
}