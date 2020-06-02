const fs = require('fs-extra')
const plugins = require('./plugins.js')
const path = require('path')

const compileTypes = {
  import: addImport,
  path: addPath,
  script: addScript,
  style: addStyle
}

module.exports = function ({ fileContent, fileName }) {
  return compiler(fileContent)
}

function compiler (fileContent, fileName) {
  // console.log('before content:', fileContent)
  const varRegex = /<<([^<>]+)=([^<>]+)>>/igm
  fileContent = fileContent.replace(varRegex, (match, p1, p2) => {
    console.log('MATCHES', match, p1, p2)
    const command = { func: p1.trim(), val: p2.trim() }
    if (Object.keys(compileTypes).includes(command.func)) {
      console.log('got f', command)
      return compileTypes[command.func](command.val, fileName) || match
    } else {
      return match
    }
  })
  return fileContent
}

function addPath (filePath) {
  return filePath
}

function addScript (filePath) {
  // Need to runPlugins()
  const newPath = path.join('js', path.parse(filePath).base)
  const scriptContent = fs.readFileSync(filePath, 'utf-8')
  const publicPath = path.join('public', newPath)
  fs.ensureDirSync(path.join('public', 'js'))
  fs.writeFileSync(publicPath, scriptContent)
  return '<script src="' + newPath + '"></script>'
}

function addStyle (filePath) {
  // Need to runPlugins()
  const newPath = path.join('css', path.parse(filePath).base)
  const scriptContent = fs.readFileSync(filePath, 'utf-8')
  console.log('CONTEN', scriptContent)
  const publicPath = path.join('public', newPath)
  fs.ensureDirSync(path.join('public', 'css'))
  fs.writeFileSync(publicPath, scriptContent)
  return '<link rel="stylesheet" href="' + newPath + '">'
}

function addImport (filePath) {
  filePath = path.normalize(filePath)
  console.log(2, filePath)
  try {
    if (fs.existsSync(filePath)) {
      console.log('exist')
      const fileObj = path.parse(filePath)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const newFile = plugins(fileContent, fileObj, filePath)
      newFile.fileContent = compiler(newFile.fileContent)
      return newFile.fileContent
    } else {
      return false
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

