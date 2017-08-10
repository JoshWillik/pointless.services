const util = require('util')
const path = require('path')
const root = path.join(__dirname, '..', 'public')
let E = module.exports

E.send = (path, res) => {
  return util.promisify(res.sendFile.bind(res))(path, {root})
}
