const express = require('express');
const path = require('path')

const app = express();

app.use(express.json({ extended: true }))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/videos', express.static(path.join(__dirname, 'videos')))

app.use('/api', require('./routes/upload.route'));
const PORT = 5000;

app.listen(PORT, () => {
    console.log("server started")
})