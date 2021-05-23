const express = require('express')
const config = require('./config')
const _ = require('lodash')
const control_panel = require('./control-panel')
const shout = require('./shout')
const log = require('./util/log')

let app = express()
let tools = {
  quote: {title: 'Pointless quote', path: '/quote'},
  cp: {title: 'Pointless control panel', path: '/cp'},
  shout: {disabled: true, title: 'Pointless shouting email address', path: '/shout'},
}
let register_tool = (opt) => {
  tools[opt.name] = opt
  opt.title = opt.name[0].toUpperCase() + opt.name.slice(1)
}
let tool_index = (req, res, next) => {
  let html = '<h1>Pointless Services</h1>'
  +_(tools)
  .filter(tool=>!tool.disabled)
  .map(tool => {
    return `<a href="${tool.path}">${tool.title}</a>`
  }).join('<br>')
  res.set('Content-Type', 'text/html')
  res.send(html)
}
app.use(control_panel.site_status)
app.get('/', tool_index)
app.get(tools.quote.path, require(`./tools/quote`))
app.use(tools.cp.path, control_panel)
app.use(tools.shout.path, shout.routes())
app.listen(config.port, () => {
  console.log(`Listening on :${config.port}`)
  shout.init().catch(log.error)
})
