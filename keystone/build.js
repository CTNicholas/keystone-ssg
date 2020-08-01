const config = require('./config')
const state = require('./state.js')

const fs = require('fs-extra')
const path = require('path')
const recursive = require('recursive-readdir')

const ROLLUP = require('./builder/rollup.js')
const COMPILE = require('./builder/compile.js')
const LOCATION = require('./builder/location.js')
const SCRIPTS = require('./builder/scripts.js')
const SEARCH = require('./builder/search.js')
const WRITE = require('./builder/write.js')

const logError = require('./server/log-error.js')
const logServer = require('./server/log-server.js')

module.exports = function () {
  logServer.startBuild()
  fs.emptyDirSync(config.served)
  state.filesBuilt = []

  if (!fs.existsSync(config.build)) {
    fs.mkdirSync(config.build)
  }

  return new Promise((resolve, reject) => {
    recursive(config.build, async (err, files) => {
      if (err) {
        reject(err)
      }
      if (files.length === 0) {
        buildSplashPage()
      }

      const buildPromises = []
      buildPromises.push(copyAssets())
      for (const filePath of files) {
        logServer.bundling(filePath)
        buildPromises.push(buildFile(filePath))
      }

      await Promise.all(buildPromises)
      SEARCH.create()
      logServer.endBuild()
      resolve()
    })
  }).catch(logError)
}

async function buildFile (filePath) {
  try {
    state.filesBuilt.push(path.normalize(filePath))
    const fileObj = path.parse(filePath)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const newFile = await ROLLUP(fileContent, fileObj, filePath)
    const finalFileContent = await COMPILE(newFile, fileObj)
    const newPath = path.normalize(path.join(fileObj.dir, newFile.fileName))
    const finalPath = LOCATION(newPath)
    const finalScriptedContent = await SCRIPTS(finalFileContent, path.parse(finalPath), finalPath)
    SEARCH.add(finalScriptedContent, finalPath)
    WRITE(finalPath, finalScriptedContent)
  } catch (err) { logError(err, { path: filePath }) }
}

async function copyAssets () {
  logServer.bundling('assets')
  return await fs.copy('assets', config.served)
}

function buildSplashPage () {
  const emptyPages = require('./server/splash.js')
  fs.appendFileSync(path.join(config.build, 'index.html'), emptyPages)
  console.log('No index.html, default splash page built')
}

