const express = require('express')
const config = require('./config')
const _ = require('lodash')

let app = express()
let tools = {}
let register_tool = (opt) => {
  tools[opt.name] = opt
  opt.title = opt.name[0].toUpperCase() + opt.name.slice(1)
  app.get(`/${opt.name}`, require(`./tools/${opt.name}`))
}
let tool_index = (req, res, next) => {
  let html = '<h1>Pointless Services</h1>'
  +_.map(tools, tool => {
    return `<a href="/${tool.name}">${tool.title}</a>`
  }).join('<br>')
  res.set('Content-Type', 'text/html')
  res.send(html)
}
app.get('/', tool_index)
register_tool({name: 'quote'})
app.listen(config.port, () => console.log(`Listening on :${config.port}`))
