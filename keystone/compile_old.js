const fs = require('fs-extra')
// const plugins = require('./plugins.js')
const runRollup = require('./run-rollup.js')
const path = require('path')
const state = require('./state.js')
const logError = require('./log-error.js')

const compileTypes = {
  import: addImport,
  path: addPath,
  script: addScript,
  style: addStyle
}

module.exports = async function ({ fileContent, fileObj, fileName }) {
  return compiler(fileContent, fileObj, fileName)
}

async function compiler (fileContent, fileObj, fileName) {
  const asyncPromises = []
  const asyncResults = []
  const varRegex = /<<([^<>]+)=([^<>]+)>>/igm
  fileContent.replace(varRegex, (match, p1, p2) => {
    asyncPromises.push(new Promise((resolve, reject) => {
      const command = { func: p1.trim(), val: p2.trim() }
      if (Object.keys(compileTypes).includes(command.func)) {
        compileTypes[command.func](command.val, fileObj, fileName).then(res => {
          asyncResults.push(res || match)
          resolve()
          return match
        }).catch(error => logError(error, { name: fileName }))
      } else {
        asyncResults.push(match)
        resolve()
        return match
      }
    }))
  })

  return Promise.all(asyncPromises).then(() => {
    let count = 0
    const newFileContent = fileContent.replace(varRegex, (match, p1, p2) => {
      return asyncResults[count++]
    })
    return newFileContent
  })
}

async function addPath (filePath) {
  return filePath
}

async function addScript (filePath, fileObj) {
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

async function addStyle (filePath) {
  const newPath = path.join('css', path.parse(filePath).name + '.css')
  const scriptContent = fs.readFileSync(filePath, 'utf-8')
  const publicPath = path.join('public', newPath)
  if (!alreadyCompiled(filePath)) {
    fs.ensureDirSync(path.join('public', 'css'))
    fs.writeFileSync(publicPath, scriptContent)
  }
  return '<link rel="stylesheet" href="' + newPath + '">'
}

async function addImport (filePath) {
  filePath = path.normalize(filePath)
  try {
    if (fs.existsSync(filePath)) {
      const fileObj = path.parse(filePath)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const newFile = await runRollup(fileContent, fileObj, filePath)
      newFile.fileContent = await compiler(newFile.fileContent)
      return await newFile.fileContent
    } else {
      return false
    }
  } catch (error) {
    logError(error, { path: filePath })
    return false
  }
}

function alreadyCompiled (filePath) {
  return state.filesBuilt.includes(path.normalize(filePath))
}
