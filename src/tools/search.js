const express = require('express')
const body_parser = require('body-parser')
const file = require('../util/file.js')
let app = express()
app.get('/', (req, res)=>file.send(`search.html`, res))
app.post('/', body_parser.urlencoded(), (req, res)=>{
	let target = req.body.q||'i should have searched for something'
	target = target.replace(/ /g, '')+'.com'
	res.status(307).set('location', `https://${target}`).end()
})

module.exports = app
