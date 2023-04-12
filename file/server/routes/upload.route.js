const { Router } = require("express")
const fileMiddleware = require('../middleware/file')
const db = require('../db')
const router = Router()
const sharp = require('sharp')
const fs = require('fs')

router.post('/upload', fileMiddleware.single('avatar'), async (req, res) => {
    try {
        if (req.file) {
            let type = req.file.filename.split('.').pop()
            let f = req.file.filename;
            let s = f.slice(0, -(type.length));
            type = 'webp';
            newFile = s + type;
            const ImgBuffer = await fs.promises.readFile(req.file.path);
            const webpBuffer = await sharp(ImgBuffer).webp().toBuffer();
            const webpPath = req.file.destination + newFile;
            await fs.promises.writeFile(webpPath, webpBuffer);
            await fs.promises.unlink(req.file.path);
            res.type('image/webp');
            //res.send(???) //doesn't work
            async function func(req, res) {
                console.log(req.file.filename)
                const toDb = await db.query(`INSERT INTO photos (path) values ($1)`, [newFile])
                res.json(toDb.filename);
            }
            func(req, res);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router

