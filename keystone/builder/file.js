const fs = require('fs-extra')
const path = require('path')

module.exports = class File {
  constructor (filePath) {
    const normalPath = path.normalize(filePath)
    this.old = {
      filePath: normalPath,
      fileObj: path.parse(normalPath),
      fileContent: fs.readFileSync(normalPath, 'utf-8') || ''
    }
    this.new = {
      fileName: null,
      filePath: null, // build this in ROLLUP
      fileObj: null, // and this
      fileContent: null,
      sourceMap: null
    }
    this.mainFile = null
    this.contains = []
  }

  add (fileObj) {
    const filePath = path.join(fileObj.dir, fileObj.base)
    if (!this.contains.includes(filePath)) {
      this.contains.push(filePath)
    }
  }

  newFilePath (newPath) {
    this.new.filePath = newPath
    this.new.fileObj = path.parse(this.new.filePath)
  }

  has (filePath) {
    return this.contains.includes(filePath)
  }
}
