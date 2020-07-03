const defaultConfig = require('./keystone.default.config.js')

const path = require('path')
const customConfig = require(path.resolve(process.cwd(), 'keystone.config.js'))

module.exports = {
  ...defaultConfig,
  ...customConfig
}
