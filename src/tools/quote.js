const _ = require('lodash')
const xkcdpass = require('xkcdpass')
const faker = require('faker')

module.exports = (req, res, next) => {
  let plan = []
  _.times(11, i => {
    plan.push(!(i % 2) ? ['word'] : ' ')
  })
  plan.push('.')
  let quote = '' + xkcdpass.generate({plan})
  quote = quote[0].toUpperCase() + quote.slice(1)
  let who = faker.name.firstName()
  who = `${who} ${who}son`
  res.set('Content-Type', 'text/plain')
  res.send(`${quote}\n- ${who}`)
}
