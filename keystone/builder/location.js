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
      // return path.join(config.served, 'err', fileObj.base)
  }
}

function doHtml (filePath, fileObj, dirName) {
  //if (Object.keys(dirFuncs[fileObj.ext]).includes(dirName)) {
    return dirFuncs['.html']['pages'](filePath, fileObj) // || false
 // } else {
 //   return false
  //}
}

function pagesLocation (filePath, fileObj) {
  //if (fileObj.ext === '.html' || fileObj.ext === '.htm') {
    const fileSplit = fileObj.dir.split(path.sep).length > 1 ? fileObj.dir.split(path.sep).slice(1).join(path.sep) : ''
    if (fileObj.name === 'index') {
      return path.join(config.served, fileSplit, 'index.html')
    } else {
      return path.join(config.served, fileSplit, fileObj.name, 'index.html')
    }
  //}
  //return 'err/' + fileObj.base
}

function styleLocation (filePath, fileObj) {
  return path.join(config.served, 'css', fileObj.base)
}

function scriptLocation (filePath, fileObj) {
  return path.join(config.served, 'js', fileObj.base)
}
