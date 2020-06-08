const config = require('./config')
const fs = require('fs-extra')
const path = require('path')
const recursive = require('recursive-readdir')
// const plugins = require('./plugins.js')
const runRollup = require('./run-rollup')
const compile = require('./compile.js')
const state = require('./state.js')
const getFileLocation = require('./file-location.js')
const writeFile = require('./write-file.js')
const addScripts = require('./add-scripts.js')
const logError = require('./log-error.js')

module.exports = function () {
  console.log('Building..')
  fs.emptyDirSync('public')
  state.filesBuilt = []

  return new Promise((resolve, reject) => {
    recursive(config.build, (err, files) => {
      if (err) {
        reject(err)
      }
      for (const filePath of files) {
        buildFile(filePath)
      }
      resolve()
    })
  })
}

async function buildFile (filePath) {
  try {
    state.filesBuilt.push(path.normalize(filePath))
    const fileObj = path.parse(filePath)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const newFile = await runRollup(fileContent, fileObj, filePath)
    const finalFileContent = await compile(newFile, fileObj)
    const newPath = path.normalize(path.join(fileObj.dir, newFile.fileName))
    const finalPath = getFileLocation(newPath)
    const finalScriptedContent = addScripts(finalFileContent, path.parse(finalPath))
    writeFile(finalPath, finalScriptedContent)
  } catch (err) { logError(err) }
}
