const config = require('./config')
const fs = require('fs-extra')
const path = require('path')
const recursive = require('recursive-readdir')
const plugins = require('./plugins.js')
const runRollup = require('./run-rollup')
const compile = require('./compile.js')
const state = require('./state.js')
const getFileLocation = require('./file-location.js')
const writeFile = require('./write-file.js')
const devScript = require('./dev-script.js')

module.exports = function () {
  console.log('Building..')
  fs.emptyDirSync('public')
  state.filesBuilt = []

  return new Promise((resolve, reject) => {
    recursive(config.build, (err, files) => {
      if (err) {
        reject(err)
      }
      console.log('Pages: ', files)
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
    writeFile(finalPath, addDevScript(finalFileContent))
  } catch (err) { console.log(err) }
}

function addDevScript (fileContent) {
  if (state.mode === 'dev') {
    let addedScript = false
    return fileContent.replace('</head>', () => {
      if (!addedScript) {
        addedScript = true
        return devScript + '</head>'
      }
    })
  } else {
    return fileContent
  }
}
