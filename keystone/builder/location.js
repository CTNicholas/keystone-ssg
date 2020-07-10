const path = require('path')

const dirFuncs = {
  '.html': {
    pages: pagesLocation
  },
  '.htm': {
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
    case '.html':
      return doHtml(filePath, fileObj, dirName)
    case '.htm':
      return doHtml(filePath, fileObj, dirName)
    case '.js':
      return scriptLocation(filePath, fileObj)
    case '.css':
      return styleLocation(filePath, fileObj)
    default:
      console.log('err pls', fileObj.base)
      return path.join('public', 'err', fileObj.base)
  }
}

function doHtml (filePath, fileObj, dirName) {
  if (Object.keys(dirFuncs[fileObj.ext]).includes(dirName)) {
    return dirFuncs[fileObj.ext][dirName](filePath, fileObj)
  } else {
    return false
  }
}

function pagesLocation (filePath, fileObj) {
  if (fileObj.ext === '.html' || fileObj.ext === '.htm') {
    const fileSplit = fileObj.dir.split(path.sep).length > 1 ? fileObj.dir.split(path.sep).slice(1).join(path.sep) : ''
    if (fileObj.base === 'index.html' || fileObj.ext === 'index.htm') {
      return path.join('public', fileSplit, 'index.html')
    } else {
      return path.join('public', fileSplit, fileObj.name, 'index.html')
    }
  }
  return 'err/' + fileObj.base
}

function styleLocation (filePath, fileObj) {
  return path.join('public', 'css', fileObj.base)
}

function scriptLocation (filePath, fileObj) {
  return path.join('public', 'js', fileObj.base)
}
