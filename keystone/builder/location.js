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

module.exports = function (filePath) {
  const fileObj = path.parse(filePath)
  const dirName = fileObj.dir.split(path.sep)[0]
  switch (fileObj.ext) {
    case '.js':
      return scriptLocation(filePath, fileObj)
    case '.css':
      return styleLocation(filePath, fileObj)
    default:
      return doHtml(filePath, fileObj, dirName)
  }
}

function doHtml (filePath, fileObj, dirName) {
  return dirFuncs['.html']['pages'](filePath, fileObj)
}

function pagesLocation (filePath, fileObj) {
  const fileSplit = fileObj.dir.split(path.sep).length > 1 ? fileObj.dir.split(path.sep).slice(1).join(path.sep) : ''
  if (fileObj.name === 'index') {
    return path.join(config.served, fileSplit, 'index.html')
  } else {
    return path.join(config.served, fileSplit, fileObj.name, 'index.html')
  }
}

function styleLocation (filePath, fileObj) {
  return path.join(config.served, 'css', fileObj.base)
}

function scriptLocation (filePath, fileObj) {
  return path.join(config.served, 'js', fileObj.base)
}
