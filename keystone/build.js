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

module.exports = function (fileChanges = false) {
  const fileChanged = newFileChanged(fileChanges)
  logServer.startBuild()
  if (!fileChanges) {
    fs.emptyDirSync(config.served)
  }
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
        let file = state.getFile(filePath) || new File(filePath)
        if (fileChanged(file)) {
          if (state.hasFile(file)) {
            state.removeFile(file)
            file = new File(filePath)
          }
          state.addFile(file)
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
    await ROLLUP(file)
    await COMPILE(file)
    await LOCATION(file)
    await SCRIPTS(file)
    SEARCH.add(file)
    WRITE(file)
  } catch (err) { logError(err, { path: file.old.filePath }) }
}

function newFileChanged (fileChanges) {
  return function (file) {
    if (!fileChanges) {
      return true
    }
    for (const [num, change] of Object.entries(fileChanges)) {
      if (change.File === file.old.filePath || file.has(change.File)) {
        return true
      }
    }
    return false
  }
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

