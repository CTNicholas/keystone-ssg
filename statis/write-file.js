const fs = require('fs-extra')
const path = require('path')

module.exports = function (finalPath, finalFileContent) {
  console.log('ENSURE', path.parse(finalPath).dir)
  fs.ensureDir(path.parse(finalPath).dir)
  fs.writeFileSync(finalPath, finalFileContent)
}
