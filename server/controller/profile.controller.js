const db = require('../db')

class ProfileController {
    async createProfile(req, res) {
        const {user_id, user_name, user_login, user_description, links, avatar} = req.body;
        const newPerson = await db.query(`INSERT INTO users (user_id, user_name, user_login, user_description, links, avatar) values ($1, $2, $3, $4, $5, $6) RETURNING *`, 
        [user_id, user_name, user_login, user_description, links, avatar]);
        res.json(newPerson.rows[0]);
    }
    async getProfiles(req, res) {
        const profiles = await db.query(`SELECT * FROM users`);
        res.json(profiles.rows);
    }
    async getOneProfile(req, res) {
        const user_id = req.params.user_id;
        const profile = await db.query(`SELECT * FROM users where user_id = $1`, [user_id]);
        res.json(profile.rows[0]);
    }
    async updateProfile(req, res) {
        const {user_id, user_name, user_description, links, experience, avatar} = req.body;
        const profile = await db.query(`UPDATE users set user_name = $2, user_description = $3, links = $4, experience = $5, avatar = $6 where user_id = $1 RETURNING *`,
        [user_id, user_name, user_description, links, experience, avatar]);
        res.json(profile.rows[0]);
    }
} 

module.exports = new ProfileController();
