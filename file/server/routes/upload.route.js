const { Router } = require("express")
const fileMiddleware = require('../middleware/file')
const videoMiddleware = require('../middleware/video')
const db = require('../db')
const router = Router()
const sharp = require('sharp')
const fs = require('fs')
const { spawn } = require("child_process")
const path = require('path')

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
            res.json({
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                encoding: req.file.encoding,
                mimetype: 'image/webp',
                destination: req.file.destination,
                filename: `${req.file.filename}.webp`,
                path: webpPath,
                size: webpBuffer.length,
            });
            
            await db.query(`INSERT INTO photos (path) values ($1)`, [newFile]); //sending filename to database
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/uploadVideo', videoMiddleware.single('video'), async (req, res) => {
    try {
      if (req.file) {
        let type = req.file.filename.split('.').pop()
        let f = req.file.filename;
        let newFile = f.slice(0, -(type.length));
        const inputFile = req.file.path;
        const outputFile = path.join(req.file.destination, `${newFile}webm`);

        const ffmpegProcess = spawn('ffmpeg', [
            '-i', inputFile,
            '-c:v', 'libvpx',
            '-crf', '10',
            '-b:v', '1M',
            '-c:a', 'libvorbis',
            outputFile
        ]);

        ffmpegProcess.on('error', (err) => {
            console.log('Error occurred while converting the video:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        });

        ffmpegProcess.on('exit', async (code, signal) => {
            console.log(`FFmpeg process exited with code ${code} and signal ${signal}`);
            if (code === 0) {
                try {
                    await fs.promises.unlink(inputFile);
                    res.json({
                        fieldname: req.file.fieldname,
                        originalname: req.file.originalname,
                        encoding: req.file.encoding,
                        mimetype: 'video/webm',
                        destination: req.file.destination,
                        filename: `${req.file.filename}.webm`,
                        path: outputFile,
                        size: (await fs.promises.stat(outputFile)).size
                    });

                    await db.query(`INSERT INTO videos (path) values ($1)`, [`${newFile}webm`]); //sending filename to database

                } catch (err) {
                    console.log('Error occurred while deleting the original video:', err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                console.log('FFmpeg process failed to convert the video');
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
} catch (error) {
        console.log(error);
    }
});

module.exports = router

