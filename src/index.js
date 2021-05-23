const express = require('express')
const config = require('./config')
const _ = require('lodash')
const control_panel = require('./control-panel')
const shout = require('./shout')
const log = require('./util/log')

let tools = {}
let register_tool = (key, opt) => {
  opt.name = opt.name || key
  opt.title = opt.title || `Pointless ${opt.name}`
  opt.path = opt.path || `/${key}`
  opt.handler = typeof opt.handler == `string` ? require(opt.handler) :
    opt.handler
  tools[opt.name] = opt
}
register_tool('quote', {
  handler: './tools/quote.js',
})
register_tool('cp', {
  name: 'control panel',
  handler: control_panel,
})
register_tool('shout', {
  name: 'shouting email address',
  handler: shout.routes(),
  disabled: true,
})
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
let app = express()
app.use(control_panel.site_status)
app.get('/', tool_index)
for (let tool of Object.values(tools)) {
  if (tool.disabled) {
    continue
  }
  app.use(tool.path, tool.handler)
}
app.listen(config.port, () => {
  console.log(`Listening on :${config.port}`)
  shout.init().catch(log.error)
})
