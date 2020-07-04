const fs = require('fs-extra')
const path = require('path')
const logError = require('../server/log-error.js')

module.exports = function (finalPath, finalFileContent) {
  try {
    fs.ensureDirSync(path.parse(finalPath).dir)
    fs.writeFileSync(finalPath, finalFileContent)
  } catch (err) {
    logError(err)
  }
}
