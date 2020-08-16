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
const File = require('./builder/file.js')

const BUILD_PROCESS = [
  ROLLUP,
  COMPILE,
  LOCATION,
  SCRIPTS,
  SEARCH.add,
  WRITE
]

module.exports = function (fileChanges = false) {
  const fileChanged = newFileChanged(fileChanges)
  const buildPromises = []
  state.filesBuilt = []
  logServer.startBuild()

  if (!fs.existsSync(config.build)) {
    fs.mkdirSync(config.build)
  }

  if (!fileChanges) {
    fs.emptyDirSync(config.served)
    buildPromises.push(copyAssets())
  }

  return new Promise((resolve, reject) => {
    recursive(config.build, async (err, files) => {
      if (err) { reject(err) }

      if (files.length === 0) {
        buildSplashPage()
      }

      if (assetChanged(fileChanges)) {
        buildPromises.push(copyAssets())
      }

      for (const filePath of files) {
        let file = state.getFile(filePath) || new File(filePath)
        if (config.fullRecompile || fileChanged(file)) {
          if (state.hasFile(file)) {
            state.removeFile(file)
            file = new File(filePath)
          }
          state.addFile(file)
          logServer.bundling(file.old.filePath)
          state.filesBuilt.push(file.old.filePath)
          const BUILD = buildFile(file)
          buildPromises.push(BUILD)
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
    for (const process of BUILD_PROCESS) {
      await process(file)
    }
  } catch (err) { logError(err, { path: file.old.filePath }) }
}

function newFileChanged (fileChanges) {
  const cancelEvents = ['add', 'unlink']
  return function (file) {
    if (!fileChanges) {
      return true
    }

    for (const [num, change] of Object.entries(fileChanges)) {

      // TEMPORARY, only speed up when main build files changed ('pages' folder)
      if (!change.File.startsWith(config.build)) {
        return true
      }

      if (cancelEvents.includes(change.Events)) {
        return true
      }
      if (change.File === file.old.filePath || file.has(change.File)) {
        return true
      }
      if (change.File.endsWith('.css') || change.File.endsWith('.sass') || change.File.endsWith('.scss')) {
        const containsCss = file.contains.some(p => {
          const fileExt = path.parse(p).ext
          return fileExt === '.scss' || fileExt === '.sass'
        })
        if (containsCss) {
          return true
        }
      }
    }
    return false
  }
}

function assetChanged (fileChanges) {
  for (const [num, change] of Object.entries(fileChanges)) {
    if (change.File.startsWith('assets')) {
      return true
    }
  }
  return false
}

async function copyAssets (fileChanges) {
  logServer.bundling('assets')
  return await fs.copy('assets', config.served)
}

function buildSplashPage () {
  const emptyPages = require('./server/splash.js')
  fs.appendFileSync(path.join(config.build, 'index.html'), emptyPages)
  console.log('No index.html, default splash page built')
}
