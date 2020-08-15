const fs = require('fs-extra')
const path = require('path')

class File {
  constructor (filePath) {
    this.old = {
      filePath: filePath,
      fileObj: path.parse(filePath),
      fileContent: fs.readFileSync(filePath, 'utf-8')
    }
    this.new = {
      filePath: null, // build this in ROLLUP
      fileObj: null, // and this
      fileContent: null,
      sourceMap: null
    }
  }
}
