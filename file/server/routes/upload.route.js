const { Router } = require("express")
const fileMiddleware = require('../middleware/file')
const db = require('../db')
const router = Router()
const sharp = require('sharp')

router.post('/upload', fileMiddleware.single('avatar'), (req, res) => {
    try {
        if (req.file) {
            res.json(req.file);
            // let type = req.file.filename.split('.').pop()
            // let file = req.file.filename;
            // let s = file.slice(0, -(type.length));
            // type = 'webp';
            // newFile = s + type;
            async function func(req, res) {
                console.log(req.file.filename)
                const toDb = await db.query(`INSERT INTO photos (path) values ($1)`, [req.file.filename])
                res.json(toDb.filename);
            }
            func(req, res);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router

