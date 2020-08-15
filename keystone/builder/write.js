const fs = require('fs-extra')
const path = require('path')
const logError = require('../server/log-error.js')

module.exports = function (file) {
  const { filePath, fileContent } = file.new
  try {
    fs.ensureDirSync(path.parse(filePath).dir)
    fs.writeFileSync(filePath, fileContent)
  } catch (err) {
    logError(err)
  }
}
