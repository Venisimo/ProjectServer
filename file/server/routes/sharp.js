const sharp = require('sharp')

sharp("../images/2023-04-03T15-22-24.450Z-IMG_20221217_122957.jpg")
  .rotate()
  .resize(200)
  .toFile('2023-04-03T15-22-24.450Z-IMG_20221217_122957.webp')
  .then(data => console.log(data))
  .catch(err => console.log(err))