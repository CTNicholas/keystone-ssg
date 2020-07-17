const defaultConfig = require('./keystone.default.config.js')

const fs = require('fs-extra')
const path = require('path')

let customConfig = {}
const customConfigPath = path.resolve(process.cwd(), 'keystone.config.js')
try {
  if (fs.existsSync(customConfigPath)) {
    customConfig = require(customConfigPath)
  } else {
    console.warn('No keystone.config.js file found, using defaults')
  }
} catch (err) {
  console.warn('Error in keystone.config.js file, using defaults', err)
}

module.exports = {
  ...defaultConfig,
  ...customConfig
}
