let e = process.env
module.exports = {
  port: e.PORT || 80,
  is_development: e.NODE_ENV !== 'production',
  is_production: e.NODE_ENV === 'production',
}
