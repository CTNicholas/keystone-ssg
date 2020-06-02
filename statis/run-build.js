const config = require('./config')
const fs = require('fs')
const path = require('path')
const recursive = require('recursive-readdir')
const plugins = require('./plugins.js')
const compile = require('./compile.js')
const state = require('./state.js')
const getFileLocation = require('./file-location.js')
const devScript = require('./dev-script.js')

module.exports = function () {
  console.log('Building..')

  return new Promise((resolve, reject) => {
    recursive(config.build, (err, files) => {
      if (err) {
        reject(err)
      }
      console.log(files, config.build)

      let baseDirs = path.normalize(config.build).split(path.sep)
      if (baseDirs[baseDirs.length - 1] === '') {
        baseDirs = baseDirs.slice(0, -1)
      }

      baseDirs = baseDirs.length
      console.log('Compiling')
      for (let filePath of files) {
        const fileObj = path.parse(filePath)
        console.log(1, filePath)
        const fileContent = fs.readFileSync(filePath, 'utf-8')

        const newFile = plugins(fileContent, fileObj, filePath)
        const finalFileContent = addDevScript(compile(newFile.fileContent))

        const newPath = path.normalize(path.join(fileObj.dir, newFile.fileName))
        const finalPath = getFileLocation(newPath)
        console.log('FINALPATH', finalPath, newPath)
        fs.writeFileSync(finalPath, finalFileContent)
        console.log('File written!')

        filePath = filePath.split(path.sep).slice(baseDirs).join(path.sep)
        console.log('FP:', filePath)
      }
      resolve()
    })
  })
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
  }
}
