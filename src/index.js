const express = require('express')
const config = require('./config')

let app = express()
app.get('/quote', require('./tools/quote'))
app.listen(config.port, () => console.log(`Listening on :${config.port}`))
