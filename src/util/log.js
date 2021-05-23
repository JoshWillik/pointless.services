// STUB josh: replace with winston or something
exports.info = (...args) => {
  console.log('INFO', new Date(), ...args)
}
exports.error = (...args) => {
  console.error('ERROR', new Date(), ...args)
}
