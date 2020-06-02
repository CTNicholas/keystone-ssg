const path = require('path')

const dirFuncs = {
  pages: pagesLocation
}

module.exports = function (filePath) {
  const fileObj = path.parse(filePath)
  const dirName = fileObj.dir.split(path.sep)[0]
  console.log('dir', dirName, filePath)
  if (Object.keys(dirFuncs).includes(dirName)) {
    return dirFuncs[dirName](filePath, fileObj)
  } else {
    return false
  }
}

function pagesLocation (filePath, fileObj) {
  
  if (fileObj.ext === '.html') {
    const fileSplit = fileObj.dir.split(path.sep).length > 1 ? fileObj.dir.split(path.sep).slice(1).join(path.sep) : ''
    console.log('FSPLIT', fileSplit)
    if (fileObj.base === 'index.html') {
      console.log(path.join('public', fileSplit, fileObj.base))
      return path.join('public', fileSplit, fileObj.base)
    } else {
      console.log('pls')
      console.log(path.join('public', fileSplit, fileObj.name, 'index.html'))
      console.log('pls')
      return path.join('public', fileSplit, fileObj.name, 'index.html')
    }
  }
  return 'err/' + fileObj.base
}
