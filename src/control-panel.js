const Router = require('express').Router
const file = require('./util/file')
const body_parser = require('body-parser')

const max_down = 600e3
let app = new Router()
let down_for = 0
setInterval(() => {
  if (down_for <= 0) {
    return
  }
  down_for -= 1e3
}, 1e3)
app.get('/', (req, res, next) => {
  file.send('control-panel.html', res).catch(next)
})
app.get('/status', (req, res, next) => {
  res.send({down_for})
})
app.post('/status', body_parser.json(), (req, res, next) => {
  let time = req.body.time
  if (time > max_down) {
    return res.status(403).json({error: 'Haha, fat chance'})
  }
  down_for = time
  res.json({status: 'ok'})
})
app.site_status = (req, res, next) => {
  if (down_for <= 0 || req.url === '/cp/status' && req.method === 'GET') {
    return next()
  }
  file.send('down.html', res.status(503)).catch(next)
}
module.exports = app
