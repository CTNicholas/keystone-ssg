const fs = require('fs-extra')
const plugins = require('./plugins.js')
const runRollup = require('./run-rollup.js')
const path = require('path')
const state = require('./state.js')

const compileTypes = {
  import: addImport,
  path: addPath,
  script: addScript,
  style: addStyle
}

module.exports = function ({ fileContent, fileObj, fileName }) {
  return compiler(fileContent, fileObj, fileName)
}

function compiler (fileContent, fileObj, fileName) {
  // console.log('before content:', fileContent)
  const varRegex = /<<([^<>]+)=([^<>]+)>>/igm
  fileContent = fileContent.replace(varRegex, (match, p1, p2) => {
    console.log('MATCHES', match, p1, p2)
    const command = { func: p1.trim(), val: p2.trim() }
    if (Object.keys(compileTypes).includes(command.func)) {
      console.log('got f', command)
      return compileTypes[command.func](command.val, fileObj, fileName) || match
    } else {
      return match
    }
  })
  return fileContent
}

function addPath (filePath) {
  return filePath
}

function addScript (filePath, fileObj) {
  // Need to runPlugins()
  const newPath = path.join('js', path.parse(filePath).name + '.js')
  const scriptContent = fs.readFileSync(filePath, 'utf-8')
  const publicPath = path.join('public', newPath)
  if (!alreadyCompiled(filePath)) {
    runRollup(scriptContent, fileObj, newPath).then(result => {
      fs.ensureDirSync(path.join('public', 'js'))
      fs.writeFileSync(publicPath, result.fileContent)
    })
  }
  return '<script src="' + newPath + '"></script>'
}

function addStyle (filePath) {
  // Need to runPlugins()
  const newPath = path.join('css', path.parse(filePath).name + '.css')
  const scriptContent = fs.readFileSync(filePath, 'utf-8')
  console.log('CONTEN', scriptContent)
  const publicPath = path.join('public', newPath)
  if (!alreadyCompiled(filePath)) {
    fs.ensureDirSync(path.join('public', 'css'))
    fs.writeFileSync(publicPath, scriptContent)
  }
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
      const newFile = runRollup(fileContent, fileObj, filePath) // need to use then
      console.log('sfagfd', newFile.fileContent)
      newFile.fileContent = compiler(newFile.fileContent)
      return newFile.fileContent // and return promise
    } else {
      return false
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

function alreadyCompiled (filePath) {
  return state.filesBuilt.includes(filePath)
}
