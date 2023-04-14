const { Router } = require("express")
const fileMiddleware = require('../middleware/file')
const videoMiddleware = require('../middleware/video')
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
            res.send({
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                encoding: req.file.encoding,
                mimetype: 'image/webp',
                destination: req.file.destination,
                filename: `${req.file.filename}.webp`,
                path: webpPath,
                size: webpBuffer.length,
            })
            async function func(req, res) {
                console.log(req.file)
                const toDb = await db.query(`INSERT INTO photos (path) values ($1)`, [newFile])
                res.json(toDb.newFile);
            }
            func(req, res);
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/uploadVideo', videoMiddleware.single('video'), async (req, res) => {
    try {
        if (req.file) {
            res.json(req.file);
            async function func(req, res) {
                console.log(req.file)
                const toDb = await db.query(`INSERT INTO videos (path) values ($1)`, [req.file.filename])
                res.json(toDb.newFile);
            }
            func(req, res);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router

