const defaultConfig = require('./statis.default.config.js')

const path = require('path')
const customConfig = require(path.resolve(process.cwd(), 'statis.config.js'))

module.exports = {
  ...defaultConfig,
  ...customConfig
}
