const config = require('./config')
const state = require('./state.js')

const fs = require('fs-extra')
const path = require('path')
const recursive = require('recursive-readdir')

const File = require('./builder/file.js')

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
        const file = new File(filePath)
        if (fileChanged(file)) {
          logServer.bundling(file.old.filePath)
          buildPromises.push(buildFile(file))
        }
      }

      await Promise.all(buildPromises)
      SEARCH.create()
      logServer.endBuild()
      resolve()
    })
  }).catch(logError)
}

async function buildFile (file) {
  try {
    state.filesBuilt.push(file.old.filePath)
    // const fileObj = path.parse(filePath)
    // const fileContent = fs.readFileSync(filePath, 'utf-8')
    // const newFile = await ROLLUP(fileContent, fileObj, filePath)
    await ROLLUP(file)
    //const finalFileContent = await COMPILE(newFile, fileObj)
    await COMPILE(file)
    /*
    if (file.new.filePath === null) {
      file.newFilePath(path.normalize(path.join(fileObj.dir, newFile.fileName)))
    }
    */
    // const newPath = path.normalize(path.join(fileObj.dir, newFile.fileName))
    // const finalPath = LOCATION(newPath)
    await LOCATION(file)
    // const finalScriptedContent = await SCRIPTS(finalFileContent, path.parse(finalPath), finalPath)
    await SCRIPTS(file)
    SEARCH.add(file)
    WRITE(file)
    console.log(file.old.filePath, file.contains)
  } catch (err) { logError(err, { path: file.old.filePath }) }
}

function fileChanged () {
  return true
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

