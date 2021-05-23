const fs = require('fs')
const nodemailer = require('nodemailer')

let E = module.exports

let account
const test_account = () => new Promise((resolve, reject) => {
  nodemailer.createTestAccount((err, data) => {
    if (err) {
      return reject(err)
    }
    resolve(data)
  })
})

const read_cached_account = ()=>{
  try {
    let data = fs.readFileSync('/tmp/account.json').toString()
    return JSON.parse(data)
  } catch (e) { return null }
}
const write_cached_account = account=>
  fs.writeFileSync('/tmp/account.json', JSON.stringify(account))

E.send = async opt => {
  account = read_cached_account()
  if (!account) {
    account = await test_account()
  }
  write_cached_account(account)
  let transport = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: account,
  })
  opt.from = `"POINTLESS SHOUTY BOT" <shout@pointless.services>`
  return new Promise((resolve, reject) => {
    try {
      transport.sendMail(opt, (err, res) => {
        if (err) {
          return reject(err)
        }
        console.log('Message URL:', nodemailer.getMessageUrl(res))
        resolve(res)
      })
    } catch (e) { reject(e) }
  })
}
