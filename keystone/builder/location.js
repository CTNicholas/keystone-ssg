const config = require('../config.js')
const path = require('path')

const dirFuncs = {
  '.html': {
    pages: pagesLocation
  },
  '.css': {
    style: styleLocation
  },
  '.js': {
    script: scriptLocation
  }
}

module.exports = function (file) {
  const { fileObj, filePath } = file.new
  const dirName = fileObj.dir.split(path.sep)[0]
  switch (fileObj.ext) {
    case '.js':
      return scriptLocation(filePath, fileObj, file)
    case '.css':
      return styleLocation(filePath, fileObj, file)
    default:
      return doHtml(filePath, fileObj, dirName, file)
  }
}

function doHtml (filePath, fileObj, dirName, file) {
  return dirFuncs['.html']['pages'](filePath, fileObj, file)
}

function pagesLocation (filePath, fileObj, file) {
  const fileSplit = fileObj.dir.split(path.sep).length > 1 ? fileObj.dir.split(path.sep).slice(1).join(path.sep) : ''
  if (fileObj.name === 'index') {
    file.newFilePath(path.join(config.served, fileSplit, 'index.html'))
    return true
  } else {
    file.newFilePath(path.join(config.served, fileSplit, fileObj.name, 'index.html'))
    return true
  }
}

function styleLocation (filePath, fileObj, file) {
  file.newFilePath(path.join(config.served, 'css', fileObj.base))
  return true
}

function scriptLocation (filePath, fileObj, file) {
  file.newFilePath(path.join(config.served, 'js', fileObj.base))
  return true
}
