const config = require('./config')
const Router = require('express').Router
const file = require('./util/file')
const Sqs = require('aws-sdk/clients/sqs')
const Ses = require('aws-sdk/clients/ses')
const log = require('./util/log')
const simple_parser = require('mailparser').simpleParser
const mail = require('./util/mail')

let E = module.exports

E.routes = () => {
  let app = new Router()
  app.get('/', (req, res, next) => {
    file.send('shout.html', res).catch(next)
  })
  let shouts = 23
  app.get('/shouts', (req, res, next) => {
    res.json({shouts: shouts++})
  })
  return app
}

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const reply_to = async email => {
  let to = `"${email.from.value[0].name}" <${email.from.value[0].address}>`
  let message = await mail.send({
    to,
    subject: 'RE: '+email.subject.toUpperCase(),
    text: (email.text+'\n-----------\nIf this bot is bothering you, send a message to abuse@pointless.services')
    .toUpperCase(),
  })
}

const process_queue_item = async message => {
  console.log(`Processing ${message.MessageId}`)
  let email = await simple_parser(message.Body)
  await reply_to(email)
  await sleep(1e3)
}

E.init = async () => {
  let sqs = new Sqs({
    apiVersion: '2012-11-05',
    region: 'us-east-1',
  })
  let queue = await sqs.getQueueUrl({QueueName: 'shout_pointless_services'})
    .promise()
  while (true) {
    log.info('Processing shout@pointless.services emails')
    while (true) {
      let res = await sqs.receiveMessage({
        QueueUrl: queue.QueueUrl,
      }).promise()
      if (!res.Messages) {
        break
      }
      for (let message of res.Messages) {
        await process_queue_item(message)
      }
    }
    log.info('Done processing shout@pointless.services emails')
    await sleep(config.is_development ? 10e3 : 60e3)
  }
}
