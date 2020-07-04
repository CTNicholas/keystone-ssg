const config = require('./config')
const fs = require('fs-extra')
const path = require('path')
const recursive = require('recursive-readdir')
const runRollup = require('./builder/rollup')
const compile = require('./builder/compile.js')
const state = require('./state.js')
const getFileLocation = require('./builder/location.js')
const writeFile = require('./builder/write.js')
const addScripts = require('./builder/scripts.js')
const logError = require('./server/log-error.js')

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
